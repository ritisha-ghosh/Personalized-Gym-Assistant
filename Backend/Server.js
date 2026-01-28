const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// LOG ROUTES
app.use("/api/logs", require("./routes/logRoutes"));

// WORKOUT ROUTES
app.use("/api/workouts", require("./routes/workoutRoutes"));


// DEBUG
console.log("🔥 Loading auth routes...");
const authRoutes = require("./routes/authRoutes");
console.log("🔥 Auth routes loaded:", authRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
