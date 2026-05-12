const axios = require("axios");
const User = require("../models/User");
const UserDietTracking = require("../models/UserDietTracking");

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:5001";

// Helper to format date as YYYY-MM-DD (using LOCAL date, not UTC)
const getFormattedDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeeklyPlan = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Request weekly plan from ML layer
    const mlResponse = await axios.post(`${ML_API_URL}/diet-recommendation`, {
      dietType: user.dietType || "vegetarian",
      noOnion: user.noOnion || false,
      noGarlic: user.noGarlic || false,
      glutenFree: user.glutenFree || false
    });

    const weeklyPlan = mlResponse.data.weekly_plan || [];

    // Map actual real dates to the weekly plan
    const today = new Date();
    const resultPlan = weeklyPlan.map((dayData, index) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + index); // Day 0 is today
      return {
        ...dayData,
        date: getFormattedDate(targetDate),
        isToday: index === 0,
      };
    });

    // Fetch tracking data for these dates
    const dates = resultPlan.map((p) => p.date);
    const trackingData = await UserDietTracking.find({
      userId: user._id,
      date: { $in: dates }
    });

    // Merge tracking status into the plan
    const finalPlan = resultPlan.map((plan) => {
      const tracking = trackingData.find((t) => t.date === plan.date);
      const meals = plan.meals.map((meal) => ({
        ...meal,
        status: tracking && tracking.completedMeals.includes(meal.type) ? "done" : "pending"
      }));
      return {
        ...plan,
        meals,
        notes: tracking ? tracking.notes : []
      };
    });

    res.status(200).json({ status: "success", plan: finalPlan });
  } catch (error) {
    console.error("Error fetching weekly diet plan:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const toggleMealCompletion = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { date, mealType } = req.body;
    if (!date || !mealType) {
      return res.status(400).json({ message: "Date and mealType are required" });
    }

    let tracking = await UserDietTracking.findOne({ userId, date });
    if (!tracking) {
      tracking = new UserDietTracking({ userId, date, completedMeals: [], notes: [] });
    }

    const index = tracking.completedMeals.indexOf(mealType);
    if (index > -1) {
      // Uncheck
      tracking.completedMeals.splice(index, 1);
    } else {
      // Check
      tracking.completedMeals.push(mealType);
    }

    await tracking.save();
    res.status(200).json({ status: "success", completedMeals: tracking.completedMeals });
  } catch (error) {
    console.error("Error toggling meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addDietNote = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { date, note } = req.body;
    if (!date || !note) {
      return res.status(400).json({ message: "Date and note are required" });
    }

    let tracking = await UserDietTracking.findOne({ userId, date });
    if (!tracking) {
      tracking = new UserDietTracking({ userId, date, completedMeals: [], notes: [] });
    }

    tracking.notes.push({ text: note, time: new Date() });
    await tracking.save();
    
    console.log(`Saved note for user ${userId} on date ${date}`);

    res.status(200).json({ status: "success", note: tracking.notes[tracking.notes.length - 1] });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const trackings = await UserDietTracking.find({ userId }).sort({ date: -1 });
    
    let allNotes = [];
    trackings.forEach(t => {
      if (t.notes && t.notes.length > 0) {
        t.notes.forEach(n => {
          allNotes.push({
            _id: n._id,
            text: n.text,
            time: n.time,
            date: t.date,
            trackingId: t._id
          });
        });
      }
    });
    
    // Sort notes by time descending
    allNotes.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    console.log(`Fetched ${allNotes.length} notes for user ${userId}`);
    res.status(200).json({ status: "success", notes: allNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { noteId } = req.params;
    
    // Find the tracking document that contains this note
    const tracking = await UserDietTracking.findOne({ 
      userId,
      "notes._id": noteId 
    });

    if (!tracking) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Remove the note
    tracking.notes = tracking.notes.filter(n => n._id.toString() !== noteId);
    await tracking.save();

    res.status(200).json({ status: "success", message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getWeeklyPlan,
  toggleMealCompletion,
  addDietNote,
  getAllNotes,
  deleteNote
};
