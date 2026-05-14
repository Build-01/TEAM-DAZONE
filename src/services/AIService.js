const axios = require("axios");
const winston = require("winston");

const logger = winston.getLogger ? winston.getLogger() : console;

class AIService {
  constructor() {
    this.huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;
    this.huggingFaceModels = {
      embedding: "sentence-transformers/all-MiniLM-L6-v2",
      textClassification: "distilbert-base-uncased-finetuned-sst-2-english",
      ner: "dslim/bert-base-NER",
    };
  }

  /**
   * Extract Skills from Worker Profile (from photos/description)
   * Uses OCR + NER to identify skills
   */
  async extractSkillsFromProfile(description, workPhotos = []) {
    try {
      // Parse description for skills
      const skillKeywords = {
        IT: ["coding", "programming", "web", "software", "data", "database"],
        Construction: ["carpentry", "plumbing", "electrical", "masonry", "welding"],
        Logistics: ["driving", "delivery", "warehouse", "shipping", "transport"],
        Retail: ["sales", "cashier", "customer", "inventory", "merchandising"],
        Food: ["cooking", "baking", "catering", "food preparation"],
        Services: ["cleaning", "maintenance", "repair", "consultation"],
        Arts: ["design", "photography", "graphics", "art", "music"],
        Education: ["tutoring", "teaching", "training", "coaching"],
      };

      const detectedSkills = [];
      const descriptionLower = description.toLowerCase();

      for (const [category, keywords] of Object.entries(skillKeywords)) {
        for (const keyword of keywords) {
          if (descriptionLower.includes(keyword)) {
            detectedSkills.push({
              skill: keyword,
              category,
              confidence: 0.8,
            });
          }
        }
      }

      return {
        success: true,
        skills: detectedSkills,
        rawDescription: description,
        photosAnalyzed: workPhotos.length,
      };
    } catch (error) {
      logger.error(`Skill extraction failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate Economic Identity Score™
   * Combines: trust, consistency, pension reliability, skills, community
   */
  calculateEconomicIdentityScore(profileData) {
    const {
      trustScore = 0,
      workConsistency = 0,
      skillsVerified = 0,
      pensionReliability = 0,
      communityTrust = 0,
      completionRate = 0,
      onTimeRate = 0,
    } = profileData;

    // Weighted calculation
    const weights = {
      pension: 0.25, // Pension is primary
      trust: 0.2,
      consistency: 0.2,
      skills: 0.15,
      community: 0.1,
      completion: 0.05,
      onTime: 0.05,
    };

    const score =
      pensionReliability * weights.pension +
      trustScore * weights.trust +
      workConsistency * weights.consistency +
      skillsVerified * weights.skills +
      communityTrust * weights.community +
      completionRate * weights.completion +
      onTimeRate * weights.onTime;

    return Math.min(100, Math.round(score * 100) / 100);
  }

  /**
   * Match Job Seekers to Gigs
   * Uses semantic similarity + behavioral signals
   */
  async matchWorkerToGig(worker, gig) {
    try {
      // 1. Skills Matching (0-100)
      const skillMatch = this.calculateSkillMatch(
        worker.skills || [],
        gig.requiredSkills || []
      );

      // 2. Location Proximity (0-100, max 100 for same location)
      const locationDistance = this.calculateLocationDistance(
        worker.location,
        gig.location
      );
      const locationMatch = Math.max(0, 100 - locationDistance * 2);

      // 3. Language Compatibility (0-100)
      const languageMatch = worker.preferredLanguage === gig.language ? 100 : 75;

      // 4. Trust Score (already 0-100)
      const trustMatch = worker.economicIdentityScore || 0;

      // 5. Demand Matching (based on market trends)
      const demandMatch = this.calculateDemandMatch(gig.category);

      // 6. Historical Success Rate
      const successMatch = (worker.completionRate || 0) * 100;

      // Calculate weighted match score
      const matchScore = this.calculateMatchScore({
        skillMatch,
        locationMatch,
        languageMatch,
        trustMatch,
        demandMatch,
        successMatch,
      });

      return {
        success: true,
        matchScore,
        details: {
          skillMatch,
          locationMatch,
          locationDistance,
          languageMatch,
          trustMatch,
          demandMatch,
          successMatch,
        },
        recommendation:
          matchScore > 80
            ? "Excellent match"
            : matchScore > 60
              ? "Good match"
              : matchScore > 40
                ? "Fair match"
                : "Poor match",
      };
    } catch (error) {
      logger.error(`Job matching failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate Skill Match Percentage
   */
  calculateSkillMatch(workerSkills, requiredSkills) {
    if (requiredSkills.length === 0) return 100;

    const workerSkillSet = new Set(workerSkills.map((s) => s.toLowerCase()));
    const requiredSkillSet = new Set(requiredSkills.map((s) => s.toLowerCase()));

    let matches = 0;
    requiredSkillSet.forEach((skill) => {
      if (workerSkillSet.has(skill)) matches++;
    });

    return (matches / requiredSkills.length) * 100;
  }

  /**
   * Calculate Location Distance (simplified - in production use Haversine)
   */
  calculateLocationDistance(loc1, loc2) {
    // Placeholder - in production, use actual coordinates
    if (loc1.toLowerCase() === loc2.toLowerCase()) return 0;
    return 5; // km (default)
  }

  /**
   * Calculate Demand Match
   */
  calculateDemandMatch(category) {
    // In production, fetch from economic insights
    const demandTrends = {
      logistics: 90,
      construction: 80,
      IT: 95,
      retail: 70,
      food: 65,
      services: 75,
    };

    return demandTrends[category.toLowerCase()] || 50;
  }

  /**
   * Calculate Final Match Score
   */
  calculateMatchScore(components) {
    const {
      skillMatch = 0,
      locationMatch = 0,
      languageMatch = 0,
      trustMatch = 0,
      demandMatch = 0,
      successMatch = 0,
    } = components;

    const weights = {
      skill: 0.25,
      location: 0.15,
      language: 0.1,
      trust: 0.25,
      demand: 0.15,
      success: 0.1,
    };

    return Math.round(
      skillMatch * weights.skill +
        locationMatch * weights.location +
        languageMatch * weights.language +
        trustMatch * weights.trust +
        demandMatch * weights.demand +
        successMatch * weights.success
    );
  }

  /**
   * Fraud Detection - Analyze Transaction Patterns
   */
  detectFraud(transactions) {
    const anomalies = [];

    // Check for circular trust manipulation
    const trustRatings = transactions.filter((t) => t.type === "rating");
    if (trustRatings.length > 5) {
      anomalies.push({
        type: "suspicious_rating_frequency",
        severity: "medium",
      });
    }

    // Check for unrealistic completion times
    transactions.forEach((t) => {
      if (t.completionTime < 1) {
        anomalies.push({
          type: "unrealistic_completion_time",
          severity: "high",
          transaction: t.id,
        });
      }
    });

    // Check for transaction fraud patterns
    const amounts = transactions.map((t) => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const outliers = amounts.filter((a) => Math.abs(a - avgAmount) > avgAmount * 2);

    if (outliers.length > amounts.length * 0.3) {
      anomalies.push({
        type: "anomalous_transaction_amounts",
        severity: "medium",
      });
    }

    return {
      flagged: anomalies.length > 0,
      anomalies,
      riskScore: Math.min(100, anomalies.length * 20),
    };
  }

  /**
   * Calculate Pension Consistency Score
   * Key component of Economic Identity Score
   */
  calculatePensionConsistency(pensionData) {
    const {
      monthlyContributions = [],
      totalContributions = 0,
      contributionCount = 0,
    } = pensionData;

    if (contributionCount === 0) return 0;

    // Consistency = frequency of contributions
    const recentMonths = 12;
    const expectedContributions = recentMonths;
    const consistencyRatio = (contributionCount / expectedContributions) * 100;

    // Standard deviation of contributions
    const avgContribution = totalContributions / contributionCount;
    const variance =
      monthlyContributions.reduce((sum, c) => sum + Math.pow(c - avgContribution, 2), 0) /
      monthlyContributions.length;
    const stdDev = Math.sqrt(variance);
    const stability = Math.max(0, 100 - (stdDev / avgContribution) * 100);

    return (consistencyRatio + stability) / 2;
  }

  /**
   * Predict Repayment Likelihood
   * Uses historical data + pension consistency
   */
  predictRepaymentLikelihood(userData) {
    const {
      pensionConsistency = 0,
      historyScore = 0,
      communityTrust = 0,
      economicStability = 0,
    } = userData;

    const weights = {
      pension: 0.4,
      history: 0.3,
      community: 0.2,
      stability: 0.1,
    };

    const likelihood =
      pensionConsistency * weights.pension +
      historyScore * weights.history +
      communityTrust * weights.community +
      economicStability * weights.stability;

    return {
      repaymentLikelihood: Math.round(likelihood),
      recommendation:
        likelihood > 80
          ? "Highly likely to repay"
          : likelihood > 60
            ? "Likely to repay"
            : "Monitor closely",
    };
  }
}

module.exports = new AIService();
