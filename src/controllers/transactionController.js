const { PrismaClient } = require("@prisma/client");
const SquadService = require("../services/SquadService");
const AIService = require("../services/AIService");
const winston = require("winston");

const prisma = new PrismaClient();
const logger = winston.getLogger ? winston.getLogger() : console;

/**
 * Get Pension Account Details
 */
const getPensionAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pension = await prisma.pensionAccount.findUnique({
      where: { userId },
    });

    if (!pension) {
      return res.status(404).json({
        success: false,
        message: "Pension account not found",
      });
    }

    // Calculate projected retirement income
    const projectedIncome = await calculateProjectedRetirementIncome(pension);

    res.json({
      success: true,
      pension: {
        ...pension,
        projectedRetirementIncome: projectedIncome,
      },
    });
  } catch (error) {
    logger.error(`Get pension account error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pension account",
      error: error.message,
    });
  }
};

/**
 * Calculate Projected Retirement Income
 */
const calculateProjectedRetirementIncome = async (pensionAccount) => {
  const { totalContributions, contributionCount, projectededAge } = pensionAccount;
  const avgContribution = contributionCount > 0 ? totalContributions / contributionCount : 0;
  const yearsToRetirement = Math.max(0, 65 - (new Date().getFullYear() % 100));

  return Math.round(avgContribution * 12 * yearsToRetirement * 1.05); // 5% growth
};

/**
 * Get Savings Wallet
 */
const getSavingsWallet = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wallet = await prisma.savingsWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Savings wallet not found",
      });
    }

    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    logger.error(`Get savings wallet error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch savings wallet",
      error: error.message,
    });
  }
};

/**
 * Update Savings Goal
 */
const setSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { goalName, targetAmount, targetDate } = req.body;

    const wallet = await prisma.savingsWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Savings wallet not found",
      });
    }

    const goals = [...(wallet.savingsGoals || [])];
    goals.push({
      name: goalName,
      targetAmount,
      targetDate,
      createdAt: new Date().toISOString(),
    });

    const updated = await prisma.savingsWallet.update({
      where: { userId },
      data: { savingsGoals: goals },
    });

    res.json({
      success: true,
      message: "Savings goal added",
      wallet: updated,
    });
  } catch (error) {
    logger.error(`Set savings goal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to set savings goal",
      error: error.message,
    });
  }
};

/**
 * Initiate Squad Escrow for Gig
 * Called when trader funds escrow for a gig
 */
const initiateGigEscrow = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gigId } = req.params;

    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only gig creator can initiate escrow",
      });
    }

    // Call Squad API to initiate escrow
    const escrowResult = await SquadService.initiateEscrow(userId, gigId, gig.paymentAmount);

    if (!escrowResult.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to initiate escrow",
        error: escrowResult.error,
      });
    }

    // Update gig with escrow details
    const updated = await prisma.gig.update({
      where: { id: gigId },
      data: {
        squadEscrowId: escrowResult.squadEscrowId,
        escrowStatus: "initiated",
        escrowAmount: gig.paymentAmount,
        status: "IN_PROGRESS",
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        gigId,
        fromUserId: userId,
        amount: gig.paymentAmount,
        transactionType: "ESCROW_FUND",
        squadTransactionId: escrowResult.squadEscrowId,
        squadStatus: "pending",
        status: "PROCESSING",
      },
    });

    res.json({
      success: true,
      message: "Escrow initiated successfully",
      escrow: escrowResult.data,
      gig: updated,
    });
  } catch (error) {
    logger.error(`Initiate escrow error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to initiate escrow",
      error: error.message,
    });
  }
};

/**
 * Release Escrow with Auto Pension Transfer
 * Called when gig is completed
 */
const releaseGigPaymentWithPension = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gigId, workerUserId } = req.params;
    const { pensionPercentage = 5 } = req.body;

    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only gig creator can release payment",
      });
    }

    if (!gig.squadEscrowId) {
      return res.status(400).json({
        success: false,
        message: "Escrow not initiated for this gig",
      });
    }

    // Release escrow with auto pension deduction
    const releaseResult = await SquadService.releaseEscrowWithPension(
      workerUserId,
      gig.paymentAmount,
      gig.squadEscrowId,
      pensionPercentage
    );

    if (!releaseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to release payment",
        error: releaseResult.error,
      });
    }

    // Update transaction records
    const pensionAmount = (gig.paymentAmount * pensionPercentage) / 100;
    const netAmount = gig.paymentAmount - pensionAmount;

    await Promise.all([
      // Net payment transaction
      prisma.transaction.create({
        data: {
          gigId,
          fromUserId: userId,
          toUserId: workerUserId,
          amount: gig.paymentAmount,
          pensionContribution: pensionAmount,
          netAmount: netAmount,
          transactionType: "ESCROW_RELEASE",
          squadTransactionId: releaseResult.netPayout.paymentReference,
          escrowId: gig.squadEscrowId,
          status: "COMPLETED",
        },
      }),
      // Update gig status
      prisma.gig.update({
        where: { id: gigId },
        data: {
          escrowStatus: "released",
          status: "COMPLETED",
          completedAt: new Date(),
        },
      }),
      // Update worker pension account
      prisma.pensionAccount.update({
        where: { userId: workerUserId },
        data: {
          pensionBalance: { increment: pensionAmount },
          totalContributions: { increment: pensionAmount },
          contributionCount: { increment: 1 },
          lastContributionDate: new Date(),
        },
      }),
      // Update worker economic identity score
      updateWorkerEconomicScore(workerUserId),
    ]);

    res.json({
      success: true,
      message: "Payment released and pension transferred",
      paymentDetails: releaseResult.netPayout,
    });
  } catch (error) {
    logger.error(`Release payment error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to release payment",
      error: error.message,
    });
  }
};

/**
 * Update Worker Economic Score (after pension contribution)
 */
const updateWorkerEconomicScore = async (workerUserId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: workerUserId },
      include: {
        workerProfile: true,
        pensionAccount: true,
        trustCredit: true,
      },
    });

    const pensionConsistency = AIService.calculatePensionConsistency({
      totalContributions: user.pensionAccount?.totalContributions || 0,
      contributionCount: user.pensionAccount?.contributionCount || 0,
      monthlyContributions: [],
    });

    const economicScore = AIService.calculateEconomicIdentityScore({
      trustScore: user.trustScore || 0,
      workConsistency: 0,
      skillsVerified: (user.workerProfile?.skills?.length || 0) * 10,
      pensionReliability: pensionConsistency,
      communityTrust: user.communityTrustScore || 0,
      completionRate: user.workerProfile?.completionRate || 0,
      onTimeRate: user.workerProfile?.onTimeCompletionRate || 0,
    });

    await prisma.user.update({
      where: { id: workerUserId },
      data: {
        economicIdentityScore: economicScore,
        trustScore: Math.min(100, (user.trustScore || 0) + 2), // Increment slightly
      },
    });

    // Update trust credit profile
    if (user.trustCredit) {
      await prisma.trustCredit.update({
        where: { id: user.trustCredit.id },
        data: {
          pensionConsistencyScore: pensionConsistency,
          overallTrustScore: economicScore,
          eligible: economicScore >= 70,
        },
      });
    }
  } catch (error) {
    logger.error(`Update economic score error: ${error.message}`);
  }
};

/**
 * Get Transaction History
 */
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, status, page = 1, limit = 20 } = req.query;

    const where = {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    };

    if (type) where.transactionType = type;
    if (status) where.status = status;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            paymentAmount: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.transaction.count({ where });

    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get transaction history error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

module.exports = {
  getPensionAccount,
  getSavingsWallet,
  setSavingsGoal,
  initiateGigEscrow,
  releaseGigPaymentWithPension,
  getTransactionHistory,
};
