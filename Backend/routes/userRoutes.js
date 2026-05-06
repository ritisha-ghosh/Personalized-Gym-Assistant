const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getUserProfile, // Now imported from userController
  updateUserProfile, 
  updateUserSettings,
  updatePassword,
  deleteAccount
} = require("../controllers/userController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

// All routes are protected
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile); // New route for name/email updates
router.put("/update-profile", authMiddleware, upload.single('profileImage'), updateUserProfile);
router.put("/update-settings", authMiddleware, updateUserSettings);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;
