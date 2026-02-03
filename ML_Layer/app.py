from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app) # Allows the backend to talk to this server

# --- GLOBAL ERROR HANDLER ---
@app.errorhandler(Exception)
def handle_exception(e):
    """
    This function catches ANY error that happens in the logic
    and prevents the server from crashing.
    """
    # 1. Log the error for you (the developer) to see
    print(f"!!! CRITICAL ERROR: {str(e)}")

    # 2. Return a clean JSON response for the Frontend
    return jsonify({
        "status": "failed",
        "error_type": type(e).__name__,
        "message": "The AI Brain hit a snag. Please check your input data.",
        "details": str(e)
    }), 500


# --- 1. THE INTELLIGENCE (Training on Startup) ---
corpus = [
    "how to do deadlift form check",      # exercise_info
    "what is bench press",                # exercise_info
    "tell me about squats",               # exercise_info
    "suggest a diet for weight loss",     # diet_plan
    "how much protein do i need",         # diet_plan
    "what should i eat for bulk",         # diet_plan
    "track my workout for today",         # log_workout
    "i want to log my sets",              # log_workout
]
intents = ["exercise_info", "exercise_info", "exercise_info", "diet_plan", "diet_plan", "diet_plan", "log_workout", "log_workout"]

# "Train" the model instantly when server starts
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(corpus)

def predict_intent(text):
    text_vec = vectorizer.transform([text])
    similarities = cosine_similarity(text_vec, X)
    best_match_index = np.argmax(similarities)
    
    # Confidence Threshold (0.2 means 20% match)
    if similarities[0][best_match_index] < 0.2:
        return "unknown"
    return intents[best_match_index]

# --- 2. THE ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Validation Check: Ensure 'query' exists
        if not data or 'query' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing 'query' field in request body"
            }), 400
        
        user_query = data.get('query', '')
        
        # Run Intelligence
        intent = predict_intent(user_query)
        
        response = {
            "status": "success",
            "intent": intent,
            "confidence": "high" if intent != "unknown" else "low"
        }
        return jsonify(response), 200
        
    except KeyError as e:
        return jsonify({"error": f"Invalid data format: Missing key {str(e)}"}), 422
    except Exception as e:
        # This will trigger the global error handler above
        raise e

# --- 3. THE ADAPTIVE ENGINE (New Logic) ---
@app.route('/scale-difficulty', methods=['POST'])
def scale_difficulty():
    try:
        data = request.json

        # PROTECT: Check if plan exists and has exercises
        current_plan = data.get('plan', {})
        if not current_plan or 'exercises' not in current_plan:
            return jsonify({
                "status": "error",
                "message": "Cannot scale difficulty: No exercises found in the plan."
            }), 400
        

        current_plan = data.get('plan', {})
        avg_difficulty = data.get('average_difficulty', 5) # Default to 5 (Moderate)

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

    except TypeError:
        return jsonify({"error": "Difficulty must be a number between 1 and 10"}), 422
    except Exception as e:
        raise e


# =================================================
# 🔹 4. DIET PLAN ENGINE (NEW ADDITION)
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
    try:
        data = request.json

        if not data or "dietType" not in data:
            return jsonify({
                "status": "error",
                "message": "dietType is required"
            }), 400

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

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("🧠 AI Brain is active on port 5001...")
    app.run(port=5001, debug=True)
