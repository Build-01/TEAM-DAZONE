const express = require("express");
const { authenticateToken } = require("../utils/auth");
const {
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
} = require("../controllers/gigController");

const router = express.Router();

// Public routes
router.get("/", getAllGigs);
router.get("/:gigId", getGigDetails);

// Protected routes
router.post("/", authenticateToken, createGig);
router.get("/recommended", authenticateToken, getRecommendedGigs);
router.post("/:gigId/apply", authenticateToken, applyForGig);
router.put("/application/:applicationId", authenticateToken, respondToApplication);
router.put("/:gigId/mark-complete", authenticateToken, markWorkComplete);
router.put("/:gigId/release", authenticateToken, releasePaymentConfirm);
router.post("/:gigId/dispute", authenticateToken, raiseDispute);
router.put("/:gigId/dispute/resolve", authenticateToken, resolveDispute);
router.put("/:gigId/complete", authenticateToken, completeGig);

module.exports = router;
