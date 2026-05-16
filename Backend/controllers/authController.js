const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const dns = require("dns"); // Removed dns module as it caused certificate validation issues

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

// In-memory store for pending verifications.
// For production, it's better to use Redis or a DB collection with a TTL index.
const pendingUsers = {};
const passwordResetTokens = {}; // New in-memory store for password reset OTPs

// --- Nodemailer Setup ---
// It will use the credentials from your .env file
let transporter;

// Function to initialize transporter after DNS lookup
async function initializeTransporter() {
  if (transporter) return; // Already initialized

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use 'true' for port 465, 'false' for other ports like 587 (STARTTLS)
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: {
      // WARNING: This should be set to 'true' in production environments.
      // Setting to 'false' bypasses certificate validation and can be a security risk.
      // It's used here to debug 'ERR_TLS_CERT_ALTNAME_INVALID' issues often caused by local network/firewall/VPN.
      rejectUnauthorized: false, 
    },
  });

  // Verify connection configuration
  await transporter.verify();
  console.log("Nodemailer transporter is ready to send emails.");

}

/**
 * @desc    Sends an OTP to the user's email to begin registration.
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
exports.sendOtpForSignup = async (req, res) => {
  try {
    // Ensure transporter is initialized before use
    await initializeTransporter();

    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store user data and OTP temporarily
    pendingUsers[email] = {
      data: req.body,
      otp: otp,
      expires: expires,
    };

    // --- DEBUG LOGGING: Check Nodemailer config before sending ---
    console.log("Nodemailer config for sending OTP:", {
      host: transporter.options.host, // Use the actual host Nodemailer is using
      port: transporter.options.port, // Use the actual port Nodemailer is using
      user: transporter.options.auth.user, // Use the actual user Nodemailer is using
      pass: process.env.EMAIL_PASS ? '********' : 'NOT_SET' // Mask password for security
    });
    // Send email
    await transporter.sendMail({
      from: `"Personalized Gym Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your One-Time Password is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your One-Time Password is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to your email successfully." });

  } catch (error) {
    console.error("Send OTP error:", error.message, error.stack); // Enhanced logging
    if (error.code === 'EAUTH') {
        return res.status(500).json({ message: "Email server authentication failed. Please check your EMAIL_USER and EMAIL_PASS in .env. For Gmail, ensure you're using an App Password." });
    }
    if (error.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
        return res.status(500).json({ message: "Server error while sending OTP: TLS certificate validation failed. This is often due to local network interference (firewall, VPN, proxy) or a misconfigured system. We've temporarily disabled strict validation for debugging. If this persists, check your local network settings." });
    }
    if (error.code === 'ECONNREFUSED' && error.address === '127.0.0.1') {
        return res.status(500).json({ message: "Server error while sending OTP: Connection refused by localhost. This usually means 'smtp.gmail.com' is resolving to '127.0.0.1' on your system. Please check your system's DNS settings, hosts file, or VPN/proxy configuration." });
    }
    res.status(500).json({ message: "Server error while sending OTP. Please check backend logs for details and ensure your email configuration in .env is correct." });
  }
};

/**
 * @desc    Verifies the OTP and creates the new user.
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = pendingUsers[email];

    // Validations
    if (!pending) {
      return res.status(400).json({ message: "Invalid request or OTP expired. Please register again." });
    }
    if (Date.now() > pending.expires) {
      delete pendingUsers[email];
      return res.status(400).json({ message: "OTP has expired. Please try registering again." });
    }
    if (pending.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is correct, create user
    const userData = pending.data;

    // --- Normalization from original signup function ---
    let normalizedGoal = userData.goal?.toLowerCase().trim();
    if (normalizedGoal === 'weight loss') normalizedGoal = 'fat loss';
    if (normalizedGoal === 'endurance') normalizedGoal = 'maintenance';

    const normalizedExperience = userData.experience?.toLowerCase().trim();

    let normalizedDietType = userData.dietType?.toLowerCase().trim();
    if (['standard', 'pescatarian', 'eggetarian'].includes(normalizedDietType)) {
      normalizedDietType = 'non-vegetarian';
    } else if (normalizedDietType === 'vegan') {
      normalizedDietType = 'vegetarian';
    }

    const normalizedGender = userData.gender?.toLowerCase().trim();
    // --- End Normalization ---

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
      goal: normalizedGoal,
      experience: normalizedExperience,
      dietType: normalizedDietType,
      gender: normalizedGender,
    });

    await newUser.save();

    // Clean up the temporary store
    delete pendingUsers[email];

    res.status(201).json({ message: "User registered successfully. Please log in." });

  } catch (error) {
    console.error("Verify OTP error:", error);
    if (error.code === 11000) { // Mongoose duplicate key error
      return res.status(400).json({ message: "User with this email already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * @desc    Sends an OTP to the user's email for password reset.
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.sendOtpForPasswordReset = async (req, res) => {
  try {
    // Ensure transporter is initialized before use
    await initializeTransporter();

    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store OTP temporarily
    passwordResetTokens[email] = {
      otp: otp,
      expires: expires,
    };

    // Send email
    await transporter.sendMail({
      from: `"BeFit - Personalized Gym Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your One-Time Password for password reset is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your One-Time Password for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "Password reset OTP sent to your email successfully." });

  } catch (error) {
    console.error("Send OTP for password reset error:", error.message, error.stack);
    if (error.code === 'EAUTH') {
        return res.status(500).json({ message: "Email server authentication failed. Please check your EMAIL_USER and EMAIL_PASS in .env. For Gmail, ensure you're using an App Password." });
    }
    if (error.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
        return res.status(500).json({ message: "Server error while sending OTP: TLS certificate validation failed. This is often due to local network interference (firewall, VPN, proxy) or a misconfigured system. We've temporarily disabled strict validation for debugging. If this persists, check your local network settings." });
    }
    res.status(500).json({ message: "Server error while sending password reset OTP. Please check backend logs for details and ensure your email configuration in .env is correct." });
  }
};

/**
 * @desc    Resets the user's password after OTP verification.
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const resetToken = passwordResetTokens[email];

    if (!resetToken || resetToken.otp !== otp || Date.now() > resetToken.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    delete passwordResetTokens[email]; // Clear the used OTP

    res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
};

// The old exports.signup function has been removed as it's replaced by the OTP flow.

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Case-insensitive email search to support old users
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') }).select('+password');
    
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    
    // Fallback for old test accounts saved with plain-text passwords
    if (!isMatch && password === user.password) {
      isMatch = true;
      
      // Automatically upgrade their password to a secure hash for future logins
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
    }

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
        noGarlic: user.noGarlic,
        glutenFree: user.glutenFree,
        lactoseFree: user.lactoseFree,
        nutAllergy: user.nutAllergy,
        sugarFree: user.sugarFree
      }
    });

  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};