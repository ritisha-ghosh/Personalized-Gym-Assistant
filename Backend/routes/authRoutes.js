const express = require("express");

const {
  sendOtpForSignup,
  verifyOtpAndRegister,
  login,
  verifyLoginOtp,
  refreshAccessToken,
  sendOtpForPasswordReset,
  resetPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send-otp", sendOtpForSignup);
router.post("/signup", sendOtpForSignup);
router.post("/verify-otp", verifyOtpAndRegister);

router.post("/forgot-password", sendOtpForPasswordReset);
router.post("/reset-password", resetPassword);

router.post("/login", login);   // 
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/refresh-token", refreshAccessToken);
router.post("/refresh", refreshAccessToken);

module.exports = router;
