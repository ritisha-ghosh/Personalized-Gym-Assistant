const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getWeeklyPlan, toggleMealCompletion, addDietNote, getAllNotes, deleteNote } = require("../controllers/dietTrackingController");

router.get("/weekly-plan", authMiddleware, getWeeklyPlan);
router.post("/toggle-meal", authMiddleware, toggleMealCompletion);
router.post("/add-note", authMiddleware, addDietNote);
router.get("/notes", authMiddleware, getAllNotes);
router.delete("/notes/:noteId", authMiddleware, deleteNote);

module.exports = router;
