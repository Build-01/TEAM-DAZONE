const { PrismaClient } = require("@prisma/client");
const SquadService = require("../services/SquadService");
const winston = require("winston");

const prisma = new PrismaClient();
const logger = winston.getLogger ? winston.getLogger() : console;

/**
 * Handle Squad Webhook Events
 */
const handleSquadWebhook = async (req, res) => {
  try {
    const { signature } = req.headers;
    const payload = req.body;

    // Verify webhook signature
    const isValid = SquadService.verifyWebhookSignature(signature, payload);

    if (!isValid) {
      logger.warn("Invalid webhook signature");
      return res.status(403).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Log webhook
    await prisma.squadWebhookLog.create({
      data: {
        eventType: payload.event,
        webhookPayload: JSON.stringify(payload),
        transactionId: payload.data?.reference,
        status: "received",
      },
    });

    // Process webhook
    const result = await SquadService.handleTransactionWebhook(
      payload.event,
      payload.data
    );

    // Update transaction status based on webhook
    if (payload.data?.reference) {
      await updateTransactionFromWebhook(payload);
    }

    res.json({
      success: true,
      processed: result.processed,
      action: result.action,
    });
  } catch (error) {
    logger.error(`Webhook processing error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};

/**
 * Update Transaction Status from Webhook
 */
const updateTransactionFromWebhook = async (webhookData) => {
  try {
    const transactionReference = webhookData.data?.reference;
    const event = webhookData.event;
    const status = webhookData.data?.status;

    // Find transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { squadTransactionId: transactionReference },
          { squadReference: transactionReference },
        ],
      },
    });

    if (!transaction) {
      logger.warn(`Transaction not found for reference: ${transactionReference}`);
      return;
    }

    // Map Squad status to our status
    let transactionStatus = "PROCESSING";
    if (event.includes("completed")) transactionStatus = "COMPLETED";
    if (event.includes("failed")) transactionStatus = "FAILED";

    // Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: transactionStatus,
        squadStatus: status,
        completedAt: transactionStatus === "COMPLETED" ? new Date() : undefined,
      },
    });

    logger.info(`Transaction ${transaction.id} updated to ${transactionStatus}`);

    // If pension transfer completed, update pension account
    if (
      transaction.transactionType === "PENSION_CONTRIBUTION" &&
      transactionStatus === "COMPLETED"
    ) {
      await updatePensionContribution(transaction.fromUserId, transaction.amount);
    }
  } catch (error) {
    logger.error(`Update transaction from webhook error: ${error.message}`);
  }
};

/**
 * Update Pension Contribution
 */
const updatePensionContribution = async (userId, amount) => {
  try {
    const pension = await prisma.pensionAccount.findUnique({
      where: { userId },
    });

    if (pension) {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const currentMonthCount = await prisma.transaction.count({
        where: {
          fromUserId: userId,
          transactionType: "PENSION_CONTRIBUTION",
          status: "COMPLETED",
          createdAt: {
            gte: new Date(`${currentMonth}-01`),
            lt: new Date(new Date(`${currentMonth}-01`).getTime() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      await prisma.pensionAccount.update({
        where: { userId },
        data: {
          monthlyContributions: { increment: amount },
        },
      });
    }
  } catch (error) {
    logger.error(`Update pension contribution error: ${error.message}`);
  }
};

/**
 * Get Trust Credit Profile
 */
const getTrustCreditProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const trustCredit = await prisma.trustCredit.findUnique({
      where: { userId },
    });

    if (!trustCredit) {
      return res.status(404).json({
        success: false,
        message: "Trust credit profile not found",
      });
    }

    res.json({
      success: true,
      trustCredit,
    });
  } catch (error) {
    logger.error(`Get trust credit error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trust credit profile",
      error: error.message,
    });
  }
};

/**
 * Update Trust Monitoring
 * Called periodically or on demand
 */
const monitorTrustCredit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pensionAccount: true,
        trustCredit: true,
      },
    });

    if (!user || !user.trustCredit) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate current trust signals
    const escrowCompletions = await prisma.transaction.count({
      where: {
        fromUserId: userId,
        transactionType: "ESCROW_RELEASE",
        status: "COMPLETED",
      },
    });

    const totalTransactions = await prisma.transaction.count({
      where: { fromUserId: userId },
    });

    const savingsWallet = await prisma.savingsWallet.findUnique({
      where: { userId },
    });

    const escrowCompletionRate =
      totalTransactions > 0 ? (escrowCompletions / totalTransactions) * 100 : 0;

    const savingsDisciplineScore = savingsWallet?.balance > 0 ? 80 : 0;

    // Update trust credit
    const updated = await prisma.trustCredit.update({
      where: { id: user.trustCredit.id },
      data: {
        escrowCompletionRate,
        savingsDisciplineScore,
        lastMonitoredAt: new Date(),
        eligible: user.economicIdentityScore >= 70,
      },
    });

    res.json({
      success: true,
      message: "Trust credit monitoring updated",
      trustCredit: updated,
      metrics: {
        escrowCompletionRate,
        savingsDisciplineScore,
        pensionConsistency: updated.pensionConsistencyScore,
        overall: updated.overallTrustScore,
      },
    });
  } catch (error) {
    logger.error(`Monitor trust credit error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to monitor trust credit",
      error: error.message,
    });
  }
};

/**
 * Get Trust Credentials (for partner banks)
 * Returns verified trust signals without personal data
 */
const getTrustCredentials = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is requesting own or has permission
    if (req.user.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const trustCredit = await prisma.trustCredit.findUnique({
      where: { userId },
    });

    if (!trustCredit || !trustCredit.eligible) {
      return res.status(404).json({
        success: false,
        message: "Not eligible for trust credit",
      });
    }

    // Return trust credentials (anonymized for sharing with banks)
    const credentials = {
      credentialId: `CRED-${userId.slice(0, 8)}-${Date.now()}`,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      verified: true,
      scores: {
        pensionConsistency: trustCredit.pensionConsistencyScore,
        escrowCompletion: trustCredit.escrowCompletionRate,
        savingsDiscipline: trustCredit.savingsDisciplineScore,
        communityTrust: trustCredit.communityTrustScore,
      },
      overallScore: trustCredit.overallTrustScore,
      recommendedCreditLimit: calculateRecommendedCreditLimit(
        trustCredit.overallTrustScore
      ),
    };

    res.json({
      success: true,
      credentials,
    });
  } catch (error) {
    logger.error(`Get trust credentials error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trust credentials",
      error: error.message,
    });
  }
};

/**
 * Calculate Recommended Credit Limit
 */
const calculateRecommendedCreditLimit = (trustScore) => {
  if (trustScore >= 90) return 500000; // ₦500k
  if (trustScore >= 80) return 300000; // ₦300k
  if (trustScore >= 70) return 150000; // ₦150k
  return 0;
};

module.exports = {
  handleSquadWebhook,
  getTrustCreditProfile,
  monitorTrustCredit,
  getTrustCredentials,
};
