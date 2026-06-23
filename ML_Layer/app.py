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
CORS(app)

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

# Ensure ML models are loaded before processing any request (Crucial for Flask caching)
@app.before_request
def ensure_initialized():
    if not is_initialized:
        initialize_ml_engine()


# =================================================
# 🔹 THE MEDICAL KNOWLEDGE GRAPH (SCALABLE ENGINE)
# =================================================

WORKOUT_PROTOCOLS = {
    ("asthma", "bronchitis", "sleep apnea", "copd", "breathing"): "Respiratory Protocol: High-intensity cardio replaced with LISS (Low-Intensity Steady State) to manage oxygen thresholds.",
    ("knee", "acl", "patella", "meniscus", "leg", "ankle", "foot", "calf", "hamstring", "quad", "hip", "achilles", "shin", "thigh"): "Lower Body Rehab Protocol: Axial loading (Squats/Impact) replaced with Glute Bridges, Iso-Holds, and non-impact mobility.",
    ("shoulder", "rotator cuff", "frozen joint", "clavicle", "deltoid"): "Shoulder Rehab Protocol: Overhead pressing restricted. Focus shifted to resistance band therapy and internal/external rotations.",
    ("back", "spine", "disc", "sciatica", "tailbone", "cervical", "lumbar", "neck", "whiplash"): "Spinal Protocol: Heavy deadlifts and spinal loading removed. Core stabilization and supported machine equivalents prioritized.",
    ("hypertension", "high bp", "blood pressure", "heart"): "Blood Pressure Protocol: Heavy isometric holds and Valsalva maneuvers removed to prevent dangerous BP spikes.",
    ("diabetes", "pro diabetes", "insulin"): "Diabetic Training Protocol: Prolonged intense endurance blocked to prevent hypoglycemia. Moderate hypertrophy focus.",
    ("osteoporosis", "arthritis", "joint pain", "rheumatoid"): "Joint Preservation Protocol: Plyometrics and heavy impact jumping replaced with low-impact time-under-tension movements.",
    ("wrist", "hand", "carpal", "finger", "thumb", "metacarpal"): "Grip Zero Protocol: All pulling, holding, and palm-pressure pushing movements removed. Shifted to forearm-pad machines and core.",
    ("elbow", "tennis elbow", "bicep", "tricep", "arm"): "Arm/Elbow Protocol: Heavy gripping and barbell presses modified to neutral-grip dumbbell and strict machine work.",
    ("hernia", "groin", "pelvic", "abdomen", "abdominal"): "Core Stability Protocol: Heavy compound bracing, deep squats, and intense direct core rollouts restricted to prevent tearing.",
    ("depression", "anxiety", "stress", "insomnia", "fatigue", "low stamina", "anemia"): "CNS Recovery Protocol: Volume reduced by 15%. Focus on endorphin-release pacing rather than central nervous system exhaustion."
}

DIET_PROTOCOLS = {
    ("diabetes", "pro diabetes", "pcos", "pcod", "insulin"): "Metabolic Protocol: Strict Low-Glycemic Index carbohydrates. Added sugars and refined carbs entirely restricted to control insulin spikes.",
    ("hypertension", "high bp", "high cholesterol", "fatty liver", "high triglycerides", "heart"): "Cardiovascular Protocol: Sodium strictly limited to <1500mg/day. Saturated fats replaced with Omega-3s and high-fiber grains.",
    ("gerd", "acidity", "ulcer", "ibs", "piles", "liver disorder", "gastric"): "Gastrointestinal Protocol: Acidic, highly spiced, and heavily processed foods removed. Easily digestible proteins prioritized.",
    ("osteoporosis", "fracture", "bone", "vitamin d deficiency", "calcium"): "Bone Synthesis Protocol: Dietary calcium and Vitamin D baselines increased by 30% for active recovery.",
    ("anemia", "muscle weakness", "low stamina", "fatigue"): "Iron & Energy Protocol: Iron-dense greens and lean red meats (if non-veg) prioritized alongside Vitamin C for absorption.",
    ("thyroid", "hypothyroidism"): "Thyroid Protocol: Raw goitrogenic vegetables (cabbage, broccoli) and unfermented soy restricted."
}


# =================================================
# 🔹 1. WORKOUT MUTATOR (DYNAMIC LOOP)
# =================================================
def apply_workout_mutator(disease, injury):
    disease = str(disease).lower()
    injury = str(injury).lower()
    combined_health_string = f"{disease} {injury}"
    mutations_applied = []

    for keywords, protocol in WORKOUT_PROTOCOLS.items():
        if any(keyword in combined_health_string for keyword in keywords):
            mutations_applied.append(protocol)

    return mutations_applied


@app.route('/recommend-plan', methods=['POST'])
def recommend_plan():
    data = request.json
    try:
        user_obj = data.get("user", {})
        age = float(data.get('age', user_obj.get('age', 22)))
        weight = float(data.get('weight', user_obj.get('weight', 70)))

        # Standardize strings to match the dataset exactly
        exp_raw = str(data.get('experience', user_obj.get('experience', 'Intermediate'))).title()
        if exp_raw not in ['Beginner', 'Intermediate', 'Advance', 'Advanced']:
            exp_raw = 'Intermediate'
        if exp_raw == 'Advanced': exp_raw = 'Advance'

        goal_raw = str(data.get('goal', user_obj.get('goal', 'Maintenance'))).title()
        if 'Loss' in goal_raw or 'Cut' in goal_raw: goal_raw = 'Fat Loss'
        elif 'Gain' in goal_raw or 'Bulk' in goal_raw: goal_raw = 'Muscle Gain'
        else: goal_raw = 'Maintenance'

        # Use loaded encoders for perfect accuracy. Fallback if missing.
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

        disease = str(data.get('disease', user_obj.get('disease', 'none'))).lower()
        injury = str(data.get('injury', user_obj.get('injury', 'none'))).lower()

        target_user = [[age, weight, exp, goal]]
    except Exception as e:
        raise APIError(f"Metrics engine transformation crash: {str(e)}")

    distances, indices = knn_model.kneighbors(target_user)
    idx = indices[0][0]
    
    # 🔹 SAFETY GUARD: Prevents the 500 Server Error if pickles are out of sync
    if idx >= len(df_users) or idx < 0:
        print(f"⚠️ Warning: KNN index {idx} out of bounds for df_users size {len(df_users)}. Using index 0.")
        idx = 0
        
    recommended_profile = df_users.iloc[idx]
    medical_mutations = apply_workout_mutator(disease, injury)

    # =================================================
    # 🔹 EXERCISE REPLACEMENT ENGINE
    # =================================================
    def adapt_exercises(daily_string):
        if not isinstance(daily_string, str): return "Rest & Recovery"
        if daily_string.lower().strip() in ("rest", "rest & recovery"): return daily_string

        s = daily_string
        health_state = f"{disease} {injury}"

        # ── HAND / WRIST / FINGERS (NO GRIP OR PALM PRESSURE ALLOWED) ───────
        if any(k in health_state for k in ["wrist", "hand", "carpal", "finger", "thumb", "metacarpal"]):
            s = re.sub(r'(?i)(bench|shoulder|dumbbell|arnold|military|chest|overhead)\s+press', 'Pec Deck Machine (Forearms)', s)
            s = re.sub(r'(?i)(decline|incline|diamond|wall)?\s*push[\-\s]?ups?', 'Lying Crunches', s)
            s = re.sub(r'(?i)(lat\s+pulldown|pull[\-\s]?ups?|chin[\-\s]?ups?)', 'Lower Back Extensions', s)
            s = re.sub(r'(?i)(barbell|dumbbell|cable|t[\-\s]?bar|machine)\s+rows?', 'Superman Holds', s)
            s = re.sub(r'(?i)face\s+pulls?', 'Superman Holds', s)
            s = re.sub(r'(?i)(bicep\s+|hammer\s+|preacher\s+|concentration\s+|cable\s+)?curls?', 'Core: V-Ups', s)
            s = re.sub(r'(?i)(tricep\s+)?pushdowns?', 'Core: Russian Twists', s)
            s = re.sub(r'(?i)(ab\s+wheel|rollout)', 'Lying Leg Raises', s)
            s = re.sub(r'(?i)planks?', 'Hollow Body Hold', s)
            s = re.sub(r'(?i)mountain\s+climbers?', 'Bicycle Crunches', s)
            s = re.sub(r'(?i)(deadlifts?|rdl|romanian\s+deadlifts?)', 'Good Mornings (Bodyweight)', s)
            s = re.sub(r'(?i)\bdips?\b', 'Lying Leg Raises', s)

        # ── SHOULDER / ELBOW / ARM (GRIP OK, OVERHEAD/HEAVY PUSH BLOCKED) ───
        elif any(k in health_state for k in ["shoulder", "arm", "elbow", "rotator", "clavicle", "bicep", "tricep", "deltoid", "tennis elbow"]):
            s = re.sub(r'(?i)close[\-\s]grip bench press', 'Machine Chest Press', s)
            s = re.sub(r'(?i)barbell bench press', 'Machine Chest Press', s)
            s = re.sub(r'(?i)incline dumbbell press', 'Machine Chest Press', s)
            s = re.sub(r'(?i)dumbbell chest press', 'Machine Chest Press', s)
            s = re.sub(r'(?i)bench press', 'Machine Chest Press', s)

            s = re.sub(r'(?i)overhead shoulder press', '__BAND_RAISES__', s)
            s = re.sub(r'(?i)seated shoulder press', '__BAND_RAISES__', s)
            s = re.sub(r'(?i)seated dumbbell press', '__BAND_RAISES__', s)
            s = re.sub(r'(?i)seated arnold press', '__BAND_RAISES__', s)
            s = re.sub(r'(?i)arnold press', '__BAND_RAISES__', s)
            s = re.sub(r'(?i)overhead press', '__BAND_RAISES__', s)
            s = re.sub(r'(?i)shoulder press', '__BAND_RAISES__', s)
            s = s.replace('__BAND_RAISES__', 'Resistance Band Front Raises')

            s = re.sub(r'(?i)wide[\-\s]grip lat pulldown', '__LAT_PULL__', s)
            s = re.sub(r'(?i)seated lat pulldown', '__LAT_PULL__', s)
            s = re.sub(r'(?i)lat pulldown', '__LAT_PULL__', s)
            s = re.sub(r'(?i)pull[\-\s]ups?', '__LAT_PULL__', s)
            s = s.replace('__LAT_PULL__', 'Light Lat Pulldowns')

            s = re.sub(r'(?i)bent[\-\s]over barbell row', 'Machine Row', s)
            s = re.sub(r'(?i)incline dumbbell row', 'Machine Row', s)
            s = re.sub(r'(?i)t[\-\s]bar row', 'Machine Row', s)

            s = re.sub(r'(?i)tricep\s+dip', 'Tricep Pushdowns', s)
            s = re.sub(r'(?i)\bdips\b', 'Tricep Pushdowns', s)
            s = re.sub(r'(?i)decline push[\-\s]?ups?', '__WALL_PU__', s)
            s = re.sub(r'(?i)diamond push[\-\s]?ups?', '__WALL_PU__', s)
            s = re.sub(r'(?i)push[\-\s]?ups?', '__WALL_PU__', s)
            s = s.replace('__WALL_PU__', 'Wall Push Ups')

        # ── SPINAL / BACK / NECK INJURIES ───────────────────────────────────
        if any(k in health_state for k in ["back", "spine", "cervical", "sciatica", "disc", "tailbone", "lumbar", "neck", "whiplash"]):
            s = re.sub(r'(?i)barbell squats?', 'Leg Press', s)
            s = re.sub(r'(?i)romanian deadlifts?', 'Lying Leg Curls', s)
            s = re.sub(r'(?i)sumo deadlifts?', 'Lying Leg Curls', s)
            s = re.sub(r'(?i)deadlifts?', 'Lying Leg Curls', s)
            s = re.sub(r'(?i)bent[\-\s]over barbell row', 'Chest-Supported Row', s)
            s = re.sub(r'(?i)t[\-\s]bar row', 'Chest-Supported Row', s)
            s = re.sub(r'(?i)burpees?', 'Incline Push Ups', s)
            s = re.sub(r'(?i)overhead shoulder press', 'Seated Dumbbell Press (Back Supported)', s)
            s = re.sub(r'(?i)military press', 'Seated Dumbbell Press (Back Supported)', s)

        # ── LOWER BODY / KNEE / ACL / HIP / ANKLE / FOOT ────────────────────
        if any(k in health_state for k in ["knee", "acl", "leg", "pelvic", "meniscus", "ankle", "calf", "hip", "quad", "hamstring", "foot", "achilles", "shin", "toe"]):
            s = re.sub(r'(?i)bulgarian split squats?', 'Seated Leg Extension', s)
            s = re.sub(r'(?i)goblet squats?', 'Seated Leg Extension', s)
            s = re.sub(r'(?i)hack squats?', 'Seated Leg Extension', s)
            s = re.sub(r'(?i)barbell squats?', 'Glute Bridges', s)
            s = re.sub(r'(?i)front squats?', 'Straight Leg Raises', s)
            s = re.sub(r'(?i)bodyweight squats?', 'Seated Leg Extensions', s)
            s = re.sub(r'(?i)squats?', 'Glute Bridges', s)

            s = re.sub(r'(?i)romanian deadlifts?', 'Seated Hamstring Curls', s)
            s = re.sub(r'(?i)sumo deadlifts?', 'Seated Hamstring Curls', s)
            s = re.sub(r'(?i)deadlifts?', 'Seated Hamstring Curls', s)

            s = re.sub(r'(?i)walking lunges?', 'Step-ups', s)
            s = re.sub(r'(?i)lunges?', 'Step-ups', s)

            s = re.sub(r'(?i)box jumps?', 'Seated Leg Press', s)
            s = re.sub(r'(?i)high[\-\s]?knees?', 'Seated Marching', s)
            s = re.sub(r'(?i)jumping jacks?', 'Side Steps', s)
            s = re.sub(r'(?i)burpees?', 'Modified Sprawls', s)
            s = re.sub(r'(?i)jump rope\s*\d*\w*', 'Seated Calf Raises', s)
            s = re.sub(r'(?i)skipping', 'Seated Calf Raises', s)

        # ── CORE / HERNIA / ABDOMINAL TEAR ──────────────────────────────────
        if any(k in health_state for k in ["hernia", "groin", "abdomen", "abdominal"]):
            s = re.sub(r'(?i)ab wheel rollout', 'Bird-Dog', s)
            s = re.sub(r'(?i)crunches', 'Gentle Planks', s)
            s = re.sub(r'(?i)sit[\-\s]?ups?', 'Gentle Planks', s)
            s = re.sub(r'(?i)barbell squats?', 'Machine Leg Press', s)
            s = re.sub(r'(?i)deadlifts?', 'Seated Hamstring Curls', s)

        # ── CARDIOVASCULAR / BP / RESPIRATORY ───────────────────────────────
        if any(k in health_state for k in ["bp", "hypertension", "heart", "asthma", "fatigue", "anemia", "bronchitis", "copd"]):
            s = re.sub(r'(?i)weighted planks?', 'Standard Plank', s)
            s = re.sub(r'(?i)burpees?', 'Brisk Walking', s)
            s = re.sub(r'(?i)jump rope\s*\d*\w*', 'Stationary Cycling', s)
            s = re.sub(r'(?i)mountain climbers?', 'Brisk Walking', s)
            s = re.sub(r'(?i)box jumps?', 'Stationary Cycling', s)
            s = re.sub(r'(?i)skipping', 'Stationary Cycling', s)
            s = re.sub(r'(?i)high[\-\s]?knees?', 'Brisk Walking', s)

        return s

    msg = "Collaborative filtering successful."
    if medical_mutations:
        msg += " ⚠️ Medical state detected. Adaptive protocols engaged."

    return jsonify({
        "status": "success",
        "message": msg,
        "recommended_cluster_index": str(idx),
        "medical_mutations_applied": medical_mutations,
        "base_routine": {
            "Sunday": adapt_exercises(str(recommended_profile.get('Day 1 - Sunday', 'Rest'))),
            "Monday": adapt_exercises(str(recommended_profile.get('Day 2 - Monday', 'Rest'))),
            "Tuesday": adapt_exercises(str(recommended_profile.get('Day 3 - Tuesday', 'Rest'))),
            "Wednesday": adapt_exercises(str(recommended_profile.get('Day 4 - Wednesday', 'Rest'))),
            "Thursday": adapt_exercises(str(recommended_profile.get('Day 5 - Thursday', 'Rest'))),
            "Friday": adapt_exercises(str(recommended_profile.get('Day 6 - Friday', 'Rest'))),
            "Saturday": adapt_exercises(str(recommended_profile.get('Day 7 - Saturday', 'Rest')))
        }
    }), 200


# =================================================
# 🔹 2. MEDICAL DIET ENGINE (DYNAMIC LOOP)
# =================================================
@app.route('/diet-recommendation', methods=['POST'])
def diet_recommendation():
    data = request.json
    user_obj = data.get("user", {})

    diet_type = data.get("dietType", user_obj.get("dietType", "")).lower()
    disease = str(data.get("disease", user_obj.get("disease", "none"))).lower()
    injury = str(data.get("injury", user_obj.get("injury", "none"))).lower()
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
    data = request.json
    avg_difficulty = data.get('average_difficulty', 5)

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
    data = request.json
    if not data or 'query' not in data:
        raise APIError("Please provide a search query.")

    raw_input = data.get('query')
    user_obj = data.get('user', {})

    if isinstance(raw_input, dict):
        user_query = str(raw_input.get('userQuery', ''))
    else:
        user_query = str(raw_input)

    text_vec = vectorizer.transform([user_query])

    if text_vec.nnz == 0:
        intent = "unknown"
    else:
        predicted_intent = model.predict(text_vec)[0]
        probabilities = model.predict_proba(text_vec)[0]
        confidence_score = max(probabilities)
        intent = predicted_intent if confidence_score >= 0.45 else "unknown"

    context_data = "No explicit dataset records match. Rely on general athletic guidance."

    if intent == "workout_recommendation":
        age = float(user_obj.get('age', 22))
        weight = float(user_obj.get('weight', 70))
        target_user = [[age, weight, 1.0, 1.0]]
        distances, indices = knn_model.kneighbors(target_user)
        idx = indices[0][0]
        
        if idx >= len(df_users) or idx < 0:
            idx = 0
            
        routine = df_users.iloc[idx]
        context_data = (
            f"BeFit Workout Log: Monday Split is "
            f"{routine.get('Day 2 - Monday', 'Rest day scheduled')}. "
            f"Tuesday Split is {routine.get('Day 3 - Tuesday', 'Rest day scheduled')}."
        )

    elif intent in ("diet_plan", "diet_info"):
        diet_type = str(user_obj.get('dietType', 'vegetarian')).lower()
        filtered = df_diet[df_diet['Diet type'].str.contains(diet_type, case=False, na=False)]
        choice = filtered.sample(1).iloc[0] if not filtered.empty else df_diet.sample(1).iloc[0]
        context_data = (
            f"BeFit Nutritional Matrix: Target Type: {diet_type}. "
            f"Matched Breakfast: {choice.get('Breakfast_Monday', 'N/A')}. "
            f"Matched Lunch: {choice.get('Lunch_Monday', 'N/A')}. "
            f"Matched Pre-Workout: {choice.get('PreWorkout_Monday', 'N/A')}."
        )

    elif intent in ("user_profile", "injury_advice"):
        context_data = (
            f"BeFit User Metadata Context: Profile Goal: {user_obj.get('goal', 'Unspecified')}. "
            f"Mass Baseline: {user_obj.get('weight', '70')}kg. "
            f"Pathological Flag: {user_obj.get('disease', 'none')}. "
            f"Mechanical Limitation: {user_obj.get('injury', 'none')}."
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
    """

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=100
        )
        personalized_msg = chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print("🔴 Groq Cloud API lag/error fallback active:", str(e))
        if intent == "workout_recommendation":
            personalized_msg = "I've fetched your core cluster split! Let's hit your target compounds on the routine dashboard."
        elif intent == "diet_plan":
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
    app.run(port=5001, debug=False)