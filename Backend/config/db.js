const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20, // allows multiple concurrent DB operations
      serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
      socketTimeoutMS: 45000 // prevents sudden socket drops
    });

    console.log("MongoDB connected");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Attempting reconnection...");
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
