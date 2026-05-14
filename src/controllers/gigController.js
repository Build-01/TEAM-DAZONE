const { PrismaClient } = require("@prisma/client");
const AIService = require("../services/AIService");
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

    res.json({
      success: true,
      message: `Application ${status.toLowerCase()}`,
      application,
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
  completeGig,
};
