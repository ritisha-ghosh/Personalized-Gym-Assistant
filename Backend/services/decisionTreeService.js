const UserAdaptiveState = require("../models/UserAdaptiveState");

// =====================================================
// 🧠 WEEKLY ADAPTIVE WORKOUT ENGINE
// =====================================================

const applyWeeklyAdjustment = async ({

  userId,
  goal,
  avgDifficulty,
  missedDays,
  hasInjuryOrSick

}) => {

  // ===================================================
  // DEFAULT RESPONSE
  // ===================================================

  const adjustment = {

    volumeMultiplier: 1,
    restAdjustment: 0,
    deload: false,
    notes: ""

  };

  // ===================================================
  // FETCH ADAPTIVE STATE
  // ===================================================

  const adaptiveState =
    await UserAdaptiveState.findOne({
      user: userId
    });

  // Default coefficient
  let difficultyCoefficient = 1;

  if (adaptiveState) {

    difficultyCoefficient =
      adaptiveState.difficultyCoefficient;

  }

  // ===================================================
  // 🚨 SAFETY FIRST
  // ===================================================

  if (hasInjuryOrSick) {

    adjustment.deload = true;

    adjustment.volumeMultiplier =
      0.6 * difficultyCoefficient;

    adjustment.restAdjustment = 20;

    adjustment.notes =
      "Deload applied due to injury or sickness";

    return adjustment;

  }

  // ===================================================
  // ❌ LOW COMPLIANCE
  // ===================================================

  if (missedDays >= 3) {

    adjustment.volumeMultiplier =
      0.8 * difficultyCoefficient;

    adjustment.restAdjustment = 15;

    adjustment.notes =
      "Volume reduced due to missed workouts";

    return adjustment;

  }

  // ===================================================
  // 💪 MUSCLE GAIN
  // ===================================================

  if (goal === "Muscle Gain") {

    // Workout too easy
    if (avgDifficulty <= 3) {

      adjustment.volumeMultiplier =
        1.15 * difficultyCoefficient;

      adjustment.notes =
        "Workout too easy, increasing volume";

    }

    // Workout too hard
    else if (avgDifficulty >= 8) {

      adjustment.volumeMultiplier =
        0.9 * difficultyCoefficient;

      adjustment.restAdjustment = 10;

      adjustment.notes =
        "Workout too hard, reducing volume";

    }

    // Optimal intensity
    else {

      adjustment.volumeMultiplier =
        1.0 * difficultyCoefficient;

      adjustment.notes =
        "Workout intensity optimal";

    }

  }

  // ===================================================
  // 🔥 FAT LOSS
  // ===================================================

  if (goal === "Weight Loss") {

    // Too easy
    if (avgDifficulty <= 3) {

      adjustment.restAdjustment = -10;

      adjustment.volumeMultiplier =
        1.05 * difficultyCoefficient;

      adjustment.notes =
        "Reducing rest time for fat loss";

    }

    // Too difficult
    else if (avgDifficulty >= 8) {

      adjustment.volumeMultiplier =
        0.9 * difficultyCoefficient;

      adjustment.restAdjustment = 10;

      adjustment.notes =
        "Workout too hard, reducing load";

    }

  }

  // ===================================================
  // 🟡 MAINTENANCE
  // ===================================================

  if (goal === "Maintenance") {

    adjustment.volumeMultiplier =
      1.0 * difficultyCoefficient;

    adjustment.notes =
      "Maintenance phase stable";

  }

  // ===================================================
  // 🔒 SAFE LIMITS
  // ===================================================

  adjustment.volumeMultiplier =
    Math.max(
      0.5,
      Math.min(1.5, adjustment.volumeMultiplier)
    );

  adjustment.restAdjustment =
    Math.max(
      -20,
      Math.min(40, adjustment.restAdjustment)
    );

  return adjustment;

};

module.exports = {
  applyWeeklyAdjustment
};