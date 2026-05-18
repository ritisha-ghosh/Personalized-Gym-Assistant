# 🏋️ BeFit - Personalized Gym Assistant
### An Adaptive Web & Machine Learning Fitness Ecosystem

## 📌 Project Overview

The **BeFit Personalized Gym Assistant** is an intelligent digital ecosystem designed to democratize access to personalized fitness coaching. 
Unlike static fitness applications, this system utilizes **user-specific bio-data** (BMI, fitness goals, experience level) and a **hybrid calculation engine**—combining deterministic biological algorithms (Harris-Benedict) with probabilistic Machine Learning models (KNN, TF-IDF)—to generate and adapt dynamic workout and nutrition plans.

---

## ✨ Key Features

### 🔁 Adaptive Recommendation Engine
- **Self-Correcting Volume:** Dynamically adjusts workout sets and reps based on weekly user difficulty ratings and recovery logs.
- **Smart Coach:** Utilizes **K-Nearest Neighbors (KNN) Collaborative Filtering** to match users with highly optimized training profiles.
- **Data-Driven Diet Automation:** Strict ML data-sandboxing instantly generates calorie-tracked meals respecting specific dietary boundaries (e.g., Vegan, No-Onion/Garlic).

### 🧠 Intelligence Microservice Layer
- Standalone Python Flask microservice (0ms latency bridge).
- Features rigorous ETL pipelines for dataset tagging and safety-clamp payload validation.

### 💬 NLP AI Coach with Voice Integration
- Natural Language Processing chatbot powered by **TF-IDF Vectorization** and a **Decision Tree Classifier**.
- Integrated with the browser's native **Web Speech API** for hands-free voice coaching.

### 📊 Smart Analytics Dashboard
- Live data visualization using **Recharts** (Weight Trends, Heatmaps, Workout Consistency).
- Tracks 48-hour historical recovery data to prevent overtraining.

---

## 🏗️ System Architecture

The system follows a highly resilient **modular four-layer architecture** designed for sub-200ms low-latency performance:

1. **Presentation Layer (Port 5173):** React.js Single Page Application (SPA) built with Vite and Tailwind CSS.
2. **Orchestration Layer (Port 5000):** Node.js & Express API Gateway handling OTP auth, JWT/Redis session security, and payload validation.
3. **Intelligence Layer (Port 5001):** Persistent Python Flask HTTP microservice for ML inference and NLP processing (connected via asynchronous Axios retry-loops).
4. **Data Layer:** MongoDB Atlas for flexible NoSQL schema management and dynamic log aggregation.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (v18), Vite, Tailwind CSS, Recharts, Lucide Icons.
* **Backend:** Node.js, Express.js, JWT (Access/Refresh Tokens), Redis, Nodemailer.
* **Database:** MongoDB (Mongoose ODM).
* **Intelligence Layer:** Python 3, Flask, Scikit-Learn, Pandas, Joblib.
* **Integration:** Axios HTTP Bridge (Replaced legacy `child_process.spawn`).

---

## 👥 Team & Domain Contribution Matrix

This project was engineered by a specialized full-stack development team from the **Bengal Institute of Technology**, following a strategic microservice contribution model.

| Team Member | Domain Contributions | Key Responsibilities |
| :--- | :--- | :--- |
| **Pritam Chakraborty**<br>*(Project Lead)* | **ML (60%)** <br> **Backend (10%)** | **ML Lead & Orchestration:** Engineered the core machine learning models, expanded NLP datasets, implemented strict data sandboxing, and built the Node-Python microservice bridge. |
| **Shreya Sarkar** | **Backend (60%)** <br> **Frontend (10%)** | **Backend Lead & Analytics:** Architected the Express/Mongo infrastructure, advanced JWT/Redis security, 48-hour aggregation pipelines, and core Recharts data visualization. |
| **Ritisha Ghosh** | **Frontend (50%)** <br> **Backend (5%)** | **Frontend Lead:** Engineered the core React UI architecture, dark mode, dynamic API data fetching, and handled comprehensive project documentation. |
| **Debanka Samanta** | **Frontend (40%)** <br> **ML (10%)** | **Execution UI:** Built the interactive Live Workout UI, integrated Web Speech API voice coaching, enforced frontend boundaries, and optimized Flask microservice latency. |
| **Subham Roy** | **ML (30%)** <br> **Backend (25%)** | **Math Engines & Data:** Programmed the Harris-Benedict BMR/TDEE math engines, Decision Tree feedback loops, and executed the ETL data mapping for the ML models. |

> **Note:** The architecture utilizes a hybrid approach, separating deterministic business logic (Node.js) from probabilistic machine learning operations (Python Flask) to ensure maximum scalability and fault tolerance.

---

## 🚀 Execution & Deployment

To launch the complete BeFit ecosystem locally, three terminal instances are required:

```bash
# 1. Start the React Frontend (Terminal 1)
cd Frontend
npm install
npm run dev

# 2. Start the Node.js API Gateway (Terminal 2)
cd Backend
npm install
npm run dev

# 3. Start the Python Intelligence Microservice (Terminal 3)
cd ML_Layer
pip install -r requirements.txt
python app.py

📝 License
This software was developed strictly for academic purposes as part of the B.Tech CSE – 8th Semester Curriculum (2025–26) at the Bengal Institute of Technology.