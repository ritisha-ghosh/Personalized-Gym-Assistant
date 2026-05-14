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
    
    // ⭐ ALWAYS fetch fresh user data from DB (not cached) to ensure real-time sync
    const user = await User.findById(userId).lean(); // .lean() for performance
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔍 DEBUG: Log what we're fetching
    console.log(`📋 getWeeklyPlan - User: ${user.name}, Experience: ${user.experience}, Goal: ${user.goal}`);

    // 1. SMART RECOVERY: Detect exhausted muscles and injuries
    const musclesToAvoid = new Set();
    if (user.injury && user.injury !== 'none') {
      musclesToAvoid.add(user.injury.toLowerCase());
    }

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentLogs = await UserLog.find({
      user: userId,
      date: { $gte: fortyEightHoursAgo },
      status: "active"
    });

    // NOTE: This assumes 'exercisesLogged' is an array of objects with a 'muscleGroup' property.
    // This structure should be consistent with how workouts are logged.
    recentLogs.forEach(log => {
      if (log.exercisesLogged && Array.isArray(log.exercisesLogged)) {
        log.exercisesLogged.forEach(ex => {
          if (ex.muscleGroup) {
            musclesToAvoid.add(ex.muscleGroup.toLowerCase());
          }
        });
      }
    });
    console.log(`🛡️ Smart Recovery: Avoiding muscles: ${[...musclesToAvoid].join(', ')}`);

    // 2. DYNAMIC ADJUSTMENTS based on Goal and Age
    const adjustments = {
      volumeMultiplier: 1.0, // 1.0 means no change
      repModifier: 0,
      notes: []
    };

    if (user.goal === 'fat loss') {
      adjustments.repModifier = 2; // Add 2 reps for endurance
      adjustments.notes.push('Focus on shorter rests for higher intensity.');
    } else if (user.goal === 'muscle gain') {
      adjustments.volumeMultiplier = 1.1; // 10% more volume (sets)
      adjustments.repModifier = -2; // 2 fewer reps for strength focus
      adjustments.notes.push('Focus on progressive overload and lifting heavy.');
    }

    if (user.age && user.age > 50) {
      adjustments.notes.push('Listen to your body and prioritize longer warm-ups and recovery.');
    }
    // Define workout templates based on experience level
    const workoutTemplates = {
      beginner: [
        {
          day: 0, // Monday
          title: "Upper Body A",
          focusMuscles: ["chest", "back", "biceps"],
          exercises: [
            { name: "Bench Press", sets: 3, reps: "10-12", muscleGroup: "chest", weight: "60 kg" },
            { name: "Barbell Rows", sets: 3, reps: "10-12", muscleGroup: "back", weight: "60 kg" },
            { name: "Dumbbell Curls", sets: 3, reps: "12-15", muscleGroup: "biceps", weight: "15 kg" },
          ]
        },
        {
          day: 1, // Tuesday
          title: "Lower Body A",
          focusMuscles: ["quads", "glutes"],
          exercises: [
            { name: "Barbell Squats", sets: 3, reps: "10-12", muscleGroup: "quads", weight: "70 kg" },
            { name: "Leg Press", sets: 3, reps: "12-15", muscleGroup: "glutes", weight: "100 kg" },
            { name: "Leg Curls", sets: 3, reps: "12-15", muscleGroup: "hamstrings", weight: "50 kg" },
          ]
        },
        {
          day: 2, // Wednesday
          title: "Active Recovery",
          focusMuscles: ["general"],
          type: "recovery",
          exercises: [
            { name: "Light Cardio", duration: "30 mins", type: "cardio", sets: 1, reps: "1 session" },
            { name: "Stretching & Mobility", duration: "15 mins", type: "mobility", sets: 1, reps: "1 session" },
          ]
        },
        {
          day: 3, // Thursday
          title: "Upper Body B",
          focusMuscles: ["shoulders", "triceps"],
          exercises: [
            { name: "Overhead Press", sets: 3, reps: "8-10", muscleGroup: "shoulders", weight: "45 kg" },
            { name: "Lateral Raises", sets: 3, reps: "12-15", muscleGroup: "shoulders", weight: "12 kg" },
            { name: "Tricep Dips", sets: 3, reps: "8-12", muscleGroup: "triceps", weight: "bodyweight" },
          ]
        },
        {
          day: 4, // Friday
          title: "Lower Body B",
          focusMuscles: ["hamstrings", "calves"],
          exercises: [
            { name: "Romanian Deadlifts", sets: 3, reps: "8-10", muscleGroup: "hamstrings", weight: "80 kg" },
            { name: "Walking Lunges", sets: 3, reps: "12 each", muscleGroup: "quads", weight: "15 kg each" },
            { name: "Calf Raises", sets: 3, reps: "15-20", muscleGroup: "calves", weight: "bodyweight" },
          ]
        },
        {
          day: 5, // Saturday
          title: "Core & Conditioning",
          focusMuscles: ["core"],
          exercises: [
            { name: "Planks", sets: 3, reps: "30-60 secs", muscleGroup: "core", weight: "bodyweight" },
            { name: "Ab Wheel Rollouts", sets: 3, reps: "8-12", muscleGroup: "core", weight: "bodyweight" },
          ]
        },
        {
          day: 6, // Sunday
          title: "Rest Day",
          focusMuscles: ["rest"],
          type: "rest",
          exercises: []
        }
      ],
      intermediate: [
        {
          day: 0, // Monday
          title: "Chest & Triceps",
          focusMuscles: ["chest", "triceps"],
          exercises: [
            { name: "Barbell Bench Press", sets: 4, reps: "6-8", muscleGroup: "chest", weight: "100 kg" },
            { name: "Incline DB Press", sets: 3, reps: "8-10", muscleGroup: "chest", weight: "40 kg" },
            { name: "Cable Flyes", sets: 3, reps: "12-15", muscleGroup: "chest", weight: "25 kg" },
            { name: "Tricep Pushdowns", sets: 3, reps: "12-15", muscleGroup: "triceps", weight: "30 kg" },
          ]
        },
        {
          day: 1, // Tuesday
          title: "Back & Biceps",
          focusMuscles: ["back", "biceps"],
          exercises: [
            { name: "Deadlifts", sets: 4, reps: "5-6", muscleGroup: "back", weight: "140 kg" },
            { name: "Barbell Rows", sets: 4, reps: "6-8", muscleGroup: "back", weight: "110 kg" },
            { name: "Barbell Curls", sets: 3, reps: "8-10", muscleGroup: "biceps", weight: "35 kg" },
            { name: "Preacher Curls", sets: 3, reps: "10-12", muscleGroup: "biceps", weight: "25 kg" },
          ]
        },
        {
          day: 2, // Wednesday
          title: "Active Recovery",
          focusMuscles: ["general"],
          type: "recovery",
          exercises: [
            { name: "Steady State Cardio", duration: "45 mins", type: "cardio", sets: 1, reps: "1 session" },
            { name: "Yoga & Stretching", duration: "20 mins", type: "mobility", sets: 1, reps: "1 session" },
          ]
        },
        {
          day: 3, // Thursday
          title: "Shoulders & Abs",
          focusMuscles: ["shoulders", "core"],
          exercises: [
            { name: "Military Press", sets: 4, reps: "6-8", muscleGroup: "shoulders", weight: "70 kg" },
            { name: "Lateral Raises", sets: 3, reps: "12-15", muscleGroup: "shoulders", weight: "18 kg" },
            { name: "Hanging Leg Raises", sets: 3, reps: "10-12", muscleGroup: "core", weight: "bodyweight" },
            { name: "Ab Wheel Rollouts", sets: 3, reps: "12-15", muscleGroup: "core", weight: "bodyweight" },
          ]
        },
        {
          day: 4, // Friday
          title: "Leg Day",
          focusMuscles: ["quads", "hamstrings", "glutes"],
          exercises: [
            { name: "Barbell Squats", sets: 4, reps: "6-8", muscleGroup: "quads", weight: "130 kg" },
            { name: "Leg Press", sets: 3, reps: "8-10", muscleGroup: "quads", weight: "200 kg" },
            { name: "Romanian Deadlifts", sets: 3, reps: "8-10", muscleGroup: "hamstrings", weight: "120 kg" },
            { name: "Leg Curls", sets: 3, reps: "10-12", muscleGroup: "hamstrings", weight: "80 kg" },
          ]
        },
        {
          day: 5, // Saturday
          title: "Full Body Pump",
          focusMuscles: ["full body"],
          exercises: [
            { name: "Circuit Training (3 rounds)", duration: "45 mins", type: "circuit", sets: 3, reps: "1 circuit" },
          ]
        },
        {
          day: 6, // Sunday
          title: "Rest & Recovery",
          focusMuscles: ["rest"],
          type: "rest",
          exercises: []
        }
      ],
      advanced: [
        {
          day: 0, // Monday
          title: "Upper Power",
          focusMuscles: ["chest", "back", "shoulders"],
          exercises: [
            { name: "Barbell Bench Press", sets: 5, reps: "3-5", muscleGroup: "chest", weight: "130 kg" },
            { name: "Close Grip Bench", sets: 3, reps: "5-8", muscleGroup: "chest", weight: "110 kg" },
            { name: "Barbell Rows", sets: 5, reps: "3-5", muscleGroup: "back", weight: "150 kg" },
            { name: "Weighted Pull-ups", sets: 4, reps: "5-8", muscleGroup: "back", weight: "30 kg" },
          ]
        },
        {
          day: 1, // Tuesday
          title: "Lower Power",
          focusMuscles: ["quads", "hamstrings", "glutes"],
          exercises: [
            { name: "Barbell Back Squats", sets: 5, reps: "3-5", muscleGroup: "quads", weight: "160 kg" },
            { name: "Deadlifts", sets: 3, reps: "3-5", muscleGroup: "hamstrings", weight: "180 kg" },
            { name: "Weighted Dips", sets: 4, reps: "5-8", muscleGroup: "triceps", weight: "40 kg" },
          ]
        },
        {
          day: 2, // Wednesday
          title: "Upper Hypertrophy",
          focusMuscles: ["chest", "back", "biceps"],
          exercises: [
            { name: "Incline Barbell Press", sets: 4, reps: "6-10", muscleGroup: "chest", weight: "100 kg" },
            { name: "Dumbbell Rows", sets: 4, reps: "8-12", muscleGroup: "back", weight: "50 kg" },
            { name: "Barbell Curls", sets: 4, reps: "8-12", muscleGroup: "biceps", weight: "45 kg" },
            { name: "Machine Flyes", sets: 3, reps: "12-15", muscleGroup: "chest", weight: "80 kg" },
          ]
        },
        {
          day: 3, // Thursday
          title: "Active Recovery",
          focusMuscles: ["general"],
          type: "recovery",
          exercises: [
            { name: "Low Intensity Cardio", duration: "60 mins", type: "cardio", sets: 1, reps: "1 session" },
            { name: "Mobility & Flexibility", duration: "30 mins", type: "mobility", sets: 1, reps: "1 session" },
          ]
        },
        {
          day: 4, // Friday
          title: "Lower Hypertrophy",
          focusMuscles: ["quads", "hamstrings", "glutes", "calves"],
          exercises: [
            { name: "Leg Press", sets: 4, reps: "8-12", muscleGroup: "quads", weight: "250 kg" },
            { name: "Hack Squats", sets: 4, reps: "8-12", muscleGroup: "quads", weight: "180 kg" },
            { name: "Nordic Curls", sets: 3, reps: "6-10", muscleGroup: "hamstrings", weight: "bodyweight" },
            { name: "Leg Extensions", sets: 3, reps: "12-15", muscleGroup: "quads", weight: "100 kg" },
          ]
        },
        {
          day: 5, // Saturday
          title: "Shoulders & Abs",
          focusMuscles: ["shoulders", "core"],
          exercises: [
            { name: "Overhead Press", sets: 4, reps: "6-8", muscleGroup: "shoulders", weight: "80 kg" },
            { name: "Machine Shoulder Press", sets: 4, reps: "8-12", muscleGroup: "shoulders", weight: "90 kg" },
            { name: "Weighted Ab Wheel", sets: 4, reps: "10-15", muscleGroup: "core", weight: "5 kg" },
            { name: "Cable Crunches", sets: 3, reps: "12-15", muscleGroup: "core", weight: "60 kg" },
          ]
        },
        {
          day: 6, // Sunday
          title: "Complete Rest",
          focusMuscles: ["rest"],
          type: "rest",
          exercises: []
        }
      ]
    };

    // Get the user's experience level (default to intermediate)
    const experience = (user.experience || "intermediate").toLowerCase();
    const templateWeek = workoutTemplates[experience] || workoutTemplates.intermediate;

    // Generate the week starting from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekPlan = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);
      
      // Get the real day of week (0 = Sunday, 1 = Monday, ... 6 = Saturday)
      const realDayOfWeek = currentDate.getDay();
      
      // Convert to our template index (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
      const templateDayIndex = realDayOfWeek === 0 ? 6 : realDayOfWeek - 1;
      
      // Get the correct template for this day of week
      let dayTemplate = { ...templateWeek[templateDayIndex] }; // Make a copy to modify

      // Clean up title (remove A/B)
      dayTemplate.title = dayTemplate.title.replace(/ (A|B)$/, '').trim();

      // Check for muscle fatigue or injury
      const isRecoveryDay = dayTemplate.focusMuscles.some(fm => musclesToAvoid.has(fm.toLowerCase()));

      if (isRecoveryDay && dayTemplate.type !== 'rest' && dayTemplate.type !== 'recovery') {
        // Override the planned workout with a smart recovery session
        dayTemplate = {
          ...dayTemplate,
          title: "Smart Recovery",
          type: "recovery",
          focusMuscles: ["general"],
          exercises: [
            { name: "Light Cardio (e.g., walking, cycling)", duration: "30-40 mins", type: "cardio", sets: 1, reps: "1 session" },
            { name: "Full Body Stretching & Mobility", duration: "15-20 mins", type: "mobility", sets: 1, reps: "1 session" },
          ],
          notes: `AI detected recent fatigue or injury affecting your ${[...dayTemplate.focusMuscles].join(', ')}. Prioritizing recovery today.`
        };
      } else if (dayTemplate.type !== 'rest' && dayTemplate.type !== 'recovery') {
        // Apply dynamic adjustments to regular workout days
        dayTemplate.exercises = dayTemplate.exercises.map(ex => {
          const newSets = Math.max(1, Math.round(ex.sets * adjustments.volumeMultiplier));

          // Adjust reps - handle string reps like "10-12"
          let newReps = ex.reps;
          if (typeof ex.reps === 'string' && ex.reps.includes('-')) {
            const [min, max] = ex.reps.split('-').map(Number);
            newReps = `${Math.max(1, min + adjustments.repModifier)}-${Math.max(1, max + adjustments.repModifier)}`;
          } else if (typeof ex.reps === 'number') {
            newReps = Math.max(1, ex.reps + adjustments.repModifier);
          }

          return { ...ex, sets: newSets, reps: newReps };
        });
        if (adjustments.notes.length > 0 && !dayTemplate.notes) {
          dayTemplate.notes = adjustments.notes.join(' ');
        }
      }
      
      // Use local date format YYYY-MM-DD instead of toISOString() which shifts to UTC
      const localDateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      const dayPlan = {
        date: localDateString,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        isToday: i === 0,
        dayIndex: i,
        ...dayTemplate, // Use the modified template
        completed: false,
        completedExercises: []
      };

      weekPlan.push(dayPlan);
    }

    // Check today's logs to see if workout is already completed
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayLogs = await UserLog.findOne({
      user: userId,
      date: { $gte: todayStart, $lt: todayEnd },
      status: "active"
    });

    if (todayLogs) {
      weekPlan[0].completed = true;
      if (todayLogs.exercisesLogged) {
        weekPlan[0].completedExercises = todayLogs.exercisesLogged;
      }
    }

    // ⭐ Debug logging for calendar dates
    console.log(`📅 Weekly Plan Generated - Date Range: ${weekPlan[0].date} to ${weekPlan[6].date}`);
    weekPlan.forEach((day, idx) => {
      console.log(`   Day ${idx}: ${day.dayName} - ${day.date} - ${day.title}`);
    });

    res.status(200).json({
      message: "Weekly plan generated successfully",
      user: {
        name: user.name,
        experienceLevel: experience,
        goal: user.goal,
        age: user.age,
        weight: user.weight,
        injury: user.injury
      },
      weekPlan,
      currentWeek: {
        startDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
        endDate: (() => {
          const d = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })()
      }
    });

  } catch (error) {
    console.error("GET WEEKLY PLAN ERROR:", error);
    res.status(500).json({ message: "Failed to get weekly plan", error: error.message });
  }
};

// 🥗 GET DYNAMIC WEEKLY NUTRITION PLAN
exports.getWeeklyNutritionPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Define Diet Templates (can be moved to a service file)
    const dietTemplates = {
      'non-vegetarian': [
        { meal: "Breakfast", suggestion: "Scrambled Eggs with Whole Wheat Toast" },
        { meal: "Lunch", suggestion: "Grilled Chicken Salad with Vinaigrette" },
        { meal: "Dinner", suggestion: "Salmon with Roasted Asparagus" },
        { meal: "Snack", suggestion: "Greek Yogurt with Berries" },
      ],
      'vegetarian': [
        { meal: "Breakfast", suggestion: "Oatmeal with Nuts and Fruits" },
        { meal: "Lunch", suggestion: "Lentil Soup with a side of Brown Rice" },
        { meal: "Dinner", suggestion: "Paneer Tikka with Quinoa" },
        { meal: "Snack", suggestion: "Apple slices with Peanut Butter" },
      ],
      'vegan': [
        { meal: "Breakfast", suggestion: "Tofu Scramble with Spinach and Turmeric" },
        { meal: "Lunch", suggestion: "Chickpea and Avocado Sandwich" },
        { meal: "Dinner", suggestion: "Black Bean Burgers on Whole Wheat Buns" },
        { meal: "Snack", suggestion: "A handful of Almonds" },
      ],
      'default': [ // Fallback
        { meal: "Breakfast", suggestion: "Balanced breakfast with protein and carbs" },
        { meal: "Lunch", suggestion: "Lean protein with plenty of vegetables" },
        { meal: "Dinner", suggestion: "Light dinner with complex carbs" },
        { meal: "Snack", suggestion: "Healthy fruit or nut snack" },
      ]
    };

    // 2. Select template and apply dynamic ML/rule-based adjustments
    const userDietType = (user.dietType || 'default').toLowerCase().trim();
    let dailyPlanTemplate = JSON.parse(JSON.stringify(dietTemplates[userDietType] || dietTemplates['default']));

    const allergyNotes = [];
    if (user.noGarlic) allergyNotes.push("Prepare all meals without garlic.");
    if (user.noOnion) allergyNotes.push("Prepare all meals without onion.");
    // A real ML model would provide specific meal replacements here.

    if (user.goal === 'fat loss') {
        dailyPlanTemplate.push({ meal: "Pro Tip", suggestion: "Drink plenty of water and focus on high-fiber foods." });
    } else if (user.goal === 'muscle gain') {
        dailyPlanTemplate.push({ meal: "Pro Tip", suggestion: "Ensure high protein intake in every meal to support muscle repair." });
    }

    // 3. Generate 7-day plan with real dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekPlan = [];
    const dates = Array.from({ length: 7 }).map((_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000));

    // 4. Fetch completion logs for the week
    const weekStart = dates[0];
    const weekEnd = new Date(dates[6]);
    weekEnd.setDate(weekEnd.getDate() + 1);

    const completedLogs = await UserLog.find({
        user: userId,
        status: 'diet_day_completed',
        date: { $gte: weekStart, $lt: weekEnd }
    }).lean();

    const completedDates = new Set(completedLogs.map(log => log.date.toISOString().split('T')[0]));

    for (let i = 0; i < 7; i++) {
      const currentDate = dates[i];
      const dateString = currentDate.toISOString().split('T')[0];

      weekPlan.push({
        date: dateString,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        isToday: i === 0,
        meals: dailyPlanTemplate,
        notes: allergyNotes.join(' '),
        completed: completedDates.has(dateString)
      });
    }

    res.status(200).json({ weekPlan });
  } catch (error) {
    console.error("GET NUTRITION PLAN ERROR:", error);
    res.status(500).json({ message: "Failed to get nutrition plan", error: error.message });
  }
};