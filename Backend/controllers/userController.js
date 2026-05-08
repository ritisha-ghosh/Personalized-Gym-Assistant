const User = require("../models/User");

/**
 * @desc    Get current user profile (protected route)
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the full user object from DB to ensure all fields are current
    const fullUser = await User.findById(user.id);

    if (!fullUser) {
      return res.status(404).json({ message: "User not found in database" });
    }

    res.json({
      user: {
        id: fullUser._id,
        name: fullUser.name,
        email: fullUser.email,
        age: fullUser.age,
        gender: fullUser.gender,
        height: fullUser.height,
        weight: fullUser.weight,
        goal: fullUser.goal,
        profileImage: fullUser.profileImage,
        bio: fullUser.bio,
        injury: fullUser.injury,
        experience: fullUser.experience,
        dietType: fullUser.dietType,
        noOnion: fullUser.noOnion,
        noGarlic: fullUser.noGarlic
      }
    });

  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update user profile details like name, email, and optionally profile image.
 * @route   PUT /api/users/profile (for name/email)
 * @route   PUT /api/users/update-profile (for image + other fields)
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Update name if provided
      if (req.body.name !== undefined) {
        user.name = req.body.name;
      }
      // Email is currently not editable from the frontend settings, but if it were,
      // proper re-verification logic would be needed.
      // For now, we'll allow updating if provided, but frontend disables it.
      if (req.body.email !== undefined) {
        user.email = req.body.email;
      }

      // Handle profile image upload if present (from /update-profile route)
      if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`; // Store path to image
      }

      // Add other fields that might be updated from a profile page (e.g., UserProfile.jsx)
      // Example:
      // if (req.body.age !== undefined) user.age = req.body.age;
      // if (req.body.gender !== undefined) user.gender = req.body.gender;
      // ... etc.

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage, // Include profile image in response
        // Include other relevant fields that might have been updated
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

// Placeholder for other user-related functions if needed
exports.updateUserSettings = async (req, res) => {
  res.status(501).json({ message: "Not Implemented: updateUserSettings" });
};

exports.updatePassword = async (req, res) => {
  res.status(501).json({ message: "Not Implemented: updatePassword" });
};

exports.deleteAccount = async (req, res) => {
  res.status(501).json({ message: "Not Implemented: deleteAccount" });
};