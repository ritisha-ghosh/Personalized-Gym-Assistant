const express = require("express");

const {
  register,
  login,
  refreshAccessToken,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", register);

router.post("/login", login);   // 
router.post("/refresh-token", refreshAccessToken);
router.post("/refresh", refreshAccessToken);

module.exports = router;
