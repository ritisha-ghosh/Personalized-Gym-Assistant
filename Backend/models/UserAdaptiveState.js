const mongoose = require("mongoose");

const userAdaptiveStateSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  // ----------------------------
  // 🎯 WORKOUT ADAPTATION
  // ----------------------------

  difficultyCoefficient: {
    type: Number,
    default: 1.0,
    min: 0.5,
    max: 1.5
  },

  complianceScore: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 1
  },

  fatigueScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },

  recoveryScore: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 1
  },

  // ----------------------------
  // 🩺 MEDICAL ADAPTATION
  // ----------------------------

  injuryRisk: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },

  rehabPhase: {
    type: String,
    enum: [
      "healthy",
      "acute injury",
      "returning from injury"
    ],
    default: "healthy"
  },

  // ----------------------------
  // 📊 SYSTEM TRACKING
  // ----------------------------

  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model(
  "UserAdaptiveState",
  userAdaptiveStateSchema
);