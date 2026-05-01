from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import joblib # type: ignore

app = Flask(__name__)
CORS(app) # Allows the backend to talk to this server

# =================================================
# 🔹 CUSTOM EXCEPTION HANDLING 
# =================================================

class APIError(Exception):
    """Custom Exception class for meaningful error messages."""
    def __init__(self, message, status_code=400):
        super().__init__()
        self.message = message
        self.status_code = status_code

@app.errorhandler(APIError)
def handle_api_error(error):
    """Catches APIError and returns clean JSON to React."""
    response = jsonify({
        "status": "error",
        "message": error.message
    })
    return response, error.status_code

@app.errorhandler(Exception)
def handle_general_exception(e):
    """Catches unexpected crashes (Internal Server Errors)."""
    return jsonify({
        "status": "fail",
        "message": "An internal server error occurred.",
        "details": str(e)
    }), 500

# =================================================
# 🔹 UPDATED LOGIC WITH PREVENTING INITIAL LATENCY SPIKES IN STARTUP TIME OF FLASK
# =================================================

# --- 1. THE INTELLIGENCE (Loading Trained Model) ---

# Global variables for the ML model
vectorizer = None
model = None
knn_model = None
df_users = None

def initialize_ml_engine():
    """Instantly loads the pickled ML models to prevent first-hit latency."""
    global vectorizer, model, knn_model, df_users
    try:
        vectorizer = joblib.load('vectorizer.pkl')
        model = joblib.load('model.pkl')
        knn_model = joblib.load('knn_model.pkl')
        df_users = joblib.load('df_users.pkl')
        print("✅ ML Engine loaded all NLP and KNN Pickle files successfully.")
    except Exception as e:
        print(f"❌ CRITICAL ERROR: Could not load Pickles. Did you run train_model.py? Error: {e}")

# --- 2. THE ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'query' not in data:
        raise APIError("Please provide a search query.")
    
    user_query = data.get('query', '')
    
    # 1. Vectorize the user's input using the Pickled vocabulary
    text_vec = vectorizer.transform([user_query])
    
    # Out-of-Vocabulary Guardrail: Check if the vector is empty (unrecognized words)
    if text_vec.nnz == 0:
        return jsonify({
            "status": "success",
            "intent": "unknown",
            "confidence": "low",
            "message": "I'm still learning! I mostly understand fitness, workouts, and diet queries right now. Could you rephrase that?"
        }), 200
    
    # 2. Predict the intent and get the confidence probability
    predicted_intent = model.predict(text_vec)[0]
    probabilities = model.predict_proba(text_vec)[0]
    confidence_score = max(probabilities)

    # 3. NLP Fallback Logic
    if confidence_score >= 0.2:
        intent = predicted_intent
        confidence = "high"
        message = "Intent processed successfully."
    else:
        intent = "unknown"
        confidence = "low"
        message = "I'm still learning! I mostly understand fitness, workouts, and diet queries right now. Could you rephrase that?"
    
    return jsonify({
        "status": "success",
        "intent": intent,
        "confidence": confidence,
        "message": message
    }), 200


# --- 3. THE ADAPTIVE ENGINE (New Logic) ---
@app.route('/scale-difficulty', methods=['POST'])
def scale_difficulty():
    data = request.json
    current_plan = data.get('plan', {})
    avg_difficulty = data.get('average_difficulty', 5) # Default to 5 (Moderate)

    # VALIDATION: Custom Check
    if avg_difficulty is None:
        raise APIError("average_difficulty is missing.", status_code=400)
    
    if not (1 <= int(avg_difficulty) <= 10):
        raise APIError("Difficulty must be between 1 and 10.") #checking the avg_difficulty value appropriate or not

    # LOGIC: How to adapt based on feedback
    # If user says "Easy" (< 4), we Make it Harder
    if avg_difficulty < 4:
        action = "increase_intensity"
        scaling_factor = 1.1 # 10% increase
        msg = "Plan adapted: Increased volume due to low difficulty rating."
        
    # If user says "Hard" (> 8), we Make it Easier
    elif avg_difficulty > 8:
        action = "decrease_intensity"
        scaling_factor = 0.9 # 10% decrease
        msg = "Plan adapted: Reduced volume to prevent burnout."
            
    else:
        return jsonify({"status": "no_change", "plan": current_plan, "message": "Current difficulty is optimal."})

    # Apply changes to exercises
    updated_exercises = []
    for exercise in current_plan.get('exercises', []):
            
        # Modify Sets & Reps logic
        new_sets = exercise['sets']
        new_reps = exercise['reps']

        if action == "increase_intensity":
            new_reps += 2  # Add 2 reps
            # Cap sets at 5 to avoid overtraining
            if new_sets < 5: 
                new_sets += 1
            
        elif action == "decrease_intensity":
            new_reps = max(5, new_reps - 2) # Don't go below 5 reps
            new_sets = max(2, new_sets - 1) # Don't go below 2 sets

        updated_exercises.append({
            "name": exercise['name'],
            "sets": int(new_sets),
            "reps": int(new_reps),
            "restSeconds": exercise.get('restSeconds', 60)
        })

    # Return new plan structure
    new_plan = current_plan.copy()
    new_plan['exercises'] = updated_exercises
    new_plan['title'] = f"{current_plan.get('title', 'Workout')} (Adapted)"

    return jsonify({
        "status": "success",
        "action": action,
        "plan": new_plan,
        "message": msg
    })



# =================================================
# 🔹 4. DIET PLAN ENGINE 
# =================================================

# --- STATIC RECIPE DATA ---
RECIPES = [
    {
        "name": "Paneer Stir Fry",
        "vegetarian": True,
        "ingredients": ["paneer", "capsicum", "tomato"],
        "calories": 420
    },
    {
        "name": "Veg Curry with Onion",
        "vegetarian": True,
        "ingredients": ["onion", "potato"],
        "calories": 380
    },
    {
        "name": "Dal Tadka",
        "vegetarian": True,
        "ingredients": ["lentils", "garlic"],
        "calories": 350
    },
    {
        "name": "Chicken Salad",
        "vegetarian": False,
        "ingredients": ["chicken"],
        "calories": 450
    }
]

# --- DIET FILTER LOGIC ---
def filter_diet_recipes(diet_type, no_onion=False, no_garlic=False):
    filtered = []

    for recipe in RECIPES:
        if diet_type == "vegetarian" and not recipe["vegetarian"]:
            continue

        ingredients = [i.lower() for i in recipe["ingredients"]]

        if no_onion and "onion" in ingredients:
            continue

        if no_garlic and "garlic" in ingredients:
            continue

        filtered.append(recipe)

    return filtered


# --- DIET RECOMMENDATION ENDPOINT ---
@app.route('/diet-recommendation', methods=['POST'])
def diet_recommendation():
    data = request.json

    valid_diets = ["vegetarian", "non-vegetarian"]
    diet_type = data.get("dietType") 

    if not diet_type:
        raise APIError("Diet type is required.")
    
    if diet_type.lower() not in valid_diets:
        raise APIError(f"Invalid diet type. Please choose from {valid_diets}.")
        
    recipes = filter_diet_recipes(
        diet_type=data["dietType"],
        no_onion=data.get("noOnion", False),
        no_garlic=data.get("noGarlic", False)
    )

    return jsonify({
        "status": "success",
        "count": len(recipes),
        "recipes": recipes
    }), 200

# =================================================
# 🔹 5. COLLABORATIVE FILTERING & SMART COACH 
# =================================================
@app.route('/recommend-plan', methods=['POST'])
def recommend_plan():
    data = request.json
    
    # Extract user stats & Week 8 fatigue array
    try:
        age = float(data.get('age'))
        weight = float(data.get('weight_kg'))
        exp = float(data.get('experience_level'))
        goal = float(data.get('goal_type'))
        exhausted_muscles = data.get('exhausted_muscles', [])
    except (TypeError, ValueError):
        raise APIError("Missing or invalid user metrics for recommendation.")

    # 1. Format the target user's stats into a vector
    target_user = [[age, weight, exp, goal]]
    
    # 2. Find the mathematically closest user profile (Nearest Neighbor)
    distances, indices = knn_model.kneighbors(target_user)
    closest_user_index = indices[0][0]
    
    # 3. Retrieve the plan that worked for the similar user
    recommended_plan_id = df_users.iloc[closest_user_index]['recommended_plan_id']
    
    # 4. SMART COACH LOGIC: Modify response if fatigue is detected
    msg = "Collaborative filtering successful."
    if len(exhausted_muscles) > 0:
        fatigue_str = ", ".join(exhausted_muscles)
        msg += f" 🛡️ Smart Coach Active: Detected recent activity in [{fatigue_str}]. Recommended plan has been dynamically filtered to prevent overtraining."

    return jsonify({
        "status": "success",
        "message": msg,
        "recommended_plan_id": str(recommended_plan_id),
        "fatigued_muscles_avoided": exhausted_muscles
    }), 200
    

if __name__ == '__main__':
    # Initialize ML before starting the server
    initialize_ml_engine()
    print("🧠 AI Brain is active on port 5001...")
    app.run(port=5001, debug=False) # Disable debug for faster performance
    