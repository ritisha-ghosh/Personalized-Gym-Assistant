# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import random

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
# 🔹 ML ENGINE INITIALIZATION
# =================================================

vectorizer = None
model = None
knn_model = None
df_users = None
df_diet = None

def initialize_ml_engine():
    global vectorizer, model, knn_model, df_users, df_diet
    load_errors = []
    try:
        vectorizer = joblib.load('vectorizer.pkl')
        print("✅ NLP vectorizer loaded.")
    except Exception as e:
        vectorizer = None
        load_errors.append(f"vectorizer.pkl: {e}")

    try:
        model = joblib.load('model.pkl')
        print("✅ NLP classifier model loaded.")
    except Exception as e:
        model = None
        load_errors.append(f"model.pkl: {e}")

    try:
        knn_model = joblib.load('knn_model.pkl')
        print("✅ KNN recommendation model loaded.")
    except Exception as e:
        knn_model = None
        load_errors.append(f"knn_model.pkl: {e}")

    try:
        df_users = joblib.load('df_users.pkl')
        print("✅ User recommendation dataset loaded.")
    except Exception as e:
        df_users = None
        load_errors.append(f"df_users.pkl: {e}")

    try:
        df_diet = pd.read_csv('diet_dataset.csv', encoding='latin1')
        print("🥗 Diet Dataset loaded successfully.")
    except Exception as e:
        df_diet = None
        load_errors.append(f"diet_dataset.csv: {e}")

    if load_errors:
        print("⚠️ ML Engine loaded with warnings:")
        for err in load_errors:
            print(f"  - {err}")

# =================================================
# 🔹 1. SMART CHATBOT (UPGRADED WITH CONTEXT & DIETS)
# =================================================

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'query' not in data:
        raise APIError("Please provide a search query.")
    
    # Check if query is enriched object from Node or simple string
    raw_input = data.get('query')
    context_muscles = []
    
    if isinstance(raw_input, dict):
        user_query = raw_input.get('userQuery', '')
        context_muscles = [m.lower() for m in raw_input.get('recentActivity', [])]
    else:
        user_query = str(raw_input)

    # NLP Processing
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

    # Default logic
    intent = predicted_intent if confidence_score >= 0.2 else "unknown"
    
    # 🧠 PRO MODE: CONTEXTUAL RESPONSE GENERATION
    personalized_msg = "How can I help you with your fitness journey today?"
    
    if intent == "workout_recommendation":
        if any(m in ["quads", "hamstrings", "legs"] for m in context_muscles):
            personalized_msg = "Since you hit legs recently, your quads and hamstrings need recovery. Let's focus on Upper Body (Chest/Back) or light mobility today."
        elif "chest" in context_muscles:
            personalized_msg = "I noticed you did a chest workout recently. Today would be a great day for a 'Pull' session focusing on Back and Biceps."
        else:
            personalized_msg = "You're fresh! A full-body session or high-intensity interval training would be perfect for your current energy levels."

    # NEW: Smart Diet Generation
    elif intent in ["diet_info", "diet_plan"]:
        if df_diet is not None and not df_diet.empty:
            user_message_lower = user_query.lower()
            filtered_diet = df_diet.copy()
            
            # 1. Filter by Diet Type
            if 'keto' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Diet Type'].str.contains('Keto', case=False, na=False)]
            elif 'vegan' in user_message_lower or 'vegetarian' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Diet Type'].str.contains('Vegan|Vegetarian', case=False, na=False)]
                
            # 2. Filter by Goal
            if 'loss' in user_message_lower or 'cut' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Focus Goal'].str.contains('Loss', case=False, na=False)]
            elif 'gain' in user_message_lower or 'bulk' in user_message_lower:
                filtered_diet = filtered_diet[filtered_diet['Focus Goal'].str.contains('Gain|Muscle', case=False, na=False)]

            # 3. Fallback
            if filtered_diet.empty:
                filtered_diet = df_diet

            # 4. Generate the Menu
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
# 🔹 3. DIET RECOMMENDATION ENGINE (DATA-DRIVEN)
# =================================================

@app.route('/diet-recommendation', methods=['POST'])
def diet_recommendation():
    data = request.json
    diet_type = data.get("dietType", "").lower()
    
    if df_diet is None or df_diet.empty:
        return jsonify({
            "status": "fallback",
            "message": "Diet database is temporarily unavailable. Returning default meal templates.",
            "weekly_plan": [
                {"day": day, "meals": [
                    {"type": "Breakfast", "food": "Oatmeal with fruits", "cal": "350 kcal"},
                    {"type": "Lunch", "food": "Grilled vegetables and quinoa", "cal": "500 kcal"},
                    {"type": "Pre-Workout", "food": "Banana and almonds", "cal": "200 kcal"},
                    {"type": "Dinner", "food": "Lentil soup and salad", "cal": "450 kcal"}
                ]} for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            ]
        }), 200

    filtered = df_diet.copy()
    
    # Filter for vegetarian/vegan if requested
    if diet_type and "non-veg" not in diet_type:
        filtered = filtered[filtered['Diet Type'].str.contains(diet_type, case=False, na=False)]
        
    if filtered.empty:
        filtered = df_diet # Fallback if filter is too strict

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
# 🔹 4. SMART COACH (KNN RECOVERY)
# =================================================

@app.route('/recommend-plan', methods=['POST'])
def recommend_plan():
    data = request.json
    if knn_model is None or df_users is None:
        return jsonify({
            "status": "fallback",
            "message": "ML recommendation engine is temporarily unavailable. Returning default plan variant.",
            "recommended_plan_id": "1",
            "fatigued_muscles_avoided": data.get('exhausted_muscles', [])
        }), 200
    try:
        target_user = [[float(data['age']), float(data['weight_kg']), float(data['experience_level']), float(data['goal_type'])]]
        exhausted_muscles = data.get('exhausted_muscles', [])
    except:
        raise APIError("Invalid user metrics.")

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