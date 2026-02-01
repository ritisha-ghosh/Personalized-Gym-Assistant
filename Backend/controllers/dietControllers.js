const { calculateBMR, calculateTDEE } = require("../services/dietCalculator");
const User = require("../models/User");

const getDietStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const bmr = calculateBMR({
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      age: user.age,
    });

    const tdee = calculateTDEE(bmr, user.activityLevel);

    res.status(200).json({
      BMR: Math.round(bmr),
      TDEE: Math.round(tdee),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDietStats,
};
