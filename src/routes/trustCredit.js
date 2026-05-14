const express = require("express");
const { authenticateToken } = require("../utils/auth");
const {
  handleSquadWebhook,
  getTrustCreditProfile,
  monitorTrustCredit,
  getTrustCredentials,
} = require("../controllers/trustCreditController");

const router = express.Router();

// Webhook (no authentication needed - signature verification instead)
router.post("/webhook/squad", handleSquadWebhook);

// Protected routes
router.get("/profile", authenticateToken, getTrustCreditProfile);
router.post("/monitor", authenticateToken, monitorTrustCredit);
router.get("/credentials/:userId", authenticateToken, getTrustCredentials);

module.exports = router;
