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

if __name__ == '__main__':
    print("🧠 AI Brain is active on port 5000...")
    app.run(port=5001, debug=True)