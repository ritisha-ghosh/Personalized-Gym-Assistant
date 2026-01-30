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

### 2. User Classification Engine (Logic Layer)
- Developed `classify_user.py` using rule-based decision trees.
- **Logic:** Segments users into "Beginner," "Intermediate," or "Advanced" based on experience and frequency.
- **Output:** Returns structured JSON payloads for the frontend to personalize the UI.

---

# ##
## 🔹 Phase 2: The "Brain" Upgrade (Week 3)

### 3. Flask Microservice Transformation
- Upgraded architecture to a persistent **Flask Microservice** (Port 5001).
- **Why:** To support heavy ML models (NLP) without reloading them for every request.
- **Result:** Reduced model loading overhead from ~3s to 0s (instant inference).

### 4. NLP Intent Recognition (TF-IDF)
- Implemented Natural Language Processing (NLP) using `scikit-learn` (TF-IDF + Cosine Similarity).
- **Function:** Instantly categorizes user chat queries into actionable intents (e.g., `diet_plan`, `exercise_info`).
- **Confidence Scoring:** Added logic to reject queries with low confidence (<20%).

### 5. Full-Stack Integration (Axios + MongoDB)
- **Service Layer:** Replaced `spawn` with `axios` HTTP requests in `aiModelService.js`.
- **Database Logging:** Created `UserActivity` Mongoose schema to permanently store every user-AI interaction.

---

# ##
## 🔹 Phase 3: Adaptive Intelligence & Security (Week 4)

### 6. Adaptive Difficulty Engine (Self-Correcting AI)
- Implemented feedback loops in `ML_Layer/app.py`.
- **Logic:** The AI now listens to user feedback (1-10 difficulty rating).
  - If **"Too Easy" (<4):** Automatically increases volume (Sets/Reps) by 10%.
  - If **"Too Hard" (>8):** Automatically decreases volume to prevent burnout.
- **Impact:** Transforming the app from a static template generator to a dynamic personal trainer.

### 7. Security & Validation Layer
- Implemented **Middleware Guard** (`validateWorkout.js`) in Node.js.
- **Function:** Sanitizes all incoming workout data before it reaches the controller.
- **Security:** Prevents NoSQL injection and ensures data integrity (e.g., preventing negative reps or empty titles).

### 8. Schema Evolution
- Updated `UserLog` schema to include `difficultyRating`, enabling the data collection required for the Adaptive Engine.

---

# ##
## ⏳ Pending Task
- **Collaborative Filtering:** Advanced recommendation engine based on similar user profiles.

---

# ##
## 📊 Task Status Summary

| Task | Category | Status |
|------|----------|--------|
| Node-Python Bridge Architecture | Orchestration | ✅ Completed |
| User Classification Logic | Intelligence | ✅ Completed |
| Flask Microservice Setup | Backend/ML | ✅ Completed |
| NLP Intent Recognition | AI Model | ✅ Completed |
| Adaptive Difficulty Scaling | AI Model | ✅ Completed |
| Security Validation Middleware | System Integration | ✅ Completed |
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
This module serves as the **central nervous system** of the application. It now possesses **Adaptive Capabilities**, meaning the system evolves based on user performance, mimicking a real-life coach.