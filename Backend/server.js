const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const dietRoutes = require("./routes/dietRouts");
const dietPlanRoutes = require("./routes/dietPlanRoutes");
const dietTrackingRoutes = require("./routes/dietTrackingRoutes");
const logRoutes = require("./routes/logRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

dotenv.config();
connectDB();

const app = express();

/* Security */
app.use(helmet());

/* CORS */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

/* Body Parser */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* Health Route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gym Assistant API running"
  });
});

/* OLD ROUTES (Stable) */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/diet-plan", dietPlanRoutes);
app.use("/api/diet-tracking", dietTrackingRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/workouts", workoutRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* Error Protection */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});