const express = require("express");
const {
  createLog,
  getUserLogs,
  updateLog,
  deleteLog,
  getLast48HoursLogs   
} = require("../controllers/logController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 Protected Routes
router.post("/", authMiddleware, createLog);           
router.get("/", authMiddleware, getUserLogs);          
router.put("/:logId", authMiddleware, updateLog);      
router.delete("/:logId", authMiddleware, deleteLog);   

// 🚀 NEW ROUTE - Last 48 Hours Logs (for Recovery Logic)
router.get("/last-48-hours", authMiddleware, getLast48HoursLogs);

module.exports = router;