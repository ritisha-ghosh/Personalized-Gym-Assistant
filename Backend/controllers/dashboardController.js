const mongoose = require("mongoose");
const UserLog = require("../models/UserLog");

exports.getDashboardMetrics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(now.getDate() - 29);
    startOfMonth.setHours(0, 0, 0, 0);

    // =========================
    // FETCH DATA
    // =========================
    const [todayLogs, weeklyLogs, monthlyLogs] = await Promise.all([
      UserLog.find({ user: userId, date: { $gte: startOfToday } }),
      UserLog.find({ user: userId, date: { $gte: startOfWeek } }),
      UserLog.find({ user: userId, date: { $gte: startOfMonth } })
    ]);

    // =========================
    // 📅 TODAY
    // =========================
    const today = {
      totalLogs: todayLogs.length,
      avgDifficulty:
        todayLogs.reduce((a, b) => a + (b.difficultyRating || 0), 0) /
        (todayLogs.length || 1),

      statusBreakdown: todayLogs.reduce((acc, log) => {
        acc[log.status] = (acc[log.status] || 0) + 1;
        return acc;
      }, {}),

      latestWeight:
        todayLogs.length > 0
          ? todayLogs[todayLogs.length - 1].weight
          : null
    };

    // =========================
    // 📊 WEEKLY TREND (FIXED: DATE-BASED)
    // =========================
    const weeklyMap = {};

    weeklyLogs.forEach((log) => {
      const dateKey = log.date.toISOString().split("T")[0];

      if (!weeklyMap[dateKey]) {
        weeklyMap[dateKey] = {
          date: dateKey,
          total: 0,
          difficultySum: 0
        };
      }

      weeklyMap[dateKey].total += 1;
      weeklyMap[dateKey].difficultySum += log.difficultyRating || 0;
    });

    const weeklyTrend = Object.values(weeklyMap).map((d) => ({
      date: d.date,
      logs: d.total,
      avgDifficulty: d.difficultySum / (d.total || 1)
    }));

    // =========================
    // 📈 MONTHLY WEIGHT TREND (FIXED: GROUPED)
    // =========================
    const monthlyMap = {};

monthlyLogs.forEach((log) => {
  if (!log.weight) return;

  const date = log.date.toISOString().split("T")[0];
  monthlyMap[date] = log.weight;
});

const monthlyTrend = Object.entries(monthlyMap).map(
  ([date, weight]) => ({
    date,
    weight
  })
);



    // =========================
    // 🧠 PERFORMANCE SCORE (NORMALIZED)
    // =========================
    const activeDays = weeklyLogs.filter(l => l.status === "active").length;
    const missedDays = weeklyLogs.filter(l => l.status === "missed").length;

    const performanceScore = Math.min(
      100,
      Math.max(
        0,
        activeDays * 10 - missedDays * 5 + (today.avgDifficulty || 0) * 2
      )
    );

    // =========================
    // RESPONSE
    // =========================
    res.json({
      today,
      weeklyTrend,
      monthlyTrend,
      performanceScore
    });

  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};