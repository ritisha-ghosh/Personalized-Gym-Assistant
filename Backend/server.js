const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load env vars from .env file
// This MUST be at the very top, before any other code tries to access process.env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS for all routes
// This allows your frontend (running on a different port) to make requests to the backend.
app.use(cors());

// Body Parser Middleware to accept JSON
app.use(express.json());

// --- Define and Mount Your API Routes ---
// Your frontend `api.js` is configured to make requests to `/api/*`
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);