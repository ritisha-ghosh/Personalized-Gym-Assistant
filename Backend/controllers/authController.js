const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../models/sendEmail");
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

const getHtmlTemplate = (title, otp) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #0f766e; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">BeFit</h1>
        <p style="color: #e0f2f1; margin: 5px 0 0 0; font-size: 16px;">Gym & Fitness Assistant</p>
      </div>
      <div style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #333333; font-size: 22px; margin-top: 0;">${title}</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Please use the verification code below to complete your secure action. This code is valid for <strong>5 minutes</strong>.
        </p>
        <div style="margin: 30px auto; background-color: #f8f9fa; border: 2px dashed #0f766e; border-radius: 8px; padding: 20px; max-width: 300px;">
          <h1 style="color: #0f766e; font-size: 32px; letter-spacing: 6px; margin: 0; font-weight: bold;">${otp}</h1>
        </div>
        <p style="color: #999999; font-size: 14px; margin-top: 30px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
          &copy; 2025 - ${new Date().getFullYear()} BeFit : Gym & Fitness. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`;

exports.sendOtpForSignup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP (replaces if they click resend)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );
    
    await sendEmail({
      email,
      subject: 'Your BeFit Registration Code',
      message: `Your verification code is : ${otp}. It will expire in 5 minutes.`,
      html: getHtmlTemplate('Verify Your Email Address', otp)
    });

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp, userData } = req.body;
    
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const {
      name,
      password,
      age,
      weight,
      gender,
      height,
      fitnessGoal, // mapped from frontend payload
      goal,
      injuryStatus, // mapped from frontend payload
      injury,
      experience,
      activityLevel,
      dietType,
      noOnion,
      noGarlic
    } = userData;

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
    if (['standard', 'pescatarian', 'eggetarian'].includes(normalizedDietType)) {
        normalizedDietType = 'non-vegetarian';
    } else if (normalizedDietType === 'vegan') {
        normalizedDietType = 'vegetarian';
    }
    let normalizedActivityLevel = activityLevel?.toLowerCase().trim();
    if (!['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(normalizedActivityLevel)) {
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
      injury: injuryStatus || injury,

      experience: normalizedExperience,

      activityLevel: normalizedActivityLevel,
      dietType: normalizedDietType || "vegetarian",
      noOnion: noOnion ?? false,
      noGarlic: noGarlic ?? false
    });

<<<<<<< HEAD
    await Otp.deleteOne({ email }); // Clear the OTP upon successful usage

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });
=======
    try {
      await regenerateUserPlans(user);
    } catch (planError) {
      console.error("Plan generation failed during signup:", planError);
    }
>>>>>>> 9e01a854b00c675904c5776f718f6fcf52c99b56

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

    // Check for Two-Factor Verification
    if (user.isTwoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.findOneAndUpdate({ email }, { otp, createdAt: Date.now() }, { upsert: true, new: true });
      
      await sendEmail({
        email,
        subject: 'BeFit Security Alert: Login Verification',
        message: `Your login verification code is : ${otp}. It will expire in 5 minutes.`,
        html: getHtmlTemplate('Two-Step Login Verification', otp)
      });
      
      return res.status(200).json({ success: true, requires2FA: true, message: 'OTP sent to email', email: user.email });
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

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email });
    
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    await Otp.deleteOne({ email });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

    res.status(200).json({ success: true, message: 'Login successful', token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

exports.sendOtpForPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate({ email }, { otp, createdAt: Date.now() }, { upsert: true, new: true });

    await sendEmail({
      email,
      subject: 'Password Reset Verification Code',
      message: `Your password reset code is : ${otp}. It will expire in 5 minutes.`,
      html: getHtmlTemplate('Reset Your Password', otp)
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteOne({ email });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
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
  sendOtpForSignup: typeof exports.sendOtpForSignup,
  login: typeof exports.login
});