const axios = require("axios");
const winston = require("winston");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const logger = winston.getLogger ? winston.getLogger() : console;

class SquadService {
  constructor() {
    this.apiKey = process.env.SQUAD_API_KEY;
    this.baseUrl = process.env.SQUAD_API_BASE_URL || "https://api.sandbox.squad.co";
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Initialize Escrow Transaction
   * Used when trader funds an escrow for a gig
   */
  async initiateEscrow(traderUserId, gigId, amount, metadata = {}) {
    try {
      const payload = {
        amount: Math.round(amount * 100), // Convert to kobo/smallest unit
        currency: "NGN",
        disbursement_public_key: process.env.SQUAD_DISBURSEMENT_KEY || null,
        unique_code: `ESC-${gigId}-${Date.now()}`,
        narration: `Escrow for Gig ${gigId}`,
        metadata: {
          trader_id: traderUserId,
          gig_id: gigId,
          transaction_type: "gig_escrow",
          ...metadata,
        },
      };

      const response = await this.client.post("/transfer/initiate", payload);

      logger.info(`Escrow initiated: ${response.data.data?.transaction_reference}`);

      return {
        success: true,
        squadEscrowId: response.data.data?.transaction_reference,
        status: "initiated",
        data: response.data.data,
      };
    } catch (error) {
      logger.error(`Escrow initiation failed: ${error.message}`);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Release Escrow Funds to Worker + Auto-deduct Pension & Savings
   * Called when gig is completed and confirmed by both parties
   */
  async releaseEscrowWithPension(
    workerUserId,
    gigAmount,
    escrowId,
    pensionPercentage = 5,
    savingsPercentage = 0,
    metadata = {}
  ) {
    try {
      const pensionAmount = (gigAmount * pensionPercentage) / 100;
      const savingsAmount = (gigAmount * savingsPercentage) / 100;
      const netAmount = gigAmount - pensionAmount - savingsAmount;

      // Step 1: Release escrow to worker
      const releasePayload = {
        escrow_reference: escrowId,
        amount_subunits: Math.round(netAmount * 100),
        currency: "NGN",
        narration: `Gig Payment Release - Net Amount (Pension: ${pensionPercentage}%, Savings: ${savingsPercentage}%)`,
        metadata: {
          worker_id: workerUserId,
          pension_deduction: pensionAmount,
          savings_deduction: savingsAmount,
          transaction_type: "gig_completion_payout",
          ...metadata,
        },
      };

      const releaseResponse = await this.client.post("/transfer/process", releasePayload);

      if (!releaseResponse.data.success) {
        throw new Error(releaseResponse.data.message || "Escrow release failed");
      }

      // Step 2: Transfer pension contribution separately
      const pensionTransferResult = await this.transferToPensionAccount(
        workerUserId,
        pensionAmount,
        `Automatic Pension Contribution (${pensionPercentage}%) from Gig Completion`,
        { gig_amount: gigAmount, ...metadata }
      );

      // Step 3: Transfer savings contribution separately (if enabled)
      let savingsTransferResult = { success: true };
      if (savingsPercentage > 0) {
        savingsTransferResult = await this.transferToSavingsWallet(
          workerUserId,
          savingsAmount,
          `Automatic Savings Transfer (${savingsPercentage}%) from Gig Completion`,
          metadata
        );
      }

      return {
        success:
          releaseResponse.data.success &&
          pensionTransferResult.success &&
          savingsTransferResult.success,
        netPayout: {
          grossAmount: gigAmount,
          pensionDeduction: {
            amount: pensionAmount,
            percentage: pensionPercentage,
            transferred: pensionTransferResult.success,
          },
          savingsDeduction: {
            amount: savingsAmount,
            percentage: savingsPercentage,
            transferred: savingsTransferResult.success,
          },
          netAmount: netAmount,
          paymentReference: releaseResponse.data.data?.transaction_reference,
        },
        escrowRelease: releaseResponse.data.data,
        pensionTransfer: pensionTransferResult.data,
        savingsTransfer: savingsTransferResult.data,
      };
    } catch (error) {
      logger.error(`Escrow release with pension failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Direct Payout to Worker (for non-escrow transactions)
   */
  async instantPayout(workerUserId, amount, description = "", metadata = {}) {
    try {
      const payload = {
        amount: Math.round(amount * 100),
        currency: "NGN",
        unique_code: `PAYOUT-${workerUserId}-${Date.now()}`,
        narration: description || "Instant Payout",
        metadata: {
          worker_id: workerUserId,
          transaction_type: "instant_payout",
          ...metadata,
        },
      };

      const response = await this.client.post("/transfer/initiate", payload);

      logger.info(`Instant payout initiated: ${response.data.data?.transaction_reference}`);

      return {
        success: true,
        squadTransactionId: response.data.data?.transaction_reference,
        data: response.data.data,
      };
    } catch (error) {
      logger.error(`Instant payout failed: ${error.message}`);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Transfer to Pension Account (automatic from gig completion)
   */
  async transferToPensionAccount(
    workerUserId,
    amount,
    description = "",
    metadata = {}
  ) {
    try {
      const payload = {
        amount: Math.round(amount * 100),
        currency: "NGN",
        unique_code: `PENSION-${workerUserId}-${Date.now()}`,
        narration: description || "Pension Contribution",
        metadata: {
          worker_id: workerUserId,
          transaction_type: "pension_contribution",
          ...metadata,
        },
      };

      const response = await this.client.post("/transfer/initiate", payload);

      logger.info(
        `Pension transfer initiated: ${response.data.data?.transaction_reference}`
      );

      return {
        success: true,
        squadTransactionId: response.data.data?.transaction_reference,
        data: response.data.data,
      };
    } catch (error) {
      logger.error(`Pension transfer failed: ${error.message}`);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Transfer to Savings Wallet
   */
  async transferToSavingsWallet(
    workerUserId,
    amount,
    description = "",
    metadata = {}
  ) {
    try {
      const payload = {
        amount: Math.round(amount * 100),
        currency: "NGN",
        unique_code: `SAVINGS-${workerUserId}-${Date.now()}`,
        narration: description || "Savings Transfer",
        metadata: {
          worker_id: workerUserId,
          transaction_type: "savings_transfer",
          ...metadata,
        },
      };

      const response = await this.client.post("/transfer/initiate", payload);

      logger.info(
        `Savings transfer initiated: ${response.data.data?.transaction_reference}`
      );

      return {
        success: true,
        squadTransactionId: response.data.data?.transaction_reference,
        data: response.data.data,
      };
    } catch (error) {
      logger.error(`Savings transfer failed: ${error.message}`);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Get Transaction Status
   */
  async getTransactionStatus(transactionReference) {
    try {
      const response = await this.client.get(
        `/transfer/check?reference=${transactionReference}`
      );

      return {
        success: true,
        status: response.data.data?.status,
        data: response.data.data,
      };
    } catch (error) {
      logger.error(`Failed to check transaction status: ${error.message}`);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Verify Payment Webhook
   * Verify Squad webhook signature
   */
  verifyWebhookSignature(signature, payload) {
    const crypto = require("crypto");
    const secret = process.env.SQUAD_WEBHOOK_SECRET;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(payload))
      .digest("hex");

    return hash === signature;
  }

  /**
   * Handle Transaction Webhook
   * Process Squad webhooks for transaction updates
   */
  async handleTransactionWebhook(event, data) {
    logger.info(`Processing Squad webhook: ${event}`, data);

    switch (event) {
      case "transaction.completed":
        return this.handleTransactionCompleted(data);
      case "transaction.failed":
        return this.handleTransactionFailed(data);
      case "escrow.released":
        return this.handleEscrowReleased(data);
      case "escrow.failed":
        return this.handleEscrowFailed(data);
      default:
        logger.warn(`Unknown webhook event: ${event}`);
        return { processed: false, reason: "Unknown event" };
    }
  }

  async handleTransactionCompleted(data) {
    const reference = data.reference || data.transaction_reference || data.id;
    logger.info(`Transaction completed: ${reference}`);
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { squadTransactionId: reference },
          { squadReference: reference },
          { escrowId: reference },
        ],
      },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "COMPLETED",
          squadStatus: data.status || "completed",
          completedAt: new Date(),
        },
      });
    }

    return { processed: true, action: "transaction_completed" };
  }

  async handleTransactionFailed(data) {
    const reference = data.reference || data.transaction_reference || data.id;
    logger.error(`Transaction failed: ${reference}`);
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { squadTransactionId: reference },
          { squadReference: reference },
          { escrowId: reference },
        ],
      },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          squadStatus: data.status || "failed",
          completedAt: new Date(),
        },
      });
    }

    return { processed: true, action: "transaction_failed" };
  }

  async handleEscrowReleased(data) {
    const reference = data.reference || data.escrow_reference || data.id;
    logger.info(`Escrow released: ${reference}`);
    const transaction = await prisma.transaction.findFirst({
      where: {
        escrowId: reference,
      },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          escrowStatus: "released",
          status: "COMPLETED",
          squadStatus: data.status || "released",
          completedAt: new Date(),
        },
      });
    }

    return { processed: true, action: "escrow_released" };
  }

  async handleEscrowFailed(data) {
    const reference = data.reference || data.escrow_reference || data.id;
    logger.error(`Escrow failed: ${reference}`);
    const transaction = await prisma.transaction.findFirst({
      where: {
        escrowId: reference,
      },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          escrowStatus: "failed",
          status: "FAILED",
          squadStatus: data.status || "failed",
          completedAt: new Date(),
        },
      });
    }

    return { processed: true, action: "escrow_failed" };
  }
}

module.exports = new SquadService();
