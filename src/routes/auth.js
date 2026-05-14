const express = require("express");
const { authenticateToken } = require("../utils/auth");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateWorkerProfile,
  updateTraderProfile,
} = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile/worker", authenticateToken, updateWorkerProfile);
router.put("/profile/trader", authenticateToken, updateTraderProfile);

module.exports = router;
