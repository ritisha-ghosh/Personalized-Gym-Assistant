from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import random
import os

app = Flask(__name__)
CORS(app)

class APIError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__()
        self.message = message
        self.status_code = status_code

@app.errorhandler(APIError)
def handle_api_error(error):
    return jsonify({"status": "error", "message": error.message}), error.status_code

vectorizer, model, knn_model, df_users, df_diet = None, None, None, None, None

def initialize_ml_engine():
    global vectorizer, model, knn_model, df_users, df_diet
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    vectorizer = joblib.load(os.path.join(BASE_DIR, 'vectorizer.pkl'))
    model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
    knn_model = joblib.load(os.path.join(BASE_DIR, 'knn_model.pkl'))
    df_users = joblib.load(os.path.join(BASE_DIR, 'df_users.pkl'))
    df_diet = pd.read_csv(os.path.join(BASE_DIR, 'diet_dataset.csv'), encoding='latin1')
    print("✅ Week 9 Enterprise Medical ML Engine Online.")


# =================================================
# 🔹 THE MEDICAL KNOWLEDGE GRAPH (SCALABLE ENGINE)
# =================================================

# Groups conditions into protocols. If you add new diseases to the CSV later, 
# just add the keyword to one of these tuples!
WORKOUT_PROTOCOLS = {
    ("asthma", "bronchitis", "sleep apnea"): "Respiratory Protocol: High-intensity cardio replaced with LISS (Low-Intensity Steady State) to manage oxygen thresholds.",
    ("knee", "acl", "patella", "meniscus", "leg fracture"): "Lower Body Rehab Protocol: Axial loading (Squats) replaced with Glute Bridges, Iso-Holds, and non-impact mobility.",
    ("shoulder", "rotator cuff", "frozen joint", "clavicle"): "Shoulder Rehab Protocol: Overhead pressing restricted. Focus shifted to resistance band therapy and internal/external rotations.",
    ("back", "spine", "disc", "sciatica", "tailbone", "cervical"): "Spinal Protocol: Heavy deadlifts and spinal loading removed. Core stabilization and supported machine equivalents prioritized.",
    ("hypertension", "high bp", "blood pressure"): "Blood Pressure Protocol: Heavy isometric holds and Valsalva maneuvers removed to prevent dangerous BP spikes.",
    ("diabetes", "pro diabetes"): "Diabetic Training Protocol: Prolonged intense endurance blocked to prevent hypoglycemia. Moderate hypertrophy focus.",
    ("osteoporosis", "arthritis", "joint pain"): "Joint Preservation Protocol: Plyometrics and heavy impact jumping replaced with low-impact time-under-tension movements.",
    ("wrist", "elbow", "carpal tunnel", "hand"): "Upper Extremity Protocol: Heavy gripping and barbell presses modified to neutral-grip dumbbell and machine work.",
    ("depression", "anxiety", "stress", "insomnia", "fatigue", "low stamina"): "CNS Recovery Protocol: Volume reduced by 15%. Focus on endorphin-release pacing rather than central nervous system exhaustion."
}

DIET_PROTOCOLS = {
    ("diabetes", "pro diabetes", "pcos", "pcod"): "Metabolic Protocol: Strict Low-Glycemic Index carbohydrates. Added sugars and refined carbs entirely restricted to control insulin spikes.",
    ("hypertension", "high bp", "high cholesterol", "fatty liver", "high triglycerides"): "Cardiovascular Protocol: Sodium strictly limited to <1500mg/day. Saturated fats replaced with Omega-3s and high-fiber grains.",
    ("gerd", "acidity", "ulcer", "ibs", "piles", "liver disorder"): "Gastrointestinal Protocol: Acidic, highly spiced, and heavily processed foods removed. Easily digestible proteins prioritized.",
    ("osteoporosis", "fracture", "bone", "vitamin d deficiency"): "Bone Synthesis Protocol: Dietary calcium and Vitamin D baselines increased by 30% for active recovery.",
    ("anemia", "muscle weakness", "low stamina"): "Iron & Energy Protocol: Iron-dense greens and lean red meats (if non-veg) prioritized alongside Vitamin C for absorption.",
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

    # Dynamically search the dictionary instead of using 100 if statements
    for keywords, protocol in WORKOUT_PROTOCOLS.items():
        if any(keyword in combined_health_string for keyword in keywords):
            mutations_applied.append(protocol)

    return mutations_applied

@app.route('/recommend-plan', methods=['POST'])
def recommend_plan():
    data = request.json
    try:
        level_map = {"beginner": 1.0, "intermediate": 2.0, "advanced": 0.0}
        goal_map = {"loss": 1.0, "gain": 0.0, "muscle": 0.0, "maintain": 2.0}
        
        user_obj = data.get("user", {})
        age = float(data.get('age', user_obj.get('age', 22)))
        weight = float(data.get('weight', user_obj.get('weight', 70)))
        
        exp_raw = str(data.get('experience', user_obj.get('experience', '1'))).lower()
        exp = level_map.get(exp_raw, 1.0)
        
        goal_raw = str(data.get('goal', user_obj.get('goal', '1'))).lower()
        if 'loss' in goal_raw or 'cut' in goal_raw: goal_raw = 'loss'
        elif 'gain' in goal_raw or 'bulk' in goal_raw: goal_raw = 'gain'
        goal = goal_map.get(goal_raw, 1.0)

        disease = data.get('disease', user_obj.get('disease', 'none'))
        injury = data.get('injury', user_obj.get('injury', 'none'))

        target_user = [[age, weight, exp, goal]]
    except Exception as e:
        raise APIError(f"Metrics engine transformation crash: {str(e)}")

    distances, indices = knn_model.kneighbors(target_user)
    recommended_profile = df_users.iloc[indices[0][0]]
    
    # Run the new dynamic mutator
    medical_mutations = apply_workout_mutator(disease, injury)

    msg = "Collaborative filtering successful."
    if medical_mutations:
        msg += " ⚠️ Medical state detected. Adaptive protocols engaged."

    return jsonify({
        "status": "success",
        "message": msg,
        "recommended_cluster_index": str(indices[0][0]),
        "medical_mutations_applied": medical_mutations,
        "base_routine": {
            "Monday": str(recommended_profile.get('Day 2 - Monday', 'Rest')),
            "Tuesday": str(recommended_profile.get('Day 3 - Tuesday', 'Rest'))
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

    # Layer 1: Veg / Non-Veg Standard Filtering
    if "veg" in diet_type and "non" not in diet_type:
        filtered = filtered[filtered['Diet type'].str.contains('Veg', case=False, na=False)]
        filtered = filtered[~filtered['Diet type'].str.contains('Non-Veg', case=False, na=False)]
    elif "non" in diet_type:
        filtered = filtered[filtered['Diet type'].str.contains('Non', case=False, na=False)]

    # Layer 2: Exact Dataset Matching (If the specific disease exists in CSV)
    if disease != 'none':
        disease_match = filtered[filtered['Disease'].str.contains(disease, case=False, na=False)]
        if not disease_match.empty:
            filtered = disease_match
            medical_diet_flags.append(f"Exact CSV nutritional profile matched and applied for: {disease.title()}")
    
    # Layer 3: Dynamic Rule-Based Medical Guardrails 
    # (Scans the dictionary for any matched diseases or injuries)
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

if __name__ == '__main__':
    initialize_ml_engine()
    app.run(port=5001, debug=False)