const express = require("express");
const {
  createLog,
  getUserLogs,
  updateLog,
  deleteLog
} = require("../controllers/logController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 Protected Routes
router.post("/", authMiddleware, createLog);           // create log
router.get("/", authMiddleware, getUserLogs);          // get user's own logs
router.put("/:logId", authMiddleware, updateLog);      // update log
router.delete("/:logId", authMiddleware, deleteLog);   // delete log

module.exports = router;
