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

  date: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// 🚀 Performance Index
userLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("UserLog", userLogSchema);
