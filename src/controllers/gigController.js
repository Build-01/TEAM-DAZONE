const { PrismaClient } = require("@prisma/client");
const AIService = require("../services/AIService");
const SquadService = require("../services/SquadService");
const NotificationService = require("../services/NotificationService");
const winston = require("winston");

const prisma = new PrismaClient();
const logger = winston.getLogger ? winston.getLogger() : console;

/**
 * Create Gig (by Trader/Employer)
 */
const createGig = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      category,
      requiredSkills,
      location,
      paymentAmount,
      currency,
      duration,
      startDate,
      endDate,
      maxWorkers,
    } = req.body;

    // Validate
    if (!title || !category || !paymentAmount || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const gig = await prisma.gig.create({
      data: {
        creatorId: userId,
        title,
        description: description || "",
        category,
        requiredSkills: requiredSkills || [],
        location,
        paymentAmount,
        currency: currency || "NGN",
        duration: duration || 8,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        maxWorkers: maxWorkers || 1,
      },
    });

    res.status(201).json({
      success: true,
      message: "Gig created successfully",
      gig,
    });
  } catch (error) {
    logger.error(`Create gig error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to create gig",
      error: error.message,
    });
  }
};

/**
 * Get All Gigs (with filtering)
 */
const getAllGigs = async (req, res) => {
  try {
    const { category, location, status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (status) where.status = status;

    const gigs = await prisma.gig.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.gig.count({ where });

    res.json({
      success: true,
      gigs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get gigs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gigs",
      error: error.message,
    });
  }
};

/**
 * Get Recommended Gigs for Worker
 * Uses AI matching engine
 */
const getRecommendedGigs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.query;

    // Get worker profile
    const worker = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: true,
      },
    });

    if (!worker || !worker.workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    // Get available gigs
    const gigs = await prisma.gig.findMany({
      where: {
        status: "OPEN",
        creatorId: { not: userId }, // Don't recommend own gigs
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
          },
        },
      },
      take: parseInt(limit) * 2, // Get more to rank
    });

    // Score and rank each gig
    const scoredGigs = await Promise.all(
      gigs.map(async (gig) => {
        const match = await AIService.matchWorkerToGig(worker, gig);
        return {
          ...gig,
          matchDetails: match.details,
          matchScore: match.matchScore,
          recommendation: match.recommendation,
        };
      })
    );

    // Sort by match score and return top results
    const recommended = scoredGigs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      gigs: recommended,
      count: recommended.length,
    });
  } catch (error) {
    logger.error(`Get recommended gigs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommended gigs",
      error: error.message,
    });
  }
};

/**
 * Apply for Gig
 */
const applyForGig = async (req, res) => {
  try {
    const userId = req.user.userId;
    const gigId = req.params.gigId;

    // Get gig and worker
    const [gig, worker] = await Promise.all([
      prisma.gig.findUnique({ where: { id: gigId } }),
      prisma.user.findUnique({
        where: { id: userId },
        include: { workerProfile: true },
      }),
    ]);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // Check if already applied
    const existingApp = await prisma.gigApplication.findUnique({
      where: {
        gigId_applicantId: { gigId, applicantId: userId },
      },
    });

    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: "Already applied for this gig",
      });
    }

    // Calculate match score
    const match = await AIService.matchWorkerToGig(worker, gig);

    // Create application
    const application = await prisma.gigApplication.create({
      data: {
        gigId,
        applicantId: userId,
        matchScore: match.matchScore,
        skillMatchPercentage: match.details.skillMatch,
        locationDistance: match.details.locationDistance,
        trustScoreAtApplication: worker.economicIdentityScore,
      },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted",
      application,
      matchScore: match.matchScore,
      recommendation: match.recommendation,
    });
  } catch (error) {
    logger.error(`Apply for gig error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to apply for gig",
      error: error.message,
    });
  }
};

/**
 * Accept/Reject Application
 */
const respondToApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reason } = req.body; // status: ACCEPTED, REJECTED

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await prisma.gigApplication.update({
      where: { id: applicationId },
      data: {
        status,
        respondedAt: new Date(),
        rejectedReason: status === "REJECTED" ? reason : undefined,
      },
    });

    let contract = null;

    if (status === "ACCEPTED") {
      const gig = await prisma.gig.findUnique({ where: { id: application.gigId } });
      if (!gig) {
        return res.status(404).json({
          success: false,
          message: "Gig not found for accepted application",
        });
      }

      const existingContract = await prisma.contract.findUnique({
        where: { gigId: gig.id },
      });

      if (!existingContract) {
        contract = await prisma.contract.create({
          data: {
            gigId: gig.id,
            workerId: application.applicantId,
            clientId: gig.creatorId,
            status: "IN_PROGRESS",
          },
        });
      }

      await prisma.gig.update({
        where: { id: gig.id },
        data: { status: "IN_PROGRESS" },
      });
    }

    res.json({
      success: true,
      message: `Application ${status.toLowerCase()}`,
      application,
      contract,
    });
  } catch (error) {
    logger.error(`Respond to application error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to respond to application",
      error: error.message,
    });
  }
};

/**
 * Get Gig Details
 */
const getGigDetails = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
            economicIdentityScore: true,
            trustScore: true,
          },
        },
        applications: {
          where: { status: { not: "WITHDRAWN" } },
          include: {
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                economicIdentityScore: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.json({
      success: true,
      gig,
    });
  } catch (error) {
    logger.error(`Get gig details error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gig details",
      error: error.message,
    });
  }
};

/**
 * Worker confirms gig completion
 */
const markWorkComplete = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.userId;

    const contract = await prisma.contract.findUnique({
      where: { gigId },
      include: { gig: true },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found for this gig",
      });
    }

    if (contract.workerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the assigned worker can mark completion",
      });
    }

    if (contract.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: "Contract is not in progress",
      });
    }

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        workerConfirmed: true,
      },
    });

    let result = { contract: updated };
    if (updated.clientConfirmed && updated.workerConfirmed) {
      result = await finalizeContract(updated.id);
    }

    res.json({
      success: true,
      message: "Work marked as complete",
      ...result,
    });
  } catch (error) {
    logger.error(`Mark work complete error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to confirm work completion",
      error: error.message,
    });
  }
};

/**
 * Client releases payment and confirms work
 */
const releasePaymentConfirm = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.userId;
    const { workerRating } = req.body;

    const contract = await prisma.contract.findUnique({
      where: { gigId },
      include: { gig: true },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found for this gig",
      });
    }

    if (contract.clientId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the client can release payment",
      });
    }

    if (contract.disputeStatus === "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Cannot release payment while dispute is open",
      });
    }

    if (contract.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: "Contract is not in progress",
      });
    }

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        clientConfirmed: true,
        workerRating: workerRating || contract.workerRating,
      },
    });

    let result = { contract: updated };
    if (updated.clientConfirmed && updated.workerConfirmed) {
      result = await finalizeContract(updated.id);
    }

    res.json({
      success: true,
      message: "Payment release confirmed",
      ...result,
    });
  } catch (error) {
    logger.error(`Release payment confirm error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to release payment",
      error: error.message,
    });
  }
};

/**
 * Raise a dispute on a contract
 */
const raiseDispute = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.userId;
    const { reason } = req.body;

    const contract = await prisma.contract.findUnique({
      where: { gigId },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (![contract.workerId, contract.clientId].includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only contract participants can raise a dispute",
      });
    }

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        disputeStatus: "OPEN",
        disputeReason: reason || "Dispute raised",
        trustFrozen: true,
        status: "DISPUTED",
      },
    });

    res.json({
      success: true,
      message: "Dispute raised",
      contract: updated,
    });
  } catch (error) {
    logger.error(`Raise dispute error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to raise dispute",
      error: error.message,
    });
  }
};

/**
 * Resolve a dispute in favor of worker or client
 */
const resolveDispute = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.userId;
    const { resolution } = req.body; // worker or client

    const contract = await prisma.contract.findUnique({
      where: { gigId },
      include: { gig: true },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (contract.disputeStatus !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "No open dispute to resolve",
      });
    }

    if (!["worker", "client"].includes(resolution)) {
      return res.status(400).json({
        success: false,
        message: "Resolution must be either 'worker' or 'client'",
      });
    }

    const workerDelta = resolution === "worker" ? 10 : -10;
    const clientDelta = resolution === "client" ? 5 : -5;
    const workerStatus = resolution === "worker" ? "RESOLVED_WORKER" : "RESOLVED_CLIENT";

    const [worker, client] = await Promise.all([
      prisma.user.findUnique({ where: { id: contract.workerId } }),
      prisma.user.findUnique({ where: { id: contract.clientId } }),
    ]);

    const updatedWorker = await updateTrustScore(contract.workerId, workerDelta, {
      gigId: contract.gigId,
      contractId: contract.id,
      reason: resolution === "worker" ? "Dispute resolved in worker's favor" : "Dispute resolved in client favor",
    });

    const updatedClient = await updateTrustScore(contract.clientId, clientDelta, {
      gigId: contract.gigId,
      contractId: contract.id,
      reason: resolution === "worker" ? "Dispute resolved in worker's favor" : "Dispute resolved in client favor",
    });

    const updatedContract = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        disputeStatus: workerStatus,
        trustFrozen: false,
      },
    });

    await NotificationService.notifyUser(contract.workerId, "Dispute resolved", `Dispute resolved in ${resolution === "worker" ? "your favor" : "client's favor"}.`);
    await NotificationService.notifyUser(contract.clientId, "Dispute resolved", `Dispute resolved in ${resolution === "client" ? "your favor" : "worker's favor"}.`);

    let finalizeResult = null;
    if (updatedContract.workerConfirmed && updatedContract.clientConfirmed && updatedContract.status !== "COMPLETED") {
      finalizeResult = await finalizeContract(updatedContract.id);
    }

    res.json({
      success: true,
      message: "Dispute resolved",
      contract: updatedContract,
      worker: updatedWorker,
      client: updatedClient,
      finalizeResult,
    });
  } catch (error) {
    logger.error(`Resolve dispute error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to resolve dispute",
      error: error.message,
    });
  }
};

const finalizeContract = async (contractId) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      gig: true,
    },
  });

  if (!contract) {
    throw new Error("Contract not found");
  }
  if (contract.disputeStatus === "OPEN") {
    throw new Error("Cannot finalize payment while dispute is open");
  }
  if (!contract.workerConfirmed || !contract.clientConfirmed) {
    throw new Error("Both parties must confirm to finalize payment");
  }
  if (contract.status === "COMPLETED") {
    return { message: "Contract already finalized" };
  }

  const gig = contract.gig;
  if (!gig || !gig.squadEscrowId) {
    throw new Error("Gig or escrow not available for release");
  }

  const workerRatingBonus = calculateRatingBonus(contract.workerRating);
  const clientRatingBonus = calculateRatingBonus(contract.clientRating);
  const earlyCompletionBonus = calculateEarlyCompletionBonus(gig);

  const workerCompletedCount = await prisma.contract.count({
    where: { workerId: contract.workerId, status: "COMPLETED" },
  });
  const clientCompletedCount = await prisma.contract.count({
    where: { clientId: contract.clientId, status: "COMPLETED" },
  });

  const workerMultiplier = getTrustMultiplier(workerCompletedCount);
  const clientMultiplier = getTrustMultiplier(clientCompletedCount);

  const workerDelta = Math.round((8 + workerRatingBonus + earlyCompletionBonus) * workerMultiplier);
  const clientDelta = Math.round((5 + clientRatingBonus) * clientMultiplier);

  const [updatedWorker, updatedClient] = await Promise.all([
    updateTrustScore(contract.workerId, workerDelta, {
      gigId: gig.id,
      contractId: contract.id,
      reason: "Contract completed with dual confirmation",
    }),
    updateTrustScore(contract.clientId, clientDelta, {
      gigId: gig.id,
      contractId: contract.id,
      reason: "Client confirmed work completion",
    }),
  ]);

  const pensionPercentage = 10;
  const releaseResult = await SquadService.releaseEscrowWithPension(
    contract.workerId,
    gig.paymentAmount,
    gig.squadEscrowId,
    pensionPercentage,
    0,
    { gig_id: gig.id, contract_id: contract.id }
  );

  if (!releaseResult.success) {
    throw new Error(releaseResult.error || "Escrow release failed");
  }

  const pensionAmount = (gig.paymentAmount * pensionPercentage) / 100;
  const netAmount = gig.paymentAmount - pensionAmount;

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        gigId: gig.id,
        fromUserId: contract.clientId,
        toUserId: contract.workerId,
        amount: gig.paymentAmount,
        pensionContribution: pensionAmount,
        netAmount,
        transactionType: "ESCROW_RELEASE",
        squadTransactionId: releaseResult.netPayout.paymentReference,
        escrowId: gig.squadEscrowId,
        status: "COMPLETED",
      },
    }),
    prisma.pensionAccount.update({
      where: { userId: contract.workerId },
      data: {
        pensionBalance: { increment: pensionAmount },
        totalContributions: { increment: pensionAmount },
        contributionCount: { increment: 1 },
        lastContributionDate: new Date(),
      },
    }),
    prisma.gig.update({
      where: { id: gig.id },
      data: {
        status: "COMPLETED",
        escrowStatus: "released",
        completedAt: new Date(),
      },
    }),
    prisma.contract.update({
      where: { id: contract.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    }),
  ]);

  await NotificationService.notifyUser(
    contract.workerId,
    "Payment released",
    `Your gig payment of ₦${netAmount.toFixed(2)} was released and ₦${pensionAmount.toFixed(2)} was set aside for pension.`
  );

  await NotificationService.notifyUser(
    contract.clientId,
    "Payment released",
    `Payment for gig '${gig.title}' has been released successfully.`
  );

  return {
    contract: { ...contract, status: "COMPLETED" },
    worker: updatedWorker,
    client: updatedClient,
    releaseResult,
  };
};

const calculateRatingBonus = (rating) => {
  if (!rating || rating < 1 || rating > 5) return 0;
  return (rating - 3) * 2;
};

const calculateEarlyCompletionBonus = (gig) => {
  if (!gig.endDate) return 0;
  const endTime = new Date(gig.endDate).getTime();
  const completedTime = gig.completedAt ? new Date(gig.completedAt).getTime() : Date.now();
  const daysEarly = (endTime - completedTime) / (1000 * 60 * 60 * 24);
  if (daysEarly <= 0) return 0;
  return Math.min(10, Math.floor(daysEarly) * 2);
};

const getTrustMultiplier = (completedCount) => {
  if (completedCount > 5) return 1.1;
  return 1.0;
};

const updateTrustScore = async (userId, delta, metadata) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const previousScore = user.trustScore || 0;
  const newScore = Math.min(100, Math.max(0, previousScore + delta));

  await prisma.user.update({
    where: { id: userId },
    data: { trustScore: newScore },
  });

  await prisma.trustScoreLog.create({
    data: {
      userId,
      gigId: metadata.gigId,
      contractId: metadata.contractId,
      change: delta,
      previousScore,
      newScore,
      reason: metadata.reason,
    },
  });

  return { id: userId, previousScore, newScore, delta, reason: metadata.reason };
};

/**
 * Complete Gig
 */
const completeGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.userId;

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
        message: "Only gig creator can complete the gig",
      });
    }

    const updated = await prisma.gig.update({
      where: { id: gigId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Gig marked as completed",
      gig: updated,
    });
  } catch (error) {
    logger.error(`Complete gig error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to complete gig",
      error: error.message,
    });
  }
};

module.exports = {
  createGig,
  getAllGigs,
  getRecommendedGigs,
  applyForGig,
  respondToApplication,
  getGigDetails,
  markWorkComplete,
  releasePaymentConfirm,
  raiseDispute,
  resolveDispute,
  completeGig,
};
