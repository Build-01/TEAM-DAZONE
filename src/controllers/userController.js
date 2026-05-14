const { PrismaClient } = require("@prisma/client");
const { generateToken, hashPassword, comparePassword } = require("../utils/auth");
const AIService = require("../services/AIService");
const winston = require("winston");

const prisma = new PrismaClient();
const logger = winston.getLogger ? winston.getLogger() : console;

/**
 * Register User
 */
const registerUser = async (req, res) => {
  try {
    const {
      email,
      phone,
      password,
      firstName,
      lastName,
      userType,
      location,
      preferredLanguage,
    } = req.body;

    // Validation
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, phone, and password are required",
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        firstName: firstName || "",
        lastName: lastName || "",
        userType: userType || "WORKER",
        location: location || "",
        preferredLanguage: preferredLanguage || "en",
      },
    });

    // Create related profiles
    if (user.userType === "WORKER") {
      await prisma.workerProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else if (user.userType === "TRADER") {
      await prisma.traderProfile.create({
        data: {
          userId: user.id,
          businessName: "",
          businessCategory: "",
          shopLocation: location,
          businessAge: 0,
        },
      });
    }

    // Create pension account
    await prisma.pensionAccount.create({
      data: {
        userId: user.id,
      },
    });

    // Create savings wallet
    await prisma.savingsWallet.create({
      data: {
        userId: user.id,
      },
    });

    // Create trust credit profile
    await prisma.trustCredit.create({
      data: {
        userId: user.id,
        pensionConsistencyScore: 0,
        escrowCompletionRate: 0,
        savingsDisciplineScore: 0,
        communityTrustScore: 0,
        overallTrustScore: 0,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * Login User
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id, user.email);

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        economicIdentityScore: user.economicIdentityScore,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/**
 * Get User Profile
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: true,
        traderProfile: true,
        pensionAccount: true,
        savingsWallet: true,
        trustCredit: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

/**
 * Update Worker Profile with Skills
 */
const updateWorkerProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { skills, experienceLevel, description, profilePhoto } = req.body;

    // Extract skills using AI
    let extractedSkills = skills || [];
    if (description) {
      const result = await AIService.extractSkillsFromProfile(description);
      if (result.success) {
        extractedSkills = result.skills;
      }
    }

    // Calculate Economic Identity Score
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
    });

    const pensionData = await prisma.pensionAccount.findUnique({
      where: { userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const pensionConsistency = AIService.calculatePensionConsistency({
      totalContributions: pensionData?.totalContributions || 0,
      contributionCount: pensionData?.contributionCount || 0,
      monthlyContributions: [],
    });

    const economicScore = AIService.calculateEconomicIdentityScore({
      trustScore: user?.trustScore || 0,
      workConsistency: 0,
      skillsVerified: extractedSkills.length * 10,
      pensionReliability: pensionConsistency,
      communityTrust: user?.communityTrustScore || 0,
      completionRate: workerProfile?.completionRate || 0,
      onTimeRate: workerProfile?.onTimeCompletionRate || 0,
    });

    // Update profiles
    const updated = await prisma.$transaction([
      prisma.workerProfile.update({
        where: { userId },
        data: {
          skills: extractedSkills.map((s) => s.skill),
          experienceLevel: experienceLevel || "beginner",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          economicIdentityScore: economicScore,
          profilePhoto: profilePhoto || user?.profilePhoto,
        },
      }),
    ]);

    res.json({
      success: true,
      message: "Worker profile updated",
      economicIdentityScore: economicScore,
      skills: extractedSkills,
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/**
 * Update Trader Profile
 */
const updateTraderProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      businessName,
      businessCategory,
      shopLocation,
      businessRegistration,
      taxId,
    } = req.body;

    const profile = await prisma.traderProfile.update({
      where: { userId },
      data: {
        businessName: businessName || undefined,
        businessCategory: businessCategory || undefined,
        shopLocation: shopLocation || undefined,
        businessRegistration: businessRegistration || undefined,
        taxId: taxId || undefined,
      },
    });

    res.json({
      success: true,
      message: "Trader profile updated",
      profile,
    });
  } catch (error) {
    logger.error(`Update trader profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update trader profile",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateWorkerProfile,
  updateTraderProfile,
};
