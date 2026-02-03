from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app) # Allows the backend to talk to this server

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
        data = request.json
        user_query = data.get('query', '')
        
        # Run Intelligence
        intent = predict_intent(user_query)
        
        response = {
            "status": "success",
            "intent": intent,
            "confidence": "high" if intent != "unknown" else "low"
        }
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 3. THE ADAPTIVE ENGINE (New Logic) ---
@app.route('/scale-difficulty', methods=['POST'])
def scale_difficulty():
    try:
        data = request.json
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

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🧠 AI Brain is active on port 5001...")
    app.run(port=5001, debug=True)