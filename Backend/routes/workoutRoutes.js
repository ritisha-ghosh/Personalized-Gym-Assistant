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

// 🔐 Protected Routes + 🛡️ Validated Routes

router.post("/", authMiddleware, validatePlan, createPlan);           // create plan
router.get("/", authMiddleware, getUserPlans);          // get user's own plans
router.put("/:planId", authMiddleware, validatePlan, updatePlan);     // update plan
router.delete("/:planId", authMiddleware, deletePlan);  // delete plan
// 🧠 Decision Tree – Weekly Plan Adjustment
router.post("/weekly-adjustment", authMiddleware, weeklyPlanAdjustment);

module.exports = router;
