const User = require("../models/User");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { age, weight, height, gender, goal, injury, experience, dietType, noOnion, noGarlic, bio } = req.body;

    const updateObj = {
      age: age || undefined,
      weight: weight || undefined,
      height: height || undefined,
      gender: gender || undefined,
      goal: goal || undefined,
      injury: injury || undefined,
      experience: experience || undefined,
      dietType: dietType || undefined,
      noOnion: noOnion !== undefined ? noOnion : undefined,
      noGarlic: noGarlic !== undefined ? noGarlic : undefined,
      bio: bio || undefined
    };

    // Handle file upload if present
    if (req.file) {
      try {
        const fs = require('fs');
        const fileData = fs.readFileSync(req.file.path);
        const base64Image = Buffer.from(fileData).toString('base64');
        const mimeType = req.file.mimetype;
        updateObj.profileImage = `data:${mimeType};base64,${base64Image}`;
        
        // Delete temporary file
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("File processing error:", fileError);
        return res.status(500).json({ message: "Error processing image file" });
      }
    }

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateObj,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ 
      message: "Profile updated successfully", 
      user 
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Update specific fields
exports.updateUserSettings = async (req, res) => {
  try {
    const { firstName, lastName, email, units, language, theme, emailNotifs, pushNotifs, marketingEmails, twoFactor } = req.body;

    // Merge firstName and lastName into name
    const name = firstName && lastName ? `${firstName} ${lastName}` : undefined;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || undefined,
        email: email || undefined
        // Note: Units, language, theme, notifications are frontend preferences
        // They can be stored in a separate UserSettings model if needed
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ 
      message: "Settings updated successfully", 
      user,
      preferences: {
        units,
        language,
        theme,
        emailNotifs,
        pushNotifs,
        marketingEmails,
        twoFactor
      }
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required to delete account" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
