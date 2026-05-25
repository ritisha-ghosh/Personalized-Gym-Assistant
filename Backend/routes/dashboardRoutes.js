const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardMetrics } = require("../controllers/dashboardController");

router.get("/metrics", authMiddleware, getDashboardMetrics);

module.exports = router;