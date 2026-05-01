const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema(
{
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

  difficultyRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 300
  },

  date: {
    type: Date,
    default: Date.now
  }

},
{
  timestamps: true,
  collection: "userlogs"
}
);

/* Performance Index */
userLogSchema.index({ user: 1, date: -1 });

/* Last 48 Hours Logs */
userLogSchema.statics.getLast48HoursLogs = async function (userId) {
  const now = new Date();
  const last48Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  return await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: last48Hours }
      }
    },
    { $sort: { date: -1 } },

    {
      $group: {
        _id: "$user",

        logs: {
          $push: {
            status: "$status",
            difficultyRating: "$difficultyRating",
            weight: "$weight",
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
};

module.exports = mongoose.model("UserLog", userLogSchema);