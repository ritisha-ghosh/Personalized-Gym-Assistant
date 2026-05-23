const WorkoutPlan = require("../models/WorkoutPlan");
const UserDietPlan = require("../models/UserDietPlan");
const UserLog = require("../models/UserLog");
const User = require("../models/User");
const aiModelService = require("../services/aiModelService");
const { applyWeeklyAdjustment } = require("../services/decisionTreeService");
const { getOrCreateWorkoutPlan } = require("../services/userPlanService");
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

    const adjustment = await applyWeeklyAdjustment({

      userId,

      goal: plan.goal,

      avgDifficulty,

      missedDays,

      hasInjuryOrSick

    });

    plan.exercises = plan.exercises.map(ex => ({

      ...ex.toObject(),

      sets: Math.max(
        1,
        Math.round(
          ex.sets * adjustment.volumeMultiplier
        )
      ),

      reps: Math.max(
        1,
        Math.round(
          ex.reps * adjustment.volumeMultiplier
        )
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
    const { getMLWorkoutRecommendation } = require("../services/userPlanService");

    const aiResponse = await getMLWorkoutRecommendation({

      age: user.age,

      weight: user.weight,

      height: user.height,

      gender: user.gender,

      goal: user.goal,

      experience: user.experience,

      injuries: user.injuries,
      medicalConditions: user.medicalConditions,

      // ✅ NEW
      medicalState: user.medicalState,

      // ✅ NEW
      exhaustedMuscles: exhaustedArray,

      // ✅ NEW
      fatigueDetected:
        exhaustedArray.length > 0

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

// 📝 GET CUSTOM WORKOUT NOTES - Get ALL notes (not just today)
exports.getCustomNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const logs = await UserLog.find({
      user: userId,
      status: 'note'
    }).sort({ createdAt: -1 });

    const notes = logs.map(log => ({ _id: log._id, text: log.notes, date: log.date }));

    res.status(200).json({ status: 'success', notes });
  } catch (error) {
    console.error("GET CUSTOM NOTES ERROR:", error);
    res.status(500).json({ message: "Server error while getting notes." });
  }
};

// 📝 ADD/DELETE CUSTOM WORKOUT NOTES
exports.addCustomNote = async (req, res) => {
  try {
    const { note, date } = req.body;
    const userId = req.user.id;

    if (!note) {
      return res.status(400).json({ message: "Note content is required." });
    }

    // We can save this as a 'note' type log
    const newLog = await UserLog.create({
      user: userId,
      status: 'note', // A new status for custom notes
      notes: note,
      date: date || new Date() // Use provided date or now
    });

    res.status(201).json({
      message: "Custom note added successfully.",
      log: newLog
    });

  } catch (error) {
    console.error("ADD CUSTOM NOTE ERROR:", error);
    res.status(500).json({ message: "Server error while adding note." });
  }
};

exports.deleteCustomNote = async (req, res) => {
  try {
    const { logId } = req.params;
    const userId = req.user.id;

    const log = await UserLog.findById(logId);

    if (!log) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Ensure the user owns this log
    if (log.user.toString() !== userId) {
      return res.status(403).json({ message: "User not authorized to delete this note." });
    }

    await UserLog.findByIdAndDelete(logId);

    res.status(200).json({ message: "Custom note deleted successfully." });

  } catch (error) {
    console.error("DELETE CUSTOM NOTE ERROR:", error);
    res.status(500).json({ message: "Server error while deleting note." });
  }
};

exports.logDietDay = async (req, res) => {
  try {
    const { date, completed } = req.body;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Standardize the date to the beginning of the day in UTC to avoid timezone issues
    targetDate.setUTCHours(0, 0, 0, 0);

    const logQuery = {
      user: userId,
      status: 'diet_day_completed',
      date: targetDate,
    };

    if (completed) {
      // Use updateOne with upsert to create if not exists, or do nothing if it does.
      await UserLog.updateOne(logQuery, { $set: logQuery }, { upsert: true });
      res.status(200).json({ message: "Diet day marked as completed." });
    } else {
      // If unchecking, delete the log
      await UserLog.deleteOne(logQuery);
      res.status(200).json({ message: "Diet day completion status removed." });
    }

  } catch (error) {
    console.error("LOG DIET DAY ERROR:", error);
    res.status(500).json({ message: "Server error while logging diet day." });
  }
};


// 🗓️ GET DYNAMIC WEEKLY PLAN - Shows today + next 6 days with ML recommendations
exports.getWeeklyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedPlan = await getOrCreateWorkoutPlan(userId);
    if (!savedPlan || !Array.isArray(savedPlan.weeklyPlan)) {
      return res.status(500).json({ message: "Failed to load workout plan" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayLogs = await UserLog.findOne({
      user: userId,
      date: { $gte: todayStart, $lt: todayEnd },
      status: "active"
    }).lean();

    const weekPlan = savedPlan.weeklyPlan.map((day) => {
      const updatedDay = { ...day };
      if (day.date === today.toISOString().slice(0, 10) && todayLogs) {
        updatedDay.completed = true;
        updatedDay.completedExercises = todayLogs.exercisesLogged || [];
      }
      return updatedDay;
    });

    res.status(200).json({
      message: "Weekly plan loaded successfully",
      user: {
        name: user.name,
        experienceLevel: (savedPlan.experienceLevel || user.experience || 'intermediate').toString().toLowerCase(),
        goal: user.goal,
        age: user.age,
        weight: user.weight,
        injuries: user.injuries,
        medicalConditions: user.medicalConditions,
        medicalState: user.medicalState
      },
      weeklyPlan: weekPlan,
      currentWeek: {
        startDate: weekPlan[0]?.date || today.toISOString().slice(0, 10),
        endDate: weekPlan[6]?.date || new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      }
    });
  } catch (error) {
    console.error("GET WEEKLY PLAN ERROR:", error);
    res.status(500).json({ message: "Failed to get weekly plan", error: error.message });
  }
};

// 🥗 GET DYNAMIC WEEKLY NUTRITION PLAN
// Note: Nutrition is now served by the diet-tracking controller and ML-backed services.