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
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body Parser Middleware (Improvement #1 added here)
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/diet-plan", dietPlanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/workouts", workoutRoutes);

// Global error protection (Improvement #2 added here)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
