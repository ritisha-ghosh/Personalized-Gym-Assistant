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

// 🚀 Performance Index
userLogSchema.index({ user: 1, date: -1 });

/**
 * 🔥 Fetch last 48 hours logs for Recovery Logic
 */
userLogSchema.statics.getLast48HoursLogs = async function () {
  const now = new Date();
  const last48Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const logs = await this.aggregate([
    {
      $match: {
        date: { $gte: last48Hours }
      }
    },
    {
      $sort: { date: -1 }
    },
    {
      $group: {
        _id: "$user",

        // Keep logs lightweight (important)
        logs: {
          $push: {
            status: "$status",
            difficultyRating: "$difficultyRating",
            date: "$date"
          }
        },

        latestStatus: { $first: "$status" },

        avgDifficulty: { $avg: "$difficultyRating" },

        totalLogs: { $sum: 1 },

        missedCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "missed"] }, 1, 0]
          }
        }
      }
    }
  ]);

  return logs;
};

module.exports = mongoose.model("UserLog", userLogSchema);