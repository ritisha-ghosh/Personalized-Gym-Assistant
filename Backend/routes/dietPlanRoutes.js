const express = require("express");
const router = express.Router();

const { getDietPlan } = require("../controllers/dietPlanController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/generate", authMiddleware, getDietPlan);

module.exports = router;
