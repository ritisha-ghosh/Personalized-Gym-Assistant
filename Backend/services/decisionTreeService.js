const applyWeeklyAdjustment = ({
  goal,
  avgDifficulty,
  missedDays,
  hasInjuryOrSick
}) => {
  const adjustment = {
    volumeMultiplier: 1,
    restAdjustment: 0,
    deload: false,
    notes: ""
  };

  // 🚨 SAFETY FIRST (Highest Priority)
  if (hasInjuryOrSick) {
    adjustment.deload = true;
    adjustment.volumeMultiplier = 0.6;
    adjustment.notes = "Deload applied due to injury or sickness";
    return adjustment;
  }

  // ❌ Poor adherence
  if (missedDays >= 3) {
    adjustment.volumeMultiplier = 0.8;
    adjustment.notes = "Volume reduced due to missed workouts";
    return adjustment;
  }

  // 🟢 MUSCLE GAIN LOGIC
  if (goal === "Muscle Gain") {
    if (avgDifficulty <= 3) {
      adjustment.volumeMultiplier = 1.15;
      adjustment.notes = "Workout too easy, increasing volume";
    } else if (avgDifficulty >= 8) {
      adjustment.volumeMultiplier = 0.9;
      adjustment.notes = "Workout too hard, reducing volume";
    } else {
      adjustment.notes = "Workout intensity optimal, no change";
    }
  }

  // 🔴 WEIGHT LOSS LOGIC
  if (goal === "Weight Loss") {
    if (avgDifficulty <= 3) {
      adjustment.restAdjustment = -10;
      adjustment.notes = "Workout too easy, reducing rest time";
    } else if (avgDifficulty >= 8) {
      adjustment.volumeMultiplier = 0.9;
      adjustment.notes = "Workout too hard, reducing volume";
    }
  }

  // 🟡 MAINTENANCE
  if (goal === "Maintenance") {
    adjustment.notes = "Maintenance phase, plan unchanged";
  }

  return adjustment;
};

module.exports = { applyWeeklyAdjustment };
