from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import joblib
import pandas as pd
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ── CORS CONFIG ────────────────────────────────────────────────────
# Set ALLOWED_ORIGINS in your .env as a comma-separated list, e.g.
#   ALLOWED_ORIGINS=https://befit-app.com,https://www.befit-app.com
# Leave unset (or "*") to allow all origins, which is fine for local dev
# but should be locked down before this goes to production.
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*")
CORS(app, origins=ALLOWED_ORIGINS.split(",") if ALLOWED_ORIGINS != "*" else "*")

# Initialize Groq Cloud Client with your API Key
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class APIError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__()
        self.message = message
        self.status_code = status_code

@app.errorhandler(APIError)
def handle_api_error(error):
    return jsonify({"status": "error", "message": error.message}), error.status_code

# Global variables for ML models
vectorizer, model, knn_model, df_users, df_diet = None, None, None, None, None
le_level, le_goal = None, None
is_initialized = False

def initialize_ml_engine():
    global vectorizer, model, knn_model, df_users, df_diet
    global le_level, le_goal, is_initialized
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    try:
        vectorizer = joblib.load(os.path.join(BASE_DIR, 'vectorizer.pkl'))
        model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
        knn_model = joblib.load(os.path.join(BASE_DIR, 'knn_model.pkl'))
        df_users = joblib.load(os.path.join(BASE_DIR, 'df_users.pkl'))
        df_diet = pd.read_csv(os.path.join(BASE_DIR, 'diet_dataset.csv'), encoding='latin1')

        # Load encoders to ensure exact dataset mapping
        le_level_path = os.path.join(BASE_DIR, 'le_level.pkl')
        le_goal_path = os.path.join(BASE_DIR, 'le_goal.pkl')
        if os.path.exists(le_level_path) and os.path.exists(le_goal_path):
            le_level = joblib.load(le_level_path)
            le_goal = joblib.load(le_goal_path)

        print(f"✅ Enterprise ML Engine Online. Dataset loaded: {len(df_users)} rows.")
        is_initialized = True
    except Exception as e:
        print(f"🔴 ML Engine Initialization Error: {str(e)}")

@app.before_request
def ensure_initialized():
    if not is_initialized:
        initialize_ml_engine()

# =====================================================================
# 🔹 SAFE FIELD PARSING HELPERS
# =====================================================================
# Centralized so every route handles missing keys AND explicit nulls
# (e.g. {"disease": null} from a cleared JS form field) the same way.

def safe_str(val, default="none"):
    """Coerce a possibly-None/empty value to a trimmed lowercase-safe string."""
    if val is None:
        return default
    val = str(val).strip()
    return val if val else default

def safe_float(val, default):
    """Coerce a possibly-None/invalid value to float, falling back to default."""
    try:
        if val is None or str(val).strip() == "":
            return float(default)
        return float(val)
    except (TypeError, ValueError):
        return float(default)

def get_field(data, user_obj, key, default=None):
    """Look in the top-level payload first, then the nested user object."""
    val = data.get(key)
    if val is None:
        val = user_obj.get(key)
    return val if val is not None else default

# =====================================================================
# 🔹 THE MEDICAL KNOWLEDGE GRAPH — ZONE-BASED INJURY ENGINE
# =====================================================================

ZONE_KEYWORDS = {
    "hand": ["wrist", "hand", "carpal", "finger", "thumb", "metacarpal"],
    "arm_shoulder": ["shoulder", "rotator cuff", "frozen joint", "clavicle", "deltoid",
                      "elbow", "tennis elbow", "bicep", "tricep", "arm", "fracture"],
    "spine": ["back", "spine", "disc", "sciatica", "tailbone", "cervical", "lumbar",
              "neck", "whiplash"],
    "lower_body": ["knee", "acl", "patella", "meniscus", "leg", "ankle", "foot", "calf",
                    "hamstring", "quad", "hip", "achilles", "shin", "thigh"],
    "core": ["hernia", "groin", "pelvic", "abdomen", "abdominal"],
    "cardio_metabolic": ["hypertension", "high bp", "blood pressure", "heart", "diabetes",
                          "pro diabetes", "insulin", "asthma", "bronchitis", "copd",
                          "sleep apnea", "breathing", "osteoporosis", "arthritis",
                          "joint pain", "rheumatoid", "depression", "anxiety", "stress",
                          "insomnia", "fatigue", "low stamina", "anemia"],
}

MOVEMENT_BLOCKING_ZONES = {"hand", "arm_shoulder", "spine", "lower_body", "core"}

INTENSITY_PROTOCOLS = {
    ("asthma", "bronchitis", "sleep apnea", "copd", "breathing"):
        "Respiratory Protocol: High-intensity cardio replaced with LISS (Low-Intensity Steady State) to manage oxygen thresholds.",
    ("hypertension", "high bp", "blood pressure", "heart"):
        "Blood Pressure Protocol: Heavy isometric holds and Valsalva maneuvers removed to prevent dangerous BP spikes.",
    ("diabetes", "pro diabetes", "insulin"):
        "Diabetic Training Protocol: Prolonged intense endurance blocked to prevent hypoglycemia. Moderate hypertrophy focus.",
    ("osteoporosis", "arthritis", "joint pain", "rheumatoid"):
        "Joint Preservation Protocol: Plyometrics and heavy impact jumping replaced with low-impact time-under-tension movements.",
    ("depression", "anxiety", "stress", "insomnia", "fatigue", "low stamina", "anemia"):
        "CNS Recovery Protocol: Volume reduced by 15%. Focus on endorphin-release pacing rather than central nervous system exhaustion.",
}

DIET_PROTOCOLS = {
    ("diabetes", "pro diabetes", "pcos", "pcod", "insulin"): "Metabolic Protocol: Strict Low-Glycemic Index carbohydrates. Added sugars and refined carbs entirely restricted to control insulin spikes.",
    ("hypertension", "high bp", "high cholesterol", "fatty liver", "high triglycerides", "heart"): "Cardiovascular Protocol: Sodium strictly limited to <1500mg/day. Saturated fats replaced with Omega-3s and high-fiber grains.",
    ("gerd", "acidity", "ulcer", "ibs", "piles", "liver disorder", "gastric"): "Gastrointestinal Protocol: Acidic, highly spiced, and heavily processed foods removed. Easily digestible proteins prioritized.",
    ("osteoporosis", "fracture", "bone", "vitamin d deficiency", "calcium"): "Bone Synthesis Protocol: Dietary calcium and Vitamin D baselines increased by 30% for active recovery.",
    ("anemia", "muscle weakness", "low stamina", "fatigue"): "Iron & Energy Protocol: Iron-dense greens and lean red meats (if non-veg) prioritized alongside Vitamin C for absorption.",
    ("thyroid", "hypothyroidism"): "Thyroid Protocol: Raw goitrogenic vegetables (cabbage, broccoli) and unfermented soy restricted."
}

def detect_injury_zones(disease, injury):
    combined = f"{safe_str(disease)} {safe_str(injury)}".lower()
    zones = set()
    for zone, keywords in ZONE_KEYWORDS.items():
        if any(kw in combined for kw in keywords):
            zones.add(zone)
    return zones, combined

def apply_intensity_protocols(combined_health_string):
    mutations = []
    for keywords, protocol in INTENSITY_PROTOCOLS.items():
        if any(keyword in combined_health_string for keyword in keywords):
            mutations.append(protocol)
    return mutations

# =====================================================================
# 🔹 UNIFIED SAFETY VERDICT — single source of truth
# =====================================================================
# Both /recommend-plan (rules engine) and /predict (chatbot) call this
# so the two surfaces can never disagree about whether a user is under
# a rest lock. Update injury logic ONCE here and both routes stay in sync.

def get_safety_verdict(disease, injury):
    zones, combined_health_string = detect_injury_zones(disease, injury)
    movement_zones = zones & MOVEMENT_BLOCKING_ZONES
    intensity_mutations = apply_intensity_protocols(combined_health_string)

    if len(movement_zones) >= 2:
        lock_level = "multi"
        active_zone = None
    elif len(movement_zones) == 1:
        lock_level = "single"
        active_zone = next(iter(movement_zones))
    else:
        lock_level = "none"
        active_zone = None

    return {
        "zones": zones,
        "movement_zones": movement_zones,
        "intensity_mutations": intensity_mutations,
        "lock_level": lock_level,        # "multi" | "single" | "none"
        "active_zone": active_zone,
        "combined_health_string": combined_health_string,
    }

# =====================================================================
# 🔹 PER-ZONE EXERCISE PATTERNS (SAFE TERMINOLOGY APPLIED)
# =====================================================================

HAND_PATTERNS = [
    (r'(?i)(bench|shoulder|dumbbell|arnold|military|chest|overhead)\s+press', 'Pec Deck Machine (Forearms)'),
    (r'(?i)(decline|incline|diamond|wall)?\s*push[\-\s]?ups?', 'Lying Crunches'),
    (r'(?i)(lat\s+pulldown|pull[\-\s]?ups?|chin[\-\s]?ups?)', 'Lower Back Extensions'),
    (r'(?i)(barbell|dumbbell|cable|t[\-\s]?bar|machine)\s+rows?', 'Superman Holds'),
    (r'(?i)face\s+pulls?', 'Superman Holds'),
    (r'(?i)(bicep\s+|hammer\s+|preacher\s+|concentration\s+|cable\s+)?curls?', 'Core: V-Ups'),
    (r'(?i)(tricep\s+)?pushdowns?', 'Core: Russian Twists'),
    (r'(?i)(ab\s+wheel|rollout)', 'Lying Leg Raises'),
    (r'(?i)planks?', 'Hollow Body Hold'),
    (r'(?i)mountain\s+climbers?', 'Bicycle Crunches'),
    (r'(?i)(deadlifts?|rdl|romanian\s+deadlifts?|sumo\s+deadlifts?)', 'Good Mornings (Bodyweight)'),
    (r'(?i)\bdips?\b', 'Lying Leg Raises'),
    (r'(?i)squats?', 'Bodyweight Wall Sits'),
    (r'(?i)shrugs?', 'Seated Shoulder Rolls'),
    (r'(?i)farmer(\'?s)?\s+walks?', 'Seated Marching'),
    (r'(?i)kettlebell\s+swings?', 'Glute Bridges'),
    (r'(?i)(barbell|dumbbell)\s+lunges?', 'Bodyweight Step-ups (No Load)'),
]

ARM_SHOULDER_PATTERNS = [
    (r'(?i)close[\-\s]grip bench press', 'Machine Chest Contractions'),
    (r'(?i)barbell bench press', 'Machine Chest Contractions'),
    (r'(?i)incline dumbbell press', 'Machine Chest Contractions'),
    (r'(?i)dumbbell chest press', 'Machine Chest Contractions'),
    (r'(?i)bench press', 'Machine Chest Contractions'),
    (r'(?i)overhead shoulder press', 'Resistance Band Front Holds'),
    (r'(?i)seated shoulder press', 'Resistance Band Front Holds'),
    (r'(?i)seated dumbbell press', 'Resistance Band Front Holds'),
    (r'(?i)seated arnold press', 'Resistance Band Front Holds'),
    (r'(?i)arnold press', 'Resistance Band Front Holds'),
    (r'(?i)overhead press', 'Resistance Band Front Holds'),
    (r'(?i)shoulder press', 'Resistance Band Front Holds'),
    (r'(?i)wide[\-\s]grip lat pulldown', 'Cable Lat Depressions'),
    (r'(?i)seated lat pulldown', 'Cable Lat Depressions'),
    (r'(?i)lat pulldown', 'Cable Lat Depressions'),
    (r'(?i)pull[\-\s]ups?', 'Cable Lat Depressions'),
    (r'(?i)bent[\-\s]over barbell row', 'Machine Back Retractions'),
    (r'(?i)incline dumbbell row', 'Machine Back Retractions'),
    (r'(?i)t[\-\s]bar row', 'Machine Back Retractions'),
    (r'(?i)tricep\s+dip', 'Tricep Cable Extensions (Light)'),
    (r'(?i)\bdips\b', 'Tricep Cable Extensions (Light)'),
    (r'(?i)decline push[\-\s]?ups?', 'Wall Incline Extensions'),
    (r'(?i)diamond push[\-\s]?ups?', 'Wall Incline Extensions'),
    (r'(?i)push[\-\s]?ups?', 'Wall Incline Extensions'),
    (r'(?i)(bicep\s+|hammer\s+|preacher\s+|concentration\s+)?curls?', 'Band Arm Flexions'),
    (r'(?i)shrugs?', 'Seated Trap Elevations'),
    (r'(?i)farmer(\'?s)?\s+walks?', 'Brisk Walking (No Load)'),
]

SPINE_PATTERNS = [
    (r'(?i)barbell squats?', 'Machine Leg Extensions'),
    (r'(?i)romanian deadlifts?', 'Lying Leg Curls'),
    (r'(?i)sumo deadlifts?', 'Lying Leg Curls'),
    (r'(?i)deadlifts?', 'Lying Leg Curls'),
    (r'(?i)bent[\-\s]over barbell row', 'Chest-Supported Machine Retractions'),
    (r'(?i)t[\-\s]bar row', 'Chest-Supported Machine Retractions'),
    (r'(?i)burpees?', 'Incline Extensions'),
    (r'(?i)overhead shoulder press', 'Seated Dumbbell Elevations (Back Supported)'),
    (r'(?i)military press', 'Seated Dumbbell Elevations (Back Supported)'),
    (r'(?i)good mornings?', 'Bird-Dog Holds'),
    (r'(?i)hyperextensions?', 'Bird-Dog Holds'),
    (r'(?i)sit[\-\s]?ups?', 'Pelvic Tilts'),
    (r'(?i)crunches', 'Pelvic Tilts'),
]

LOWER_BODY_PATTERNS = [
    (r'(?i)bulgarian split squats?', 'Seated Knee Extensions'),
    (r'(?i)goblet squats?', 'Seated Knee Extensions'),
    (r'(?i)hack squats?', 'Seated Knee Extensions'),
    (r'(?i)front squats?', 'Straight Limb Elevations'),
    (r'(?i)bodyweight squats?', 'Seated Knee Extensions'),
    (r'(?i)squats?', 'Glute Bridges'),
    (r'(?i)romanian deadlifts?', 'Seated Hamstring Curls'),
    (r'(?i)sumo deadlifts?', 'Seated Hamstring Curls'),
    (r'(?i)deadlifts?', 'Seated Hamstring Curls'),
    (r'(?i)walking lunges?', 'Single-Limb Box Elevations'),
    (r'(?i)lunges?', 'Seated Machine Push'),
    (r'(?i)box jumps?', 'Seated Machine Push'),
    (r'(?i)high[\-\s]?knees?', 'Seated Marching'),
    (r'(?i)jumping jacks?', 'Seated Arm Circles'),
    (r'(?i)burpees?', 'Modified Sprawls (Upper Body Only)'),
    (r'(?i)jump rope\s*\d*\w*', 'Seated Heel Elevations (Unaffected Side)'),
    (r'(?i)skipping', 'Seated Heel Elevations (Unaffected Side)'),
    (r'(?i)calf raises?', 'Seated Ankle Pumps'),
    (r'(?i)step[\-\s]?ups?', 'Seated Knee Extensions'),
    (r'(?i)farmer(\'?s)?\s+walks?', 'Standing Overhead Band Elevations (Stationary)'),
]

CORE_PATTERNS = [
    (r'(?i)ab wheel rollout', 'Bird-Dog Holds'),
    (r'(?i)crunches', 'Gentle Planks'),
    (r'(?i)sit[\-\s]?ups?', 'Gentle Planks'),
    (r'(?i)barbell squats?', 'Machine Knee Extensions'),
    (r'(?i)deadlifts?', 'Seated Hamstring Curls'),
    (r'(?i)russian twists?', 'Gentle Planks'),
    (r'(?i)leg raises?', 'Bird-Dog Holds'),
    (r'(?i)hanging\s+leg\s+raises?', 'Bird-Dog Holds'),
    (r'(?i)v-?ups?', 'Gentle Planks'),
    (r'(?i)mountain\s+climbers?', 'Standard Plank'),
]

ZONE_PATTERN_TABLE = {
    "hand": HAND_PATTERNS,
    "arm_shoulder": ARM_SHOULDER_PATTERNS,
    "spine": SPINE_PATTERNS,
    "lower_body": LOWER_BODY_PATTERNS,
    "core": CORE_PATTERNS,
}

ZONE_RISK_KEYWORDS = {
    "hand": ["press", "pull", "curl", "row", "push", "dip", "plank", "grip", "farmer",
             "shrug", "clean", "snatch", "kettlebell", "barbell", "dumbbell", "deadlift", "squat"],
    "arm_shoulder": ["press", "pull", "curl", "row", "push", "dip", "raise", "fly", "shrug"],
    "spine": ["deadlift", "row", "squat", "good morning", "hyperextension"],
    "lower_body": ["squat", "lunge", "deadlift", "jump", "calf", "step", "leg", "sprint", "run", "skip"],
    "core": ["crunch", "sit-up", "sit up", "plank", "rollout", "twist", "leg raise", "v-up"],
}

# 🔹 FIX: Safely Rest the Zone instead of generating a cross-body mismatch
ZONE_SAFE_DEFAULT = {
    "hand": "Rest (Grip/Hand Recovery Protocol)",
    "arm_shoulder": "Rest (Upper Body Recovery Protocol)",
    "spine": "Rest (Spinal Recovery Protocol)",
    "lower_body": "Rest (Lower Body Recovery Protocol)",
    "core": "Rest (Core Recovery Protocol)",
}

REST_LABEL = "Rest & Recovery"
FULL_REST_MULTI_INJURY_LABEL = "Rest & Recovery (Medical Safety Hold)"

# =====================================================================
# 🔹 VOLUME SCRUBBER (Removes 3x8, Sets, Reps on Rest Days)
# =====================================================================
def clean_volume_artifacts(s):
    if not isinstance(s, str):
        return REST_LABEL

    # If the string indicates a complete rest or medical hold
    if any(k in s.lower() for k in ["rest", "recovery", "hold", "protocol"]):
        # Strip numbers and volume syntax: '3x8', '3 x 8', '3*8', '3 Sets', '8 Reps'
        s = re.sub(r'(?i)\b\d+\s*[xX*]\s*\d+\b', '', s)
        s = re.sub(r'(?i)\b\d+\s*(sets?|reps?|mins?|seconds?|minutes?)\b', '', s)

        # Strip random punctuation left behind (like bullet points or dashes)
        s = re.sub(r'[\s\-,\•\|\:\;]+$', '', s)
        s = re.sub(r'^\s*[\s\-,\•\|\:\;]+', '', s)
        s = re.sub(r'\s+', ' ', s).strip()

        if not s or len(s) < 3:
            return REST_LABEL

    return s

def adapt_exercises_single_zone(daily_string, active_zone):
    if not isinstance(daily_string, str):
        return REST_LABEL
    if daily_string.lower().strip() in ("rest", "rest & recovery", REST_LABEL.lower()):
        return daily_string

    s = daily_string

    for pattern, replacement in ZONE_PATTERN_TABLE.get(active_zone, []):
        s = re.sub(pattern, replacement, s)

    risk_terms = ZONE_RISK_KEYWORDS.get(active_zone, [])
    if any(re.search(rf'(?i)\b{re.escape(term)}', s) for term in risk_terms):
        s = ZONE_SAFE_DEFAULT.get(active_zone, REST_LABEL)

    return clean_volume_artifacts(s)

@app.route('/recommend-plan', methods=['POST'])
def recommend_plan():
    data = request.json or {}
    try:
        user_obj = data.get("user", {}) or {}
        age = safe_float(get_field(data, user_obj, 'age'), 22)
        weight = safe_float(get_field(data, user_obj, 'weight'), 70)

        exp_raw = safe_str(get_field(data, user_obj, 'experience'), 'intermediate').title()
        if exp_raw not in ['Beginner', 'Intermediate', 'Advance', 'Advanced']:
            exp_raw = 'Intermediate'
        if exp_raw == 'Advanced':
            exp_raw = 'Advance'

        goal_raw = safe_str(get_field(data, user_obj, 'goal'), 'maintenance').title()
        if 'Loss' in goal_raw or 'Cut' in goal_raw:
            goal_raw = 'Fat Loss'
        elif 'Gain' in goal_raw or 'Bulk' in goal_raw:
            goal_raw = 'Muscle Gain'
        else:
            goal_raw = 'Maintenance'

        if le_level and le_goal:
            try:
                exp = float(le_level.transform([exp_raw])[0])
                goal = float(le_goal.transform([goal_raw])[0])
            except Exception:
                exp, goal = 2.0, 1.0
        else:
            level_map = {"Beginner": 1.0, "Intermediate": 2.0, "Advance": 0.0}
            goal_map = {"Fat Loss": 0.0, "Maintenance": 1.0, "Muscle Gain": 2.0}
            exp = level_map.get(exp_raw, 2.0)
            goal = goal_map.get(goal_raw, 1.0)

        disease = get_field(data, user_obj, 'disease', 'none')
        injury = get_field(data, user_obj, 'injury', 'none')

        target_user = [[age, weight, exp, goal]]
    except Exception as e:
        raise APIError(f"Metrics engine transformation crash: {str(e)}")

    distances, indices = knn_model.kneighbors(target_user)
    idx = indices[0][0]

    if idx >= len(df_users) or idx < 0:
        print(f"⚠️ Warning: KNN index {idx} out of bounds for df_users size {len(df_users)}. Using index 0.")
        idx = 0

    recommended_profile = df_users.iloc[idx]

    verdict = get_safety_verdict(disease, injury)
    movement_zones = verdict["movement_zones"]
    intensity_mutations = verdict["intensity_mutations"]

    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    day_field_map = {
        "Sunday": "Day 1 - Sunday", "Monday": "Day 2 - Monday", "Tuesday": "Day 3 - Tuesday",
        "Wednesday": "Day 4 - Wednesday", "Thursday": "Day 5 - Thursday",
        "Friday": "Day 6 - Friday", "Saturday": "Day 7 - Saturday",
    }

    # ── MULTI-INJURY SAFETY OVERRIDE ─────────────────────────────────
    if verdict["lock_level"] == "multi":
        zone_list = sorted(movement_zones)
        return jsonify({
            "status": "success",
            "message": (
                f"⚠️ Multiple concurrent injuries detected ({', '.join(zone_list)}). "
                "For your safety, active programming has been paused and replaced with a "
                "Full Rest & Recovery Protocol for the entire week."
            ),
            "recommended_cluster_index": str(idx),
            "medical_mutations_applied": intensity_mutations,
            "injury_zones_detected": zone_list,
            "rest_protocol_triggered": True,
            "base_routine": {day: FULL_REST_MULTI_INJURY_LABEL for day in days}
        }), 200

    # ── SINGLE ZONE (OR NONE) — NORMAL / FULL-BLOCK PATH ─────────────
    active_zone = verdict["active_zone"]

    if active_zone:
        base_routine = {
            day: adapt_exercises_single_zone(str(recommended_profile.get(day_field_map[day], 'Rest')), active_zone)
            for day in days
        }
        msg = "Collaborative filtering successful. ⚠️ Medical state detected. Adaptive protocols engaged."
    else:
        base_routine = {
            day: clean_volume_artifacts(str(recommended_profile.get(day_field_map[day], 'Rest')))
            for day in days
        }
        msg = "Collaborative filtering successful."
        if intensity_mutations:
            msg += " ⚠️ Medical state detected. Adaptive protocols engaged."

    return jsonify({
        "status": "success",
        "message": msg,
        "recommended_cluster_index": str(idx),
        "medical_mutations_applied": intensity_mutations,
        "injury_zones_detected": sorted(verdict["zones"]),
        "rest_protocol_triggered": False,
        "base_routine": base_routine
    }), 200

# =================================================
# 🔹 2. MEDICAL DIET ENGINE
# =================================================
@app.route('/diet-recommendation', methods=['POST'])
def diet_recommendation():
    data = request.json or {}
    user_obj = data.get("user", {}) or {}

    diet_type = safe_str(get_field(data, user_obj, 'dietType'), '').lower()
    disease = safe_str(get_field(data, user_obj, 'disease', 'none')).lower()
    injury = safe_str(get_field(data, user_obj, 'injury', 'none')).lower()
    combined_health_string = f"{disease} {injury}"

    filtered = df_diet.copy()
    medical_diet_flags = []

    if "veg" in diet_type and "non" not in diet_type:
        filtered = filtered[filtered['Diet type'].str.contains('Veg', case=False, na=False)]
        filtered = filtered[~filtered['Diet type'].str.contains('Non-Veg', case=False, na=False)]
    elif "non" in diet_type:
        filtered = filtered[filtered['Diet type'].str.contains('Non', case=False, na=False)]

    if disease != 'none':
        disease_match = filtered[filtered['Disease'].str.contains(disease, case=False, na=False)]
        if not disease_match.empty:
            filtered = disease_match

    for keywords, protocol in DIET_PROTOCOLS.items():
        if any(keyword in combined_health_string for keyword in keywords):
            medical_diet_flags.append(protocol)

    if filtered.empty:
        filtered = df_diet

    choice = filtered.sample(1).iloc[0]
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    weekly_plan = []

    for day in days:
        day_meals = [
            {"type": "Breakfast", "food": str(choice.get(f'Breakfast_{day}', 'N/A'))},
            {"type": "Lunch", "food": str(choice.get(f'Lunch_{day}', 'N/A'))},
            {"type": "Pre-Workout", "food": str(choice.get(f'PreWorkout_{day}', 'N/A'))},
            {"type": "Dinner", "food": str(choice.get(f'Dinner_{day}', 'N/A'))}
        ]
        weekly_plan.append({"day": day, "meals": day_meals})

    return jsonify({
        "status": "success",
        "medical_diet_mutations": medical_diet_flags,
        "weekly_plan": weekly_plan
    }), 200

# =================================================
# 🔹 3. AUTONOMOUS FEEDBACK ENGINE
# =================================================
@app.route('/scale-difficulty', methods=['POST'])
def scale_difficulty():
    data = request.json or {}
    avg_difficulty = safe_float(data.get('average_difficulty'), 5)

    if avg_difficulty < 4:
        coefficient = 1.15
        action = "Increase Volume"
    elif avg_difficulty > 7:
        coefficient = 0.85
        action = "Deload Protocol"
    else:
        coefficient = 1.0
        action = "Maintain"

    return jsonify({
        "status": "success",
        "action_taken": action,
        "new_difficulty_coefficient": coefficient,
        "message": f"Autonomous feedback loop adjusted user load coefficient to {coefficient}"
    })

# =================================================
# 🔹 4. SMART CLOUD RAG CHATBOT (GROQ LLAMA 3 ENGINE)
# =================================================
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json or {}
    if not data or 'query' not in data:
        raise APIError("Please provide a search query.")

    raw_input = data.get('query')
    user_obj = data.get('user', {}) or {}

    if isinstance(raw_input, dict):
        user_query = safe_str(raw_input.get('userQuery', ''), '')
    else:
        user_query = safe_str(raw_input, '')

    text_vec = vectorizer.transform([user_query])

    if text_vec.nnz == 0:
        intent = "unknown"
    else:
        predicted_intent = model.predict(text_vec)[0]
        probabilities = model.predict_proba(text_vec)[0]
        confidence_score = max(probabilities)
        intent = predicted_intent if confidence_score >= 0.45 else "unknown"

    # Compute the safety verdict up front — every intent that touches
    # workouts needs to respect it, and the Groq-failure fallback needs
    # it too so a rest lock is never silently dropped.
    disease_val = get_field(data, user_obj, 'disease', 'none')
    injury_val = get_field(data, user_obj, 'injury', 'none')
    verdict = get_safety_verdict(disease_val, injury_val)

    context_data = "No explicit dataset records match. Rely on general athletic guidance."

    if intent == "workout_recommendation":
        age = safe_float(get_field(data, user_obj, 'age'), 22)
        weight = safe_float(get_field(data, user_obj, 'weight'), 70)
        target_user = [[age, weight, 1.0, 1.0]]
        distances, indices = knn_model.kneighbors(target_user)
        idx = indices[0][0]

        if idx >= len(df_users) or idx < 0:
            idx = 0

        routine = df_users.iloc[idx]

        if verdict["lock_level"] == "multi":
            zone_list = sorted(verdict["movement_zones"])
            context_data = (
                f"BeFit Medical Safety Engine Verdict: MULTI-INJURY REST LOCK ACTIVE. "
                f"Detected concurrent injury zones: {', '.join(zone_list)}. "
                f"Per BeFit safety protocol, ALL active training is suspended this week and replaced "
                f"with Full Rest & Recovery. No exercises, substitutions, or workarounds are permitted "
                f"while this lock is active."
            )
        else:
            monday_raw = str(routine.get('Day 2 - Monday', 'Rest day scheduled'))
            tuesday_raw = str(routine.get('Day 3 - Tuesday', 'Rest day scheduled'))

            if verdict["lock_level"] == "single":
                active_zone = verdict["active_zone"]
                monday_val = adapt_exercises_single_zone(monday_raw, active_zone)
                tuesday_val = adapt_exercises_single_zone(tuesday_raw, active_zone)
                context_data = (
                    f"BeFit Medical Safety Engine Verdict: SINGLE-ZONE ADAPTATION ACTIVE for "
                    f"'{active_zone}'. BeFit Workout Log (already adapted for this injury): "
                    f"Monday Split is {monday_val}. Tuesday Split is {tuesday_val}. "
                    f"Only reference these pre-adapted exercises — do not invent alternatives."
                )
            else:
                context_data = (
                    f"BeFit Workout Log: Monday Split is {monday_raw}. "
                    f"Tuesday Split is {tuesday_raw}."
                )

    elif intent in ("diet_plan", "diet_info"):
        diet_type = safe_str(get_field(data, user_obj, 'dietType'), 'vegetarian').lower()
        filtered = df_diet[df_diet['Diet type'].str.contains(diet_type, case=False, na=False)]
        choice = filtered.sample(1).iloc[0] if not filtered.empty else df_diet.sample(1).iloc[0]
        context_data = (
            f"BeFit Nutritional Matrix: Target Type: {diet_type}. "
            f"Matched Breakfast: {choice.get('Breakfast_Monday', 'N/A')}. "
            f"Matched Lunch: {choice.get('Lunch_Monday', 'N/A')}. "
            f"Matched Pre-Workout: {choice.get('PreWorkout_Monday', 'N/A')}."
        )

    elif intent in ("user_profile", "injury_advice"):
        if verdict["lock_level"] == "multi":
            zone_list = sorted(verdict["movement_zones"])
            context_data = (
                f"BeFit Medical Safety Engine Verdict: MULTI-INJURY REST LOCK ACTIVE. "
                f"Detected concurrent injury zones: {', '.join(zone_list)}. "
                f"Per BeFit safety protocol, ALL active training is suspended this week and replaced "
                f"with Full Rest & Recovery. No exercises, substitutions, or workarounds (e.g. gripping "
                f"weights with feet/mouth, one-handed lifts) are permitted while this lock is active."
            )
        elif verdict["lock_level"] == "single":
            active_zone = verdict["active_zone"]
            context_data = (
                f"BeFit Medical Safety Engine Verdict: SINGLE-ZONE ADAPTATION ACTIVE for '{active_zone}'. "
                f"Exercises involving this zone must be swapped for the app's approved zone-safe substitutes "
                f"only (e.g. rest, isolation of unaffected limbs, or app-generated alternatives). "
                f"Do not invent new exercises or workarounds not provided by the app."
            )
        else:
            context_data = (
                f"BeFit User Metadata Context: Profile Goal: {safe_str(get_field(data, user_obj, 'goal'), 'Unspecified')}. "
                f"Mass Baseline: {safe_float(get_field(data, user_obj, 'weight'), 70)}kg. "
                f"Pathological Flag: {disease_val}. "
                f"Mechanical Limitation: {injury_val}. No movement-blocking zones detected."
            )

    system_prompt = f"""
    You are the BeFit AI Fitness Coach. Speak in a friendly, conversational, and encouraging tone.
    Here are the absolute facts retrieved from the internal BeFit database files:
    [{context_data}]

    INSTRUCTIONS:
    1. Answer the user's question directly using the provided facts above.
    2. If the facts contain specific workout exercises or food meals, state them explicitly to answer the question.
    3. Keep your output highly concise and professional, wrapped within 2 to 3 sentences max.
    4. Do not mention the word 'database' or 'context row' in your final response. Talk like an intuitive personal coach.
    5. NEVER invent your own exercise substitutions or workarounds for an injury. Strictly follow the
       Medical Safety Engine Verdict above. If a REST LOCK is active, tell the user to rest completely and
       not train this week — do NOT suggest any exercises, equipment tricks, or workarounds under any
       circumstances, even if the user pushes back or asks a follow-up question. If SINGLE-ZONE ADAPTATION
       is active, only reference the pre-adapted exercises given to you, never improvise new ones.
    """

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=300
        )
        personalized_msg = chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print("🔴 Groq Cloud API lag/error fallback active:", str(e))

        # Safety-aware fallback: if a rest lock or zone adaptation is active,
        # never let the generic filler message override it.
        if verdict["lock_level"] == "multi":
            personalized_msg = (
                "Your safety comes first — I've detected multiple concurrent injuries, so this week's "
                "plan is a full Rest & Recovery hold. Please don't train until you're cleared."
            )
        elif verdict["lock_level"] == "single":
            personalized_msg = (
                f"Given your current {verdict['active_zone'].replace('_', ' ')} injury, stick to the "
                "app's adapted, low-impact substitutes for that area rather than your usual exercises."
            )
        elif intent == "workout_recommendation":
            personalized_msg = "I've fetched your core cluster split! Let's hit your target compounds on the routine dashboard."
        elif intent in ("diet_plan", "diet_info"):
            personalized_msg = "Your custom nutritional split is ready! Check out the macro tracker to confirm items matching your requirements."
        else:
            personalized_msg = "I've received your data point. Let's head over to the corresponding app segment to execute updates!"

    return jsonify({
        "status": "success",
        "intent": intent,
        "personalized_message": personalized_msg
    }), 200

if __name__ == '__main__':
    initialize_ml_engine()
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)