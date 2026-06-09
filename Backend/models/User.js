const mongoose = require("mongoose");

const rawDiseases = ["High BP", "Low BP", "Diabetes", "Pre Diabetes", "High Cholesterol", "Heart Disease", "Obesity", "Asthma", "Arthritis", "Thyroid", "PCOS", "Fatty Liver", "Kidney Disease", "Depression", "Anxiety", "Migraine", "Cervical Pain", "Sciatica", "Spondylitis", "Insomnia", "Anemia", "Vitamin D Deficiency", "Vitamin B12 Deficiency", "IBS", "Acidity", "Ulcer", "COPD", "Sleep Apnea", "Epilepsy", "Vertigo", "Hyperthyroidism", "Hypothyroidism", "Osteoporosis", "Joint Pain", "Frozen Shoulder", "Tennis Elbow", "Carpal Tunnel", "GERD", "Piles", "Constipation", "Sinusitis", "Allergy", "Bronchitis", "Stress", "PCOD", "Menopause", "Post Pregnancy Weakness", "Weak Immunity", "Muscle Weakness", "Liver Disorder", "Heart Blockage", "High Triglycerides", "Low Stamina", "Underweight", "Overweight"];
const diseasesList = ["Regular", ...rawDiseases.sort()];

const rawInjuries = ["Hand Fracture", "Arm Fracture", "Leg Fracture", "Foot Fracture", "Shoulder Injury", "Elbow Injury", "Wrist Injury", "Knee Pain", "Back Pain", "Neck Injury", "Ankle Injury", "Hip Injury", "Muscle Tear", "ACL Injury", "Hamstring Injury", "Finger Fracture", "Toe Fracture", "Chest Injury", "Spinal Injury", "Ligament Tear", "Meniscus Tear", "Heel Pain", "Calf Injury", "Bicep Tear", "Tricep Injury", "Rotator Cuff Injury", "Groin Injury", "Pelvic Injury", "Tailbone Pain", "Shin Splints", "Dislocated Shoulder", "Dislocated Knee", "Nerve Injury", "Sciatic Injury", "Whiplash", "Jaw Injury", "Rib Fracture", "Skull Injury", "Eye Injury", "Burn Injury", "Sprained Wrist", "Sprained Ankle", "Pulled Muscle", "Tendon Injury", "Lower Back Strain", "Upper Back Strain", "Patella Injury", "Quad Injury", "Achilles Injury", "Fractured Collarbone", "Frozen Joint", "Hip Flexor Injury", "IT Band Syndrome", "Stress Fracture"];
const injuriesList = ["Regular", ...rawInjuries.sort()];

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  refreshToken: {
    type: String
  },

  // -------------------------
  // 🧬 BIOLOGICAL DATA
  // -------------------------

  age: {
    type: Number,
    min: 10,
    max: 100
  },

  weight: {
    type: Number,
    min: 30,
    max: 300
  },

  height: {
    type: Number,
    min: 100,
    max: 250
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    lowercase: true
  },

  // ✅ FIXED (lowercase, matches calculator)
  goal: {
    type: String,
    enum: ["muscle gain", "fat loss", "maintenance"],
    lowercase: true,
    trim: true
  },
  
  injuries: {
    type: [{
      type: String,
      enum: injuriesList
    }],
    default: ["Regular"]
  },
  
  injuryStatus: {
  type: {
    type: String,
    enum: injuriesList,
    default: "Regular"
  },
  severity: {
    type: String,
    enum: ["mild", "moderate", "severe"],
    default: null
  },
  phase: {
    type: String,
    enum: ["acute", "recovery", "rehab"],
    default: null
  }
},
  medicalConditions: {
    type: [{
      type: String,
      enum: diseasesList
    }],
    default: ["Regular"]
  },

  //For current recovery state
  medicalState: {
    type: String,
    enum: [
      "healthy",
      "acute injury",
      "returning from injury"
    ],
    default: "healthy"
  },

  // 🔹 ADDED FOR WEEK 9 AUTONOMOUS FEEDBACK LOOP
  difficulty_coefficient: {
    type: Number,
    default: 1.0
  },

  experience: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    lowercase: true
  },

  // -------------------------
  // 🍽️ DIET PREFERENCES
  // -------------------------

  dietType: {
    type: String,
    enum: ["vegetarian", "non-vegetarian"],
    default: "vegetarian",
    lowercase: true
  },

  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active"],
    default: "moderate",
    lowercase: true,
    trim: true
  },

  noOnion: {
    type: Boolean,
    default: false
  },

  noGarlic: {
    type: Boolean,
    default: false
  },

  glutenFree: {
    type: Boolean,
    default: false
  },

  lactoseFree: {
    type: Boolean,
    default: false
  },

  nutAllergy: {
    type: Boolean,
    default: false
  },

  sugarFree: {
    type: Boolean,
    default: false
  },

  // -------------------------
  // 👤 PROFILE DATA
  // -------------------------

  bio: {
    type: String,
    default: ""
  },

  profileImage: {
    type: String,
    default: null
  }

}, 
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);