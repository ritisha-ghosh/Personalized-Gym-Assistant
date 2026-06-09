const User = require("../models/User");
const { calculateBMR, calculateTDEE } = require("../services/dietCalculator");
const { generateDietPlan } = require("../services/dietPlanCalculator");
const { getDietRecommendations } = require("../services/recommendationService");

const getDietPlan = async (req, res) => {
  try {
    // 🔐 Auth check
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // -----------------------------
    // 🛡️ STRICT PROFILE VALIDATION
    // -----------------------------
    const { weight, height, age, gender, activityLevel } = user;

    if (
      typeof weight !== "number" ||
      typeof height !== "number" ||
      typeof age !== "number" ||
      !gender
    ) {
      return res.status(400).json({
        message: "Invalid or incomplete profile data for diet calculation"
      });
    }

    // Optional: Hard fail on unrealistic values
    if (weight <= 0 || height <= 0 || age <= 0) {
      return res.status(400).json({
        message: "Profile contains impossible biological values"
      });
    }

    // -----------------------------
    // 🔢 BMR
    // -----------------------------
    const bmr = calculateBMR({
      gender,
      weight,
      height,
      age
    });

    // -----------------------------
    // 🔢 TDEE
    // -----------------------------
    const tdee = calculateTDEE(bmr, activityLevel , user.medicalState);

    // -----------------------------
    // 🍽️ MACROS
    // -----------------------------
    const dietPlan = generateDietPlan({
      tdee,
      weight,
      goal: user.goal
    });

    // -----------------------------
    // 🥗 DIET PREFERENCES
    // -----------------------------
    const dietPreferences = {
      dietType: user.dietType || "vegetarian",
      noOnion: user.noOnion || false,
      noGarlic: user.noGarlic || false,
      medicalConditions: user.medicalConditions,
      injuries: user.injuries
    };

    const recipeResponse = await getDietRecommendations(dietPreferences);

    // -----------------------------
    // ✅ SAFE RESPONSE
    // -----------------------------
    res.status(200).json({
      BMR: bmr,
      TDEE: tdee,
      macros: dietPlan,
      recipes: recipeResponse?.recipes || [],
      recipeCount: recipeResponse?.count || 0
    });

  } catch (error) {
    console.error("Diet plan generation error:", error);
    res.status(500).json({
      message: "Diet plan generation failed"
    });
  }
};

module.exports = { getDietPlan };
