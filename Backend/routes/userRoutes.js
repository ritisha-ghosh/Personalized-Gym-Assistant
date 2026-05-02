const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getUserProfile, 
  updateUserProfile, 
  updateUserSettings,
  updatePassword,
  deleteAccount
} = require("../controllers/userController");

const router = express.Router();

// All routes are protected
router.get("/profile", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateUserProfile);
router.put("/update-settings", authMiddleware, updateUserSettings);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;
