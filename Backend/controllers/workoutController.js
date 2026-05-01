const WorkoutPlan = require("../models/WorkoutPlan");
const UserLog = require("../models/UserLog"); 
const User = require("../models/User"); 
const aiModelService = require("../services/aiModelService"); 
const { applyWeeklyAdjustment } = require("../services/decisionTreeService"); 
console.log("Workout controller loaded");


exports.createPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.create({
      user: req.user.id,
      title: req.body.title,
      goal: req.body.goal,
      experienceLevel: req.body.experienceLevel,
      durationWeeks: req.body.durationWeeks,
      daysPerWeek: req.body.daysPerWeek,

      exercises: req.body.exercises.map(ex => ({
        name: ex.name,
        muscleGroup: ex.muscleGroups || ex.muscleGroup,
        sets: ex.sets,
        reps: ex.reps,
        restSeconds: ex.restSeconds || 60
      })),

      notes: req.body.notes
    });

    res.status(201).json({
      message: "Workout plan created",
      plan
    });

  } catch (error) {
    console.error("CREATE PLAN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET USER PLANS
exports.getUserPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ user: req.user.id });
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


// 🛡️ WEEK 8 SMART COACH RECOVERY LOGIC
exports.generateSmartRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Fetch User Data to pass to the KNN model
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Mongoose 48-Hour Lookback Query
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    const recentPlans = await WorkoutPlan.find({
      user: userId,
      createdAt: { $gte: fortyEightHoursAgo }
    });

    // 3. Extract the Exhausted Muscles using a Set (to avoid duplicates)
    const exhaustedMuscles = new Set();
    recentPlans.forEach(plan => {
      plan.exercises.forEach(ex => {
        if (ex.muscleGroup) {
          exhaustedMuscles.add(ex.muscleGroup.toLowerCase());
        }
      });
    });

    const exhaustedArray = Array.from(exhaustedMuscles);

    // 4. Map User Profile strings to ML Integers
    const expMap = { "beginner": 1, "intermediate": 2, "advanced": 3 };
    const goalMap = { "fat loss": 1, "muscle gain": 2, "maintenance": 3 };

    // 5. Hit the Python Microservice via Node Bridge
    const aiResponse = await aiModelService.getCollaborativeRecommendation({
      age: user.age || 25,
      weight_kg: user.weight || 70,
      experience_level: expMap[user.experience] || 1,
      goal_type: goalMap[user.goal] || 1,
      exhausted_muscles: exhaustedArray
    });

    res.status(200).json({
      message: "Smart Plan Generated successfully",
      fatigue_detected: exhaustedArray.length > 0,
      exhaustedMuscles: exhaustedArray,
      ai_recommendation: aiResponse
    });

  } catch (error) {
    console.error("SMART COACH ERROR:", error);
    res.status(500).json({ message: "Failed to generate smart recommendation." });
  }
};