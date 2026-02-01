const UserLog = require("../models/UserLog");

// CREATE LOG
exports.createLog = async (req, res) => {
  try {
    const { user, status, date } = req.body;

    const log = await UserLog.create({
      user,
      status,
      date
    });

    res.status(201).json({
      message: "Log created successfully",
      log
    });

  } catch (error) {
    console.error("Create log error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL LOGS FOR USER
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await UserLog.find({ user: userId }).sort({ date: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE LOG
exports.updateLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const updated = await UserLog.findByIdAndUpdate(
      logId,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE LOG
exports.deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;

    await UserLog.findByIdAndDelete(logId);

    res.json({ message: "Log deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
