const UserLog = require("../models/UserLog");
const UserAdaptiveState = require("../models/UserAdaptiveState");

// =====================================================
// 🧠 UPDATE USER ADAPTIVE STATE
// =====================================================

const updateAdaptiveState = async (userId) => {

  try {

    // -------------------------------------------------
    // FETCH LAST 48 HOURS LOGS
    // -------------------------------------------------

    const logsData =
      await UserLog.getLast48HoursLogs(userId);

    if (!logsData || logsData.length === 0) {
      return null;
    }

    const data = logsData[0];

    // -------------------------------------------------
    // GET OR CREATE STATE
    // -------------------------------------------------

    let adaptiveState =
      await UserAdaptiveState.findOne({
        user: userId
      });

    if (!adaptiveState) {

      adaptiveState =
        await UserAdaptiveState.create({
          user: userId
        });

    }

    // -------------------------------------------------
    // CURRENT VALUES
    // -------------------------------------------------

    let difficultyCoefficient =
      adaptiveState.difficultyCoefficient;

    let complianceScore =
      adaptiveState.complianceScore;

    let fatigueScore =
      adaptiveState.fatigueScore;

    let recoveryScore =
      adaptiveState.recoveryScore;

    let injuryRisk =
      adaptiveState.injuryRisk;

    // -------------------------------------------------
    // ANALYZE USER FEEDBACK
    // -------------------------------------------------

    const avgDifficulty =
      data.avgDifficulty || 5;

    const missedCount =
      data.missedCount || 0;

    const latestStatus =
      data.latestStatus;

    // =================================================
    // 🎯 DIFFICULTY ADAPTATION
    // =================================================

    // Too difficult
    if (avgDifficulty >= 8) {

      difficultyCoefficient -= 0.1;
      fatigueScore += 2;

    }

    // Too easy
    else if (avgDifficulty <= 4) {

      difficultyCoefficient += 0.05;

    }

    // =================================================
    // 📉 COMPLIANCE ANALYSIS
    // =================================================

    if (missedCount >= 2) {

      complianceScore -= 0.1;
      recoveryScore -= 0.05;

    } else {

      complianceScore += 0.03;

    }

    // =================================================
    // 🩺 INJURY / SICK DETECTION
    // =================================================

    if (
      latestStatus === "injured" ||
      latestStatus === "sick"
    ) {

      injuryRisk += 2;

      difficultyCoefficient -= 0.15;

      fatigueScore += 3;

    }

    // =================================================
    // 🔒 SAFE LIMITS
    // =================================================

    difficultyCoefficient =
      Math.max(
        0.5,
        Math.min(1.5, difficultyCoefficient)
      );

    complianceScore =
      Math.max(
        0,
        Math.min(1, complianceScore)
      );

    fatigueScore =
      Math.max(
        0,
        Math.min(10, fatigueScore)
      );

    recoveryScore =
      Math.max(
        0,
        Math.min(1, recoveryScore)
      );

    injuryRisk =
      Math.max(
        0,
        Math.min(10, injuryRisk)
      );

    // =================================================
    // 💾 SAVE UPDATED STATE
    // =================================================

    adaptiveState.difficultyCoefficient =
      difficultyCoefficient;

    adaptiveState.complianceScore =
      complianceScore;

    adaptiveState.fatigueScore =
      fatigueScore;

    adaptiveState.recoveryScore =
      recoveryScore;

    adaptiveState.injuryRisk =
      injuryRisk;

    adaptiveState.lastUpdated =
      new Date();

    await adaptiveState.save();

    console.log(
      `✅ Adaptive state updated for user ${userId}`
    );

    return adaptiveState;

  } catch (error) {

    console.error(
      "Adaptive Engine Error:",
      error.message
    );

  }

};

module.exports = {
  updateAdaptiveState
};