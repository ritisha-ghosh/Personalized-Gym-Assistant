const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dietRoutes = require("./routes/dietRouts");
const dietPlanRoutes = require("./routes/dietPlanRoutes");
const logRoutes = require("./routes/logRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

// Load env vars from .env file
// This MUST be at the very top, before any other code tries to access process.env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS for all routes
// This allows your frontend (running on a different port) to make requests to the backend.
app.use(cors({
  origin: 'http://localhost:5173', // Allow your Frontend URL (Vite default is 5173)
  credentials: true
}));

// Body Parser Middleware to accept JSON
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