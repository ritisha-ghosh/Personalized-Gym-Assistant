const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { regenerateUserPlans } = require("../services/userPlanService");
console.log("AUTH CONTROLLER LOADED");

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    // Support both direct object and nested 'userData' object payloads
    const data = req.body.userData || req.body;
    const { email } = data;

    const {
      name,
      password,
      age,
      weight,
      gender,
      height,
      fitnessGoal, // mapped from frontend payload
      goal,
      medicalConditions,
      injuries,
      experience,
      activityLevel,
      dietType,
      noOnion,
      noGarlic,
      glutenFree,
      lactoseFree,
      nutAllergy,
      sugarFree
    } = data;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, password required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 🔐 Normalize inputs (CRITICAL FIX - Added fallbacks to map to strict schema)
    let normalizedGoal = (fitnessGoal || goal)?.toLowerCase().trim();
    if (normalizedGoal === 'weight loss') normalizedGoal = 'fat loss';
    if (normalizedGoal === 'endurance') normalizedGoal = 'maintenance';

    const normalizedExperience = experience?.toLowerCase().trim();
    
    let normalizedDietType = dietType?.toLowerCase().trim();
    if (!normalizedDietType) {
      normalizedDietType = undefined;
    } else if (['standard', 'pescatarian'].includes(normalizedDietType)) {
      normalizedDietType = 'non-vegetarian';
    } else if (normalizedDietType === 'eggetarian') {
      // Eggetarian is treated as vegetarian for meal templates (allows eggs)
      normalizedDietType = 'vegetarian';
    } else if (normalizedDietType === 'vegan') {
      normalizedDietType = 'vegan';
    } else if (normalizedDietType && normalizedDietType.includes('non')) {
      normalizedDietType = 'non-vegetarian';
    } else if (normalizedDietType && normalizedDietType.includes('veget')) {
      normalizedDietType = 'vegetarian';
    }
    let normalizedActivityLevel = activityLevel?.toLowerCase().trim();
    if (normalizedActivityLevel === 'very_active') normalizedActivityLevel = 'active';
    if (!['sedentary', 'light', 'moderate', 'active'].includes(normalizedActivityLevel)) {
      normalizedActivityLevel = 'moderate';
    }
    const normalizedGender = gender?.toLowerCase().trim();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      age,
      weight,
      height,

      gender: normalizedGender,
      goal: normalizedGoal,
      medicalConditions: Array.isArray(medicalConditions) ? medicalConditions : (medicalConditions ? [medicalConditions] : ["Regular"]),
      injuries: Array.isArray(injuries) ? injuries : (injuries ? [injuries] : ["Regular"]),

      experience: normalizedExperience,

      activityLevel: normalizedActivityLevel,
      dietType: normalizedDietType || "vegetarian",
      noOnion: noOnion ?? false,
      noGarlic: noGarlic ?? false,
      glutenFree: glutenFree ?? false,
      lactoseFree: lactoseFree ?? false,
      nutAllergy: nutAllergy ?? false,
      sugarFree: sugarFree ?? false
    });

    // FIX: Added token generation which was missing for successful registration.
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in DB
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Signup error:", error);

    // Better validation error response
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // FIX applied: added .select('+password') to retrieve hashed password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 🔒 Store refresh token in DB safely (Avoids crashing on old test accounts)
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

    res.json({
      success: true,
      message: "Login successful",
      token: accessToken, // for backward compatibility with frontend
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: refreshToken
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.json({
      accessToken: newAccessToken
    });

  } catch (error) {
    return res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};
console.log("EXPORT CHECK:", {
  register: typeof exports.register,
  login: typeof exports.login
});

// 🔹 FIX: Map signup to register so the frontend `/auth/signup` endpoint connects successfully
exports.signup = exports.register;