# ML_Layer/classify_user.py
import sys
import json

def classify_user(data):
    """
    Simple Decision Tree Logic
    Inputs: experience_years, workout_frequency (days/week), goal
    """
    exp = data.get("experience_years", 0)
    freq = data.get("workout_frequency", 0)
    
    # LEVEL 1: Experience Check
    if exp < 1:
        level = "Beginner"
        focus = "Form & Consistency"
    elif exp < 3:
        # LEVEL 2: Frequency Check for Intermediates
        if freq >= 4:
            level = "Intermediate"
            focus = "Hypertrophy & Volume"
        else:
            level = "Beginner-Intermediate"
            focus = "Routine Building"
    else:
        # LEVEL 3: Advanced Logic
        level = "Advanced"
        focus = "Strength & Specialization"

    return {
        "user_id": data.get("user_id"),
        "classification": level,
        "recommended_focus": focus
    }

if __name__ == "__main__":
    try:
        # 1. Read input from Node.js (passed as stringified JSON)
        input_json = sys.argv[1]
        user_data = json.loads(input_json)
        
        # 2. Process data
        result = classify_user(user_data)
        
        # 3. Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        # Handle errors gracefully so Node doesn't crash
        error_response = {"error": str(e), "status": "failed"}
        print(json.dumps(error_response))