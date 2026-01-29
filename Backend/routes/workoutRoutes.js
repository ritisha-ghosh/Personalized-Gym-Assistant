const express = require("express");
const {
  createPlan,
  getUserPlans,
  updatePlan,
  deletePlan
} = require("../controllers/workoutController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 Protected Routes
router.post("/", authMiddleware, createPlan);           // create plan
router.get("/", authMiddleware, getUserPlans);          // get user's own plans
router.put("/:planId", authMiddleware, updatePlan);     // update plan
router.delete("/:planId", authMiddleware, deletePlan);  // delete plan

module.exports = router;
