const express = require("express");
const router = express.Router();

const { getDietStats } = require("../controllers/dietControllers");
const authMiddleware = require("../middleware/authMiddleware");



// Protected route
router.get("/calculate", authMiddleware, getDietStats);

module.exports = router;