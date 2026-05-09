const bcrypt = require('bcryptjs');
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
        profileImage: fullUser.profileImage, // This will now send the Base64 string directly
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


exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update text fields
    const fieldsToUpdate = ['name', 'height', 'weight', 'age', 'gender', 'experience', 'goal', 'dietType', 'bio', 'injury'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // --- DIRECT MONGODB IMAGE SAVING ---
    // If a file was uploaded, convert it from memory buffer to Base64 String
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.profileImage = base64Image; // Save the raw text string directly to the DB!
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage, // Sends back the Base64 string
        height: updatedUser.height,
        weight: updatedUser.weight,
        age: updatedUser.age,
        gender: updatedUser.gender,
        experience: updatedUser.experience,
        goal: updatedUser.goal,
        dietType: updatedUser.dietType,
        bio: updatedUser.bio,
        injury: updatedUser.injury,
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error("Validation Error on profile update:", error.errors);
      const messages = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({ message: `Invalid data: ${messages}` });
    }
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};


exports.deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Simply clear the string in the database. No files to delete!
    user.profileImage = "";
    await user.save();

    res.json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({ message: "Server error while deleting image." });
  }
};


exports.updateUserSettings = async (req, res) => {
  res.status(501).json({ message: "Not Implemented: updateUserSettings" });
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error while updating password" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body; 
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password provided." });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};