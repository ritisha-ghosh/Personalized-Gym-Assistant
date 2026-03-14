const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["active", "rest", "injured", "sick", "missed"],
    required: true
  },

  // AI Sensor - Modified by Pritam
  difficultyRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  date: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true,
  collection: "userlogs"
});

// 🚀 Performance Index (important for high-volume logging)
userLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("UserLog", userLogSchema);
