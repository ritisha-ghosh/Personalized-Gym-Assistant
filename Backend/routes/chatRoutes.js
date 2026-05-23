const express = require("express");
const router = express.Router();
const { 
  getChatHistory,
  processChat, 
  deleteChatSession,
  updateChatTitle
} = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware"); // Import your fixed middleware

// GET all chat history for the user
router.get("/", protect, getChatHistory);

// POST a new message to a session
router.post("/", protect, processChat);

// DELETE an entire chat session by its ID
router.delete("/:sessionId", protect, deleteChatSession);

// PUT update a chat session's title
router.put("/:sessionId", protect, updateChatTitle);

module.exports = router;