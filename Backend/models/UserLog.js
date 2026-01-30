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
  
  //(The "AI Sensor") -Mod by Pritam
  difficultyRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5 
    // 1-3: Too Easy, 4-7: Perfect, 8-10: Too Hard
  },

  date: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// 🚀 Performance Index
userLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("UserLog", userLogSchema);
