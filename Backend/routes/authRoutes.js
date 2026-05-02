const express = require("express");
const { signup, login, refreshAccessToken, getCurrentUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);   // 
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authMiddleware, getCurrentUser); // Protected route to get current user


module.exports = router;
