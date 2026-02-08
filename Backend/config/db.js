const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The process.env.MONGO_URI will be read from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;