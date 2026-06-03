const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createPlan,
  getUserPlans,
  updatePlan,
  deletePlan,
  weeklyPlanAdjustment,
  generateSmartRecommendation,
  getWeeklyPlan,
  addCustomNote,
  deleteCustomNote,
  getCustomNotes,
  submitDifficultyRating // 🔹 Added this import
} = require("../controllers/workoutController");

const { validatePlan } = require("../middleware/validateWorkout");

const router = express.Router();

// 🗓️ GET DYNAMIC WEEKLY PLAN (Today + Next 6 Days)
router.get("/weekly-plan", protect, getWeeklyPlan);

// Custom Notes
router.get("/notes", protect, getCustomNotes);
router.post("/notes", protect, addCustomNote);
router.delete("/notes/:logId", protect, deleteCustomNote);

// ⭐ Submit Difficulty Rating
router.post("/rate-difficulty", protect, submitDifficultyRating); // 🔹 Added this route

// 💡 Smart Recommendation
router.get("/smart-recommendation", protect, generateSmartRecommendation);

// CREATE WORKOUT PLAN
// Change authMiddleware to protect
router.post("/", protect, validatePlan, createPlan);

// GET USER WORKOUT PLANS
// Change authMiddleware to protect
router.get("/", protect, getUserPlans);

// UPDATE WORKOUT PLAN
// Change authMiddleware to protect
router.put("/:planId", protect, validatePlan, updatePlan);

// DELETE WORKOUT PLAN
// Change authMiddleware to protect
router.delete("/:planId", protect, deletePlan);

// 🧠 AI Weekly Plan Adjustment
// Change authMiddleware to protect
router.post("/weekly-adjustment", protect, weeklyPlanAdjustment);

module.exports = router;