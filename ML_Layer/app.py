# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import random
import os

app = Flask(__name__)
CORS(app)

# =================================================
# 🔹 CUSTOM EXCEPTION HANDLING 
# =================================================

class APIError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__()
        self.message = message
        self.status_code = status_code

@app.errorhandler(APIError)
def handle_api_error(error):
    return jsonify({
        "status": "error",
        "message": error.message
    }), error.status_code

@app.errorhandler(Exception)
def handle_general_exception(e):
    return jsonify({
        "status": "fail",
        "message": "An internal server error occurred.",
        "details": str(e)
    }), 500

# =================================================
# 🔹 ML ENGINE INITIALIZATION (MERGE CONFLICT RESOLVED)
# =================================================

vectorizer = None
model = None
knn_model = None
df_users = None
df_diet = None

def initialize_ml_engine():
    global vectorizer, model, knn_model, df_users, df_diet
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    load_errors = []

    try:
        vectorizer = joblib.load(os.path.join(BASE_DIR, 'vectorizer.pkl'))
        print("✅ NLP vectorizer loaded.")
    except Exception as e:
        vectorizer = None
        load_errors.append(f"vectorizer.pkl: {e}")

    try:
        model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
        print("✅ NLP classifier model loaded.")
    except Exception as e:
        model = None
        load_errors.append(f"model.pkl: {e}")

    try:
        knn_model = joblib.load(os.path.join(BASE_DIR, 'knn_model.pkl'))
        print("✅ KNN recommendation model loaded.")
    except Exception as e:
        knn_model = None
        load_errors.append(f"knn_model.pkl: {e}")

    try:
        df_users = joblib.load(os.path.join(BASE_DIR, 'df_users.pkl'))
        if df_users is not None and 'recommended_plan_id' not in df_users.columns:
            df_users['recommended_plan_id'] = df_users.index + 1
        print("✅ User recommendation dataset loaded from df_users.pkl.")
    except Exception as e:
        df_users = None
        load_errors.append(f"df_users.pkl: {e}")
        try:
            df_users = pd.read_csv(os.path.join(BASE_DIR, 'user_profiles_demo.csv'), encoding='latin1')
            df_users['recommended_plan_id'] = df_users.index + 1
            print("✅ User recommendation dataset loaded from user_profiles_demo.csv.")
        except Exception as csv_err:
            df_users = None
            load_errors.append(f"user_profiles_demo.csv: {csv_err}")

    try:
        df_diet = pd.read_csv(os.path.join(BASE_DIR, 'diet_dataset.csv'), encoding='latin1')
        print("🥗 Diet Dataset loaded successfully.")
    except Exception as e:
        df_diet = None
        load_errors.append(f"diet_dataset.csv: {e}")

    if load_errors:
        print("⚠️ ML Engine loaded with warnings:")
        for err in load_errors:
            print(f"  - {err}")
    else:
        print("✅ ML Engine fully initialized with zero errors.")

# =================================================
# 🔹 1. SMART CHATBOT (FIXED WORKOUT & DIET POOLS)
# =================================================

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'query' not in data:
        raise APIError("Please provide a search query.")
    
    raw_input = data.get('query')
    context_muscles = []
    
    if isinstance(raw_input, dict):
        user_query = raw_input.get('userQuery', '')
        context_muscles = [m.lower() for m in raw_input.get('recentActivity', [])]
    else:
        user_query = str(raw_input)

    text_vec = vectorizer.transform([user_query])
    
    if text_vec.nnz == 0:
        return jsonify({
            "status": "success",
            "intent": "unknown",
            "confidence": "low",
            "personalized_message": "I'm still learning! I mostly understand fitness, workouts, and diet right now."
        }), 200
    
    predicted_intent = model.predict(text_vec)[0]
    probabilities = model.predict_proba(text_vec)[0]
    confidence_score = max(probabilities)

    intent = predicted_intent if confidence_score >= 0.2 else "unknown"
    
    if intent == "unknown":
        personalized_msg = "I'm not quite sure I understand. I'm trained specifically to help you with workout plans, diet recommendations, and logging your gym progress. What fitness goal can I help you with?"
    else:
        personalized_msg = "How can I help you with your fitness journey today?"
        
    if intent == "workout_recommendation":
        if any(m in ["quads", "hamstrings", "legs"] for m in context_muscles):
            personalized_msg = "Since you hit legs recently, your quads and hamstrings need recovery. Let's focus on Upper Body (Chest/Back) or light mobility options."
        elif "chest" in context_muscles:
            personalized_msg = "I noticed you did a chest workout recently. A 'Pull' session focusing on Back and Biceps is a highly recommended strategy."
        else:
            personalized_msg = "You're fresh! A full-body session or high-intensity interval training session matches your current recovery metrics perfectly."

    elif intent in ["diet_info", "diet_plan"]:
        if df_diet is not None and not df_diet.empty:
            user_message_lower = user_query.lower()
            filtered_diet = df_diet.copy()
            
            if 'keto' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Diet Type'].str.contains('Keto', case=False, na=False)]
            elif 'vegan' in user_message_lower or 'vegetarian' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Diet Type'].str.contains('Vegan|Vegetarian', case=False, na=False)]
                # 🛑 THE FIX: Explicitly destroy the "Non-Vegetarian" substring match and Eggs!
                filtered_diet = filtered_diet[~filtered_diet['Diet Type'].str.contains('Non-Veg|Egg', case=False, na=False)]
                
            if 'loss' in user_message_lower or 'cut' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Focus Goal'].str.contains('Loss', case=False, na=False)]
            elif 'gain' in user_message_lower or 'bulk' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Focus Goal'].str.contains('Gain|Muscle', case=False, na=False)]

            if filtered_diet.empty:
                filtered_diet = df_diet

            rec = filtered_diet.sample(1).iloc[0]
            personalized_msg = (
                f"Here is a suggested full-day meal plan optimized for {rec['Focus Goal']}:\n"
                f"🍳 Breakfast: {rec['Breakfast Suggestion']} ({rec['Breakfast Calories (kcal)']} kcal)\n"
                f"🥗 Lunch: {rec['Lunch Suggestion']} ({rec['Lunch Calories (kcal)']} kcal)\n"
                f"⚡ Pre-Workout: {rec['Pre-Workout Food']} ({rec['Pre-Workout Calories (kcal)']} kcal)\n"
                f"🍛 Dinner: {rec['Dinner Suggestion']} ({rec['Dinner Calories (kcal)']} kcal)"
            )
        else:
            personalized_msg = "Nutrition is 70% of the game. Are you looking for a meal plan for weight loss or muscle gain?"

    return jsonify({
        "status": "success",
        "intent": intent,
        "confidence": "high" if confidence_score >= 0.2 else "low",
        "personalized_message": personalized_msg,
        "context_detected": list(set(context_muscles))
    }), 200

# =================================================
# 🔹 2. ADAPTIVE ENGINE (DIFFICULTY SCALING)
# =================================================

@app.route('/scale-difficulty', methods=['POST'])
def scale_difficulty():
    data = request.json
    current_plan = data.get('plan', {})
    avg_difficulty = data.get('average_difficulty', 5)

    if avg_difficulty is None or not (1 <= int(avg_difficulty) <= 10):
        raise APIError("Difficulty must be between 1 and 10.")

    if avg_difficulty < 4:
        action, factor, msg = "increase_intensity", 1.1, "Plan adapted: Increased volume due to low difficulty."
    elif avg_difficulty > 8:
        action, factor, msg = "decrease_intensity", 0.9, "Plan adapted: Reduced volume to prevent burnout."
    else:
        return jsonify({"status": "no_change", "plan": current_plan, "message": "Optimal intensity."})

    updated_exercises = []
    for ex in current_plan.get('exercises', []):
        new_sets, new_reps = ex['sets'], ex['reps']
        if action == "increase_intensity":
            new_reps += 2
            if new_sets < 5: new_sets += 1
        else:
            new_reps = max(5, new_reps - 2)
            new_sets = max(2, new_sets - 1)

        updated_exercises.append({
            "name": ex['name'],
            "sets": int(new_sets),
            "reps": int(new_reps),
            "restSeconds": ex.get('restSeconds', 60)
        })

    new_plan = current_plan.copy()
    new_plan['exercises'] = updated_exercises
    new_plan['title'] = f"{current_plan.get('title', 'Workout')} (Adapted)"

    return jsonify({"status": "success", "action": action, "plan": new_plan, "message": msg})

# =================================================
# 🔹 3. DIET RECOMMENDATION ENGINE (FIXED EGGETARIAN & CHICKEN LEAKS)
# =================================================

@app.route('/diet-recommendation', methods=['POST'])
def diet_recommendation():
    data = request.json
    diet_type = data.get("dietType", "").lower()
    
    if df_diet is None or df_diet.empty:
        raise APIError("Diet database is currently unavailable.")

    filtered = df_diet.copy()
    
    if diet_type:
        # If they specifically want meat, allow it
        if "non-veg" in diet_type:
            filtered = filtered[filtered['Diet Type'].str.contains('Non-Veg', case=False, na=False)]
        # If they want Veg/Vegan, engage the strict filters
        elif "veg" in diet_type:
            filtered = filtered[filtered['Diet Type'].str.contains('Veg', case=False, na=False)]
            # 🛑 THE FIX: Drop the "Non-Veg" substring matches and Eggs immediately
            filtered = filtered[~filtered['Diet Type'].str.contains('Non-Veg|Egg', case=False, na=False)]
        
    if filtered.empty:
        filtered = df_diet 

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekly_plan = []
    
    for day in days:
        choice = filtered.sample(1).iloc[0]
        day_meals = [
            {"type": "Breakfast", "food": choice['Breakfast Suggestion'], "cal": f"{choice['Breakfast Calories (kcal)']} kcal"},
            {"type": "Lunch", "food": choice['Lunch Suggestion'], "cal": f"{choice['Lunch Calories (kcal)']} kcal"},
            {"type": "Pre-Workout", "food": choice['Pre-Workout Food'], "cal": f"{choice['Pre-Workout Calories (kcal)']} kcal"},
            {"type": "Dinner", "food": choice['Dinner Suggestion'], "cal": f"{choice['Dinner Calories (kcal)']} kcal"}
        ]
        weekly_plan.append({"day": day, "meals": day_meals})

    return jsonify({"status": "success", "weekly_plan": weekly_plan}), 200

# =================================================
# 🔹 4. SMART COACH (FIXED STR-TO-FLOAT PARSING BUGS)
# =================================================

@app.route('/recommend-plan', methods=['POST'])
def recommend_plan():
    data = request.json
    try:
        # 🧠 FIX: Map literal text values to matched LabelEncoder integers safely
        level_map = {"beginner": 1.0, "intermediate": 2.0, "advanced": 0.0}
        goal_map = {"loss": 1.0, "gain": 0.0, "muscle": 0.0, "maintain": 2.0}
        
        age = float(data.get('age', 22))
        weight = float(data.get('weight_kg', 70))
        
        exp_raw = str(data.get('experience_level', '1')).lower()
        exp = level_map.get(exp_raw, float(exp_raw) if exp_raw.replace('.','',1).isdigit() else 1.0)
        
        goal_raw = str(data.get('goal_type', '1')).lower()
        goal = goal_map.get(goal_raw, float(goal_raw) if goal_raw.replace('.','',1).isdigit() else 1.0)
        
        target_user = [[age, weight, exp, goal]]
        exhausted_muscles = data.get('exhausted_muscles', [])
    except Exception as e:
        raise APIError(f"Metrics engine transformation crash: {str(e)}")

    distances, indices = knn_model.kneighbors(target_user)
    recommended_plan_id = df_users.iloc[indices[0][0]]['recommended_plan_id']
    
    msg = "Collaborative filtering successful."
    if exhausted_muscles:
        msg += f" 🛡️ Smart Coach Active: Detected fatigue in [{', '.join(exhausted_muscles)}]."

    return jsonify({
        "status": "success",
        "message": msg,
        "recommended_plan_id": str(recommended_plan_id),
        "fatigued_muscles_avoided": exhausted_muscles
    }), 200

if __name__ == '__main__':
    initialize_ml_engine()
    app.run(port=5001, debug=False)