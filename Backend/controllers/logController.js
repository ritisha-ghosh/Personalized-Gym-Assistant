const UserLog = require("../models/UserLog");

// CREATE LOG
exports.createLog = async (req, res) => {
  console.log("CREATE LOG ROUTE HIT");

  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { status, difficultyRating } = req.body;

    // Basic validation
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const log = await UserLog.create({
      user: req.user._id,
      status,
      difficultyRating
    });

    res.status(201).json({
      message: "Log created successfully",
      log
    });

  } catch (error) {
    console.error("Create log error:", error);

    res.status(500).json({
      message: "Server error while creating log",
      error: error.message
    });
  }
};


// GET ALL LOGS FOR LOGGED-IN USER
exports.getUserLogs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const logs = await UserLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .lean(); // improves performance for large log lists

    res.json(logs);

  } catch (error) {
    console.error("Get logs error:", error);

    res.status(500).json({
      message: "Server error while fetching logs"
    });
  }
};


// UPDATE LOG
exports.updateLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const updated = await UserLog.findByIdAndUpdate(
      logId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json(updated);

  } catch (error) {
    console.error("Update log error:", error);

    res.status(500).json({
      message: "Server error while updating log"
    });
  }
};


// DELETE LOG
exports.deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const deleted = await UserLog.findByIdAndDelete(logId);

    if (!deleted) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ message: "Log deleted successfully" });

  } catch (error) {
    console.error("Delete log error:", error);

    res.status(500).json({
      message: "Server error while deleting log"
    });
  }
};
