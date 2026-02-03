const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const dietRoutes = require("./routes/dietRouts");
const dietPlanRoutes = require("./routes/dietPlanRoutes");
const logRoutes = require("./routes/logRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);
// DIET ROUTES
app.use("/api/diet", dietRoutes);
// DIET PLAN ROUTES
app.use("/api/diet-plan", dietPlanRoutes);
// Chat Route
app.use("/api/chat", chatRoutes);
// LOG ROUTES
app.use("/api/logs", logRoutes);
// WORKOUT ROUTES
app.use("/api/workouts", workoutRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
