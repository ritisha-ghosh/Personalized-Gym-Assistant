const bcrypt = require('bcryptjs');
const User = require("../models/User");
const UserLog = require("../models/UserLog");
const { regenerateUserPlans } = require("../services/userPlanService");

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
        medicalConditions: fullUser.medicalConditions || ["Regular"],
        injuries: fullUser.injuries || ["Regular"],
        difficulty_coefficient: fullUser.difficulty_coefficient, // 🔹 ADDED FOR WEEK 9 FEEDBACK
        experience: fullUser.experience,
        activityLevel: fullUser.activityLevel,
        dietType: fullUser.dietType,
        noOnion: fullUser.noOnion,
        noGarlic: fullUser.noGarlic,
        glutenFree: fullUser.glutenFree,
        lactoseFree: fullUser.lactoseFree,
        nutAllergy: fullUser.nutAllergy,
        sugarFree: fullUser.sugarFree
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

    const oldValues = {
      height: user.height,
      weight: user.weight,
      age: user.age,
      gender: user.gender,
      goal: user.goal,
      experience: user.experience,
      activityLevel: user.activityLevel,
      dietType: user.dietType,
      medicalConditions: user.medicalConditions,
      injuries: user.injuries,
      noOnion: user.noOnion,
      noGarlic: user.noGarlic,
      glutenFree: user.glutenFree,
      lactoseFree: user.lactoseFree,
      nutAllergy: user.nutAllergy,
      sugarFree: user.sugarFree
    };

    const oldWeight = user.weight;

    // Update regular text fields
    const fieldsToUpdate = ['name', 'height', 'weight', 'age', 'gender', 'experience', 'activityLevel', 'goal', 'dietType', 'bio', 'noOnion', 'noGarlic', 'glutenFree', 'lactoseFree', 'nutAllergy', 'sugarFree'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        // Convert string representations to boolean for checkboxes
        if (req.body[field] === 'true' || req.body[field] === 'false') {
          user[field] = req.body[field] === 'true';
        } else {
          user[field] = req.body[field];
        }
      }
    });

    // Handle medicalConditions and injuries arrays
    if (req.body.medicalConditions !== undefined) {
      if (Array.isArray(req.body.medicalConditions)) {
        user.medicalConditions = req.body.medicalConditions;
      } else if (typeof req.body.medicalConditions === 'string') {
        user.medicalConditions = [req.body.medicalConditions];
      }
    }

    if (req.body.injuries !== undefined) {
      if (Array.isArray(req.body.injuries)) {
        user.injuries = req.body.injuries;
      } else if (typeof req.body.injuries === 'string') {
        user.injuries = [req.body.injuries];
      }
    }

    if (req.body.weight !== undefined && Number(req.body.weight) !== Number(oldWeight)) {
      try {
        await UserLog.create({
          user: user._id,
          status: 'note',
          notes: 'Weight updated via profile',
          weight: Number(req.body.weight)
        });
      } catch (err) {
        console.error("Error creating UserLog on weight update:", err);
      }
    }

    // --- DIRECT MONGODB IMAGE SAVING ---
    // If a file was uploaded, convert it from memory buffer to Base64 String
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.profileImage = base64Image; // Save the raw text string directly to the DB!
    }

    const updatedUser = await user.save();

    // Trigger plan regeneration if key fields change
    const planTriggerFields = ['height', 'weight', 'age', 'gender', 'goal', 'experience', 'activityLevel', 'dietType', 'medicalConditions', 'injuries', 'noOnion', 'noGarlic', 'glutenFree', 'lactoseFree', 'nutAllergy', 'sugarFree'];
    const shouldRefreshPlans = planTriggerFields.some(field => String(oldValues[field] || '') !== String(updatedUser[field] || ''));
    if (shouldRefreshPlans) {
      try {
        await regenerateUserPlans(updatedUser);
      } catch (planError) {
        console.error('Plan regeneration failed after profile update:', planError);
      }
    }

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
        activityLevel: updatedUser.activityLevel,
        dietType: updatedUser.dietType,
        bio: updatedUser.bio,
        medicalConditions: updatedUser.medicalConditions || ["Regular"],
        injuries: updatedUser.injuries || ["Regular"],
        difficulty_coefficient: updatedUser.difficulty_coefficient,
        noOnion: updatedUser.noOnion,
        noGarlic: updatedUser.noGarlic,
        glutenFree: updatedUser.glutenFree,
        lactoseFree: updatedUser.lactoseFree,
        nutAllergy: updatedUser.nutAllergy,
        sugarFree: updatedUser.sugarFree
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
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isMatch = await bcrypt.compare(currentPassword, user.password);
    
    // Fallback for old plain-text passwords
    if (!isMatch && currentPassword === user.password) {
      isMatch = true;
    }

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
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    
    // Fallback for old plain-text passwords
    if (!isMatch && password === user.password) {
      isMatch = true;
    }

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