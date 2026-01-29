# ##
## 🧠 Orchestration & Intelligence Layer – PulseAI System
### 👨‍💻 Developer: **Pritam Chakraborty**

---

# ##
## 📌 Weekly Task Progress Report

---

# ##
## ✅ Completed Tasks

---

# ##
## 🔹 Phase 1: Neural Bridge & System Orchestration (Week 1-2)

### 1. Node-Python "Bridge" Architecture
- Designed the primary communication channel between Backend (Node.js) and Intelligence Layer (Python).
- Initial Implementation: Used `child_process.spawn` for lightweight script execution.
- **Latency Optimization:** Conducted performance tests, achieving <200ms response time for basic classification tasks.
- **Error Handling:** Implemented fail-safe logic to prevent server crashes if the Python environment is unreachable.

---

### 2. User Classification Engine (Logic Layer)
- Developed `classify_user.py` using rule-based decision trees.
- **Logic:** Segments users into "Beginner," "Intermediate," or "Advanced" based on:
  - Experience Years
  - Workout Frequency
  - Primary Goal (Hypertrophy vs. Strength)
- **Output:** Returns structured JSON payloads for the frontend to personalize the UI.

---

# ##
## 🔹 Phase 2: The "Brain" Upgrade (Week 3)

### 3. Flask Microservice Transformation
- Upgraded the architecture from simple script spawning to a persistent **Flask Microservice** (running on Port 5001).
- **Why:** To support heavy ML models (NLP) without reloading them for every request.
- **Result:** Reduced model loading overhead from ~3s to 0s (instant inference).

---

### 4. NLP Intent Recognition (TF-IDF)
- Implemented Natural Language Processing (NLP) using `scikit-learn`.
- **Algorithm:** Term Frequency-Inverse Document Frequency (TF-IDF) + Cosine Similarity.
- **Function:** Instantly categorizes user chat queries into actionable intents:
  - `diet_plan` (e.g., "What should I eat?")
  - `exercise_info` (e.g., "How to do a deadlift?")
  - `log_workout` (e.g., "Track my bench press")
- **Confidence Scoring:** Added logic to reject queries with low confidence (<20%).

---

### 5. Full-Stack Integration (Axios + MongoDB)
- **Service Layer:** Replaced `spawn` with `axios` HTTP requests in `aiModelService.js`.
- **Database Logging:** Created `UserActivity` Mongoose schema to permanently store every user-AI interaction for future analysis.
- **End-to-End Testing:** Verified the complete flow:
  `User Request` → `Node API` → `MongoDB Log` → `Flask Brain` → `Response`.

---

# ##
## ⏳ Pending Task
- **Recommendation Engine:** Collaborative filtering logic to suggest specific workouts based on user history.

---

# ##
## 📊 Task Status Summary

| Task | Category | Status |
|------|----------|--------|
| Node-Python Bridge Architecture | Orchestration | ✅ Completed |
| User Classification Logic | Intelligence | ✅ Completed |
| Flask Microservice Setup | Backend/ML | ✅ Completed |
| NLP Intent Recognition (TF-IDF) | AI Model | ✅ Completed |
| UserActivity Schema & Logging | Database | ✅ Completed |
| Recommendation Engine | AI Model | ❌ Pending |

---

# ##
## 🧱 Tech Stack
- **Backend:** Node.js, Express.js, Axios
- **AI/ML:** Python, Flask, Scikit-learn, NumPy, Pandas
- **Database:** MongoDB Atlas, Mongoose
- **Tools:** Postman, PowerShell (Testing), Git/GitHub

---

# ##
## 📍 Notes
This module serves as the **central nervous system** of the application. Unlike standard CRUD features, this layer manages real-time communication between the application logic and the AI models, ensuring the "Personalized" aspect of the Gym Assistant is actually functional.