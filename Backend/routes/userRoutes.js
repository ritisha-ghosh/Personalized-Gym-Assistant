const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getUserProfile, 
  updateUserProfile, 
  updateUserSettings,
  updatePassword,
  deleteAccount,
  deleteProfileImage
} = require("../controllers/userController");

// Use Memory Storage instead of Disk Storage! No more 'uploads' folder.
const storage = multer.memoryStorage();

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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

// All routes are protected
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, upload.single('profileImage'), updateUserProfile);
router.put("/update-settings", authMiddleware, updateUserSettings);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);
router.delete("/delete-profile-image", authMiddleware, deleteProfileImage);

module.exports = router;