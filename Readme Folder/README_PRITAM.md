# 🧠 Orchestration & Intelligence Layer — BeFit System
**Developer:** Pritam Chakraborty
**System Role:** The Central Nervous System & Predictive Engine

---

## 🚀 System Overview

The **BeFit Intelligence Layer** is a standalone Python Flask microservice that serves as the AI core for the Personalized Gym Assistant. By pairing a high-performance Node.js backend orchestration layer with data-driven machine learning pipelines, the system transforms from a static tracking utility into a dynamic, contextual, self-correcting digital personal trainer.

```
[Node.js Backend (Port 5000)]
│
▼ (Axios HTTP Bridge / Fail-safe Retry)
[Python Flask Microservice (Port 5001)]
├── 🤖 NLP Intent Engine (TF-IDF + Decision Tree)
├── 🏋️‍♂️ Smart Coach Recommender (KNN Collaborative Filtering)
└── 📊 Adaptive Volume Scaler (Self-Correcting Feedback Loop)
```

---

## 🔥 Key Architectural Features (Fully Completed)

### 1. Node-Python "Bridge" Architecture & Fault Tolerance

- **Persistent Microservice Integration:** Upgraded from local script execution (`child_process.spawn`) to a persistent HTTP-based Flask service on `Port 5001`, driving model inference overhead from ~3 seconds down to **0ms (instant)**.
- **Resilient Retry Policy:** Configured `aiModelService.js` with an asynchronous retry loop. If the Flask microservice is sleeping or experiences a brief dropout, the system automatically waits 1000ms and retries up to 3 times before falling back to a graceful `system_maintenance` routing, eliminating application crashes.

### 2. NLP Intent Recognition & Advanced Fallbacks

- **Pipeline Mechanics:** Utilizes a custom-trained scikit-learn pipeline blending `TfidfVectorizer` (with automated English stop-word filtering) and a `DecisionTreeClassifier` to parse natural language queries.
- **Confidence Guardrails:** Implemented a strict 20% validation threshold. If an out-of-domain query (e.g., *"Capital of France"*) is submitted, the system flags the low similarity score and executes a graceful fallback message (`"I'm still learning..."`) instead of allowing model hallucinations.

### 3. Smart Coach & KNN Collaborative Filtering

- **Algorithmic Profiling:** Powered by an unsupervised `NearestNeighbors` algorithm utilizing a Euclidean distance metric.
- **Data Pipelines:** Consumes a cleaned user metric registry (`user_profiles_demo.csv`) mapping `Age`, `Weight (kg)`, `Profile Level`, and `Focus Goal`. Text features are automatically translated on-the-fly using a scikit-learn `LabelEncoder` to maintain strict data compatibility for mathematical modeling.
- **Contextual Fatigue Management:** Cross-references predictive profile targets with the user's active MongoDB log history to dynamically isolate and skip muscle groups suffering from acute fatigue.

### 4. Data-Driven Diet Engine

- **Dynamic Menu Generation:** Integrates a multi-feature filtering system running over `diet_dataset.csv`.
- **Macro Optimization:** Instead of passing static options, it parses user inputs for exact diet types (e.g., Keto, Vegan, Vegetarian) and body composition goals (e.g., Fat Loss, Muscle Gain) to compile comprehensive, calorie-tracked daily meal plans — Breakfast, Lunch, Pre-Workout, and Dinner.

### 5. Adaptive Difficulty Scaling (Self-Correcting AI)

- **Feedback Optimization:** Implemented a real-time reactive volume loop tied directly to updated Mongoose data schemas.
- **Autoscaling Volume:** Evaluates user-submitted performance difficulty ratings (1–10 scale):
  - If metrics signal an under-stimulated threshold (`< 4`): pushes volume **up by 10%**
  - If ratings indicate over-exertion or burnout (`> 8`): automatically **drops sets and reps** to facilitate safer athletic recovery

### 6. Security & Payload Validation Layer

- **Middleware Armor:** Secured the system ingest point with `validateWorkout.js` in Node.js.
- **Data Sanitization:** Intercepts incoming requests to block NoSQL injection vectors, verify datatypes, and prevent structural anomalies (such as negative rep tracking or corrupted object fields).

---

## 📊 Core Milestone Summary

| Module Component | Functional Category | Status |
| :--- | :--- | :---: |
| Node-Python Bridge Routing | Architecture / Orchestration | 🟢 Completed |
| User Categorization Logic | Intelligence Layer | 🟢 Completed |
| Persistent Flask Deployment | Systems Architecture | 🟢 Completed |
| NLP Intent Classification | Natural Language Processing | 🟢 Completed |
| Adaptive Volume Regulation | Self-Correcting Feedback Loops | 🟢 Completed |
| Payload Sanitization Middleware | System Integrity & Security | 🟢 Completed |
| Asynchronous Bridge Fault Tolerance | Resilience & Reliability | 🟢 Completed |
| Text Vectorization Stop-Word Refinements | Core AI Optimization | 🟢 Completed |
| KNN Collaborative Profile Filtering | Advanced Recommendation Engine | 🟢 Completed |
| Data-Driven Macro Meal Planner | Automated Personal Nutrition | 🟢 Completed |

---

## 🧱 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Orchestration** | Node.js, Express.js, Axios |
| **Intelligence & Analytics** | Python, Flask, Scikit-learn, NumPy, Pandas, Joblib |
| **Database** | MongoDB Atlas, Mongoose |
| **Dev & Testing** | Postman, PowerShell CLI, Git / GitHub |

---

## 🛠️ Execution & Model Retraining Guide

### 1. Retraining the ML Layer Models

Whenever `dataset.csv` or `user_profiles_demo.csv` receive updates, regenerate the production pickle files:

```bash
cd ML_Layer
python train_model.py
```

**Expected terminal output:**

```
🔄 Starting Dual ETL Pipeline...
📥 Extracting NLP data from dataset.csv...
⚙️  Transforming NLP text data...
🧠 Training Decision Tree Classifier...
📦 Pickling NLP models...
📥 Extracting User data from user_profiles_demo.csv...
⚙️  Transforming User metrics...
🧠 Training NearestNeighbors Recommender...
📦 Pickling KNN models...
✅ Dual ETL Process Complete! All 4 .pkl files are ready for production.
```

### 2. Spinning Up the Service

Launch the engine locally to host the internal APIs on Port 5001:

```bash
python app.py
```

---

## 📍 Architecture Notes

This module serves as the **central nervous system** of the BeFit application. It possesses full adaptive capabilities — the system evolves based on user performance data, mimicking a real-life coach. The architecture is fully resilient, capable of self-healing dropped connections and gracefully handling out-of-bounds user inputs without crashing.