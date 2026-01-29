const WorkoutPlan = require("../models/WorkoutPlan");
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
    const { userId } = req.params;

    const plans = await WorkoutPlan.find({ user: userId });

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
