const express = require("express");

const {
  createPlan,
  getUserPlans,
  updatePlan,
  deletePlan,
  weeklyPlanAdjustment
} = require("../controllers/workoutController");

const authMiddleware = require("../middleware/authMiddleware");
const { validatePlan } = require("../middleware/validateWorkout");

const router = express.Router();

// CREATE WORKOUT PLAN
router.post("/", authMiddleware, validatePlan, createPlan);

// GET USER WORKOUT PLANS
router.get("/", authMiddleware, getUserPlans);

// UPDATE WORKOUT PLAN
router.put("/:planId", authMiddleware, validatePlan, updatePlan);

// DELETE WORKOUT PLAN
router.delete("/:planId", authMiddleware, deletePlan);

// 🧠 AI Weekly Plan Adjustment
router.post("/weekly-adjustment", authMiddleware, weeklyPlanAdjustment);

module.exports = router;
