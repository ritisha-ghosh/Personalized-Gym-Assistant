const User = require("../models/User");
const { calculateBMR, calculateTDEE } = require("../services/dietCalculator");
const { generateDietPlan } = require("../services/dietPlanCalculator");

const getDietPlan = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 1: BMR
    const bmr = calculateBMR({
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      age: user.age,
    });

    // Step 2: TDEE
    const tdee = calculateTDEE(bmr, user.activityLevel);

    // Step 3: Diet Plan (Macros)
    const dietPlan = generateDietPlan({
      tdee,
      weight: user.weight,
      goal: user.goal,
    });

    res.status(200).json({
      BMR: Math.round(bmr),
      TDEE: Math.round(tdee),
      dietPlan,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Diet plan generation failed" });
  }
};

module.exports = { getDietPlan };
