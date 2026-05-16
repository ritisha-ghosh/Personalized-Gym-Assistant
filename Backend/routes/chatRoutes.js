const express = require("express");
const router = express.Router();
const { processChat } = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware"); // Import your fixed middleware

// Add protect here!
router.post("/", protect, processChat);

module.exports = router;