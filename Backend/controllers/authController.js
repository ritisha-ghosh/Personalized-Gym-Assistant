const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// exports.signup = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       age,
//       weight,
//       gender,
//       height,
//       goal,
//       injury,
//       experience,
//       dietType,
//       noOnion,
//       noGarlic
//     } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email, password required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       age,
//       weight,
//       height,
//       gender,
//       goal,
//       injury,
//       experience,
//       dietType,
//       noOnion,
//       noGarlic
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       userId: user._id
//     });

//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      weight,
      gender,
      height,
      goal,
      injury,
      experience,
      dietType,
      noOnion,
      noGarlic
    } = req.body;

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
    let normalizedGoal = goal?.toLowerCase().trim();
    if (normalizedGoal === 'weight loss') normalizedGoal = 'fat loss';
    if (normalizedGoal === 'endurance') normalizedGoal = 'maintenance';

    const normalizedExperience = experience?.toLowerCase().trim();
    
    let normalizedDietType = dietType?.toLowerCase().trim();
    if (['standard', 'pescatarian', 'eggetarian'].includes(normalizedDietType)) {
        normalizedDietType = 'non-vegetarian';
    } else if (normalizedDietType === 'vegan') {
        normalizedDietType = 'vegetarian';
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
      injury,

      experience: normalizedExperience,

      dietType: normalizedDietType || "vegetarian",
      noOnion: noOnion ?? false,
      noGarlic: noGarlic ?? false
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
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
      message: "Login successful",
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

// Get current user profile (protected route)
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        profileImage: user.profileImage,
        bio: user.bio,
        injury: user.injury,
        experience: user.experience,
        dietType: user.dietType,
        noOnion: user.noOnion,
        noGarlic: user.noGarlic
      }
    });

  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};