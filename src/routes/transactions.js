const express = require("express");
const { authenticateToken } = require("../utils/auth");
const {
  getPensionAccount,
  getSavingsWallet,
  setSavingsGoal,
  initiateGigEscrow,
  releaseGigPaymentWithPension,
  getTransactionHistory,
} = require("../controllers/transactionController");

const router = express.Router();

// Pension routes
router.get("/pension", authenticateToken, getPensionAccount);

// Savings wallet routes
router.get("/savings", authenticateToken, getSavingsWallet);
router.post("/savings/goal", authenticateToken, setSavingsGoal);

// Escrow and payment routes
router.post("/gigs/:gigId/escrow", authenticateToken, initiateGigEscrow);
router.post(
  "/gigs/:gigId/release/:workerUserId",
  authenticateToken,
  releaseGigPaymentWithPension
);

// Transaction history
router.get("/history", authenticateToken, getTransactionHistory);

module.exports = router;
