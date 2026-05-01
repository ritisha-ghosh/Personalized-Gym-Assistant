const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const dietRoutes = require("./routes/dietRouts");
const dietPlanRoutes = require("./routes/dietPlanRoutes");
const logRoutes = require("./routes/logRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

// Load env
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/* ---------------------------
   Security Middleware
---------------------------- */
app.use(helmet());

/* ---------------------------
   CORS
---------------------------- */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

/* ---------------------------
   Body Parser
---------------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------------------
   Health Route
---------------------------- */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gym Assistant API running"
  });
});

/* ---------------------------
   API Versioning (Week 8)
---------------------------- */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/diet", dietRoutes);
app.use("/api/v1/diet-plan", dietPlanRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/workouts", workoutRoutes);

/* ---------------------------
   404 Handler
---------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ---------------------------
   Global Error Protection
---------------------------- */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

/* ---------------------------
   Start Server
---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});