const WorkoutPlan = require("../models/WorkoutPlan");
const UserLog = require("../models/UserLog"); 
const { applyWeeklyAdjustment } = require("../services/decisionTreeService"); 
console.log("Workout controller loaded");


// CREATE PLAN
exports.createPlan = async (req, res) => {
  try {
    console.log("🔥 CREATE PLAN BODY:", req.body);
    console.log("🔥 USER:", req.user);

    const plan = await WorkoutPlan.create({
      user: req.user.id,   // ✅ from JWT
      title: req.body.title,
      goal: req.body.goal,
      experienceLevel: req.body.experience,
      duration: req.body.duration,
      daysPerWeek: req.body.daysPerWeek,
      exercises: req.body.exercises,
      notes: req.body.notes
    });

    res.status(201).json({
      message: "Workout plan created",
      plan
    });

  } catch (error) {
    console.error("❌ CREATE PLAN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET USER PLANS
exports.getUserPlans = async (req, res) => {
  try {
    // FIX: Get the user ID from the JWT token provided by the authMiddleware
    const userId = req.user.id;

    const plans = await WorkoutPlan.find({ user: userId }).sort({ createdAt: -1 });

    res.json(plans);

  } catch (error) {
    console.error("GET USER PLANS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PLAN
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const updated = await WorkoutPlan.findByIdAndUpdate(
      planId,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PLAN
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    await WorkoutPlan.findByIdAndDelete(planId);

    res.json({ message: "Workout plan deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//🧠 WEEKLY PLAN ADJUSTMENT (Decision Tree)

exports.weeklyPlanAdjustment = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch last 7 days of logs
    const logs = await UserLog.find({ user: userId })
      .sort({ date: -1 })
      .limit(7);

    if (logs.length === 0) {
      return res.status(400).json({ message: "No workout logs found for this week" });
    }

    const missedDays = logs.filter(l => l.status === "missed").length;
    const hasInjuryOrSick = logs.some(
      l => l.status === "injured" || l.status === "sick"
    );

    // 🧠 AI SENSOR: Difficulty Rating
    const difficultyLogs = logs.filter(
      l => l.status === "active" && typeof l.difficultyRating === "number"
    );

    const avgDifficulty =
      difficultyLogs.length > 0
        ? difficultyLogs.reduce((sum, l) => sum + l.difficultyRating, 0) /
          difficultyLogs.length
        : 5; // neutral fallback

    const plan = await WorkoutPlan.findOne({ user: userId });
    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    const adjustment = applyWeeklyAdjustment({
      goal: plan.goal,
      avgDifficulty,
      missedDays,
      hasInjuryOrSick
    });

    // 🔧 APPLY ADJUSTMENT TO PLAN (exercise-level)
    plan.exercises = plan.exercises.map(ex => ({
      ...ex.toObject(),
      sets: Math.max(
        1,
        Math.round(ex.sets * adjustment.volumeMultiplier)
      ),
      restSeconds: Math.max(
        30,
        ex.restSeconds + adjustment.restAdjustment
      )
    }));

    plan.notes = `${plan.notes} | ${adjustment.notes}`.trim();

    await plan.save();

    res.status(200).json({
      message: "Weekly workout plan adjusted successfully",
      adjustment,
      avgDifficulty: Math.round(avgDifficulty * 10) / 10
    });

  } catch (error) {
    console.error("WEEKLY ADJUSTMENT ERROR:", error);
    res.status(500).json({ message: "Weekly plan adjustment failed" });
  }
};