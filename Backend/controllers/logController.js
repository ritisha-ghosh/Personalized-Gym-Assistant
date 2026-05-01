const UserLog = require("../models/UserLog");

/* CREATE LOG */
exports.createLog = async (req, res) => {
  try {
    const { status, difficultyRating, weight } = req.body;

    const log = await UserLog.create({
      user: req.user._id,
      status,
      difficultyRating,
      weight
    });

    res.status(201).json(log);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET USER LOGS */
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await UserLog.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE LOG */
exports.updateLog = async (req, res) => {
  try {
    const updated = await UserLog.findByIdAndUpdate(
      req.params.logId,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE LOG */
exports.deleteLog = async (req, res) => {
  try {
    await UserLog.findByIdAndDelete(req.params.logId);

    res.json({ message: "Log deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* LAST 48 HOURS LOGS */
exports.getLast48HoursLogs = async (req, res) => {
  try {
    const data = await UserLog.getLast48HoursLogs(req.user._id);

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};