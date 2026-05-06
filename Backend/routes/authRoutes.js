const express = require("express");
const { sendOtpForSignup, verifyOtpAndRegister, sendOtpForPasswordReset, resetPassword, login, refreshAccessToken, getCurrentUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// New OTP-based registration routes
router.post("/send-otp", sendOtpForSignup);
router.post("/verify-otp", verifyOtpAndRegister);

// New Password Reset routes
router.post("/forgot-password", sendOtpForPasswordReset);
router.post("/reset-password", resetPassword);

router.post("/login", login);   // 
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authMiddleware, getCurrentUser); // Protected route to get current user

module.exports = router;
