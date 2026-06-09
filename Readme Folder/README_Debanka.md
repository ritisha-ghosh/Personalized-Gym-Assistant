# BeFit - Adaptive Fitness & Nutrition Intelligence Platform

BeFit is a full-stack, intelligence-driven fitness ecosystem that leverages a hybrid architecture—combining a robust Node.js/Express backend with a high-performance Python Flask microservice—to deliver real-time, adaptive workout regimens and automated nutritional tracking. 

## 👤 Developer Profile
* **Name:** Debanka Samanta
* **Role:** Frontend UI Specialist & Intelligence Layer Engineer
* **Focus:** React Ecosystem, Responsive Execution Interfaces, Flask Microservice Optimization, Voice Integration

---

## 🛠️ System Architecture Overview
BeFit functions via an interconnected, dual-server framework engineered to maintain an ultra-low latency response rate (< 200ms):
1. **Client Layer (React.js):** A highly responsive, interactive UI utilizing Tailwind CSS, Lucide icons, and the native Web Speech API for seamless voice coaching.
2. **Orchestration Layer (Node.js & Express):** Manages user authentication (OTP-based validation), database schemas, route shielding middlewares, and proxies payload loops.
3. **Intelligence Layer (Python Flask):** Processes algorithmic computation including biological formulas (Harris-Benedict equation), custom data sanitization, and machine learning recommendations.

---

## 📅 Chronological Development Roadmap & Tasks

### Week 1: Python Microservice & UI Implementation
* **Intelligence Layer (30%):** Formulated and instantiated the foundational Python Flask microservice environment. Integrated the **Harris-Benedict Equation** to mathematically compute Basal Metabolic Rate (BMR):
  * *Male:* $BMR = 88.362 + 13.397W + 4.799H - 5.677A$
  * *Female:* $BMR = 447.593 + 9.247W + 3.098H - 4.330A$
* **Frontend UI (50%):** Engineered clean, semantic React components for `LoginPage.jsx` and `RegisterPage.jsx` integrated with strict dark-mode accessibility context.
* **Cross-Team Integration:** Collaborated closely with backend engineers to map the core service pathways for early-stage end-to-end integration connectivity.

### Week 2: Flask Microservice & Core UI Components
* **Intelligence:** Exposed scalable Flask REST endpoints (`/predict`, `/recommend-plan`) optimized to process structured POST request payloads seamlessly from the Node environment.
* **Frontend UI:** Constructed the comprehensive user bio-data intake wizard (`Input Assessment` form inside `RegisterPage.jsx`), collecting critical biometrics: Age, Height, Weight, and Target Fitness Intentions.
* **Cross-Team Integration:** Monitored and analyzed network payloads to establish data integrity verification loops passing data from the React interface down into the Python ecosystem.

### Week 3: Flask Service Hardening & UI Interactivity
* **Intelligence Layer (30%):** Refactored internal data sorting mechanisms within Flask to guarantee an average end-to-end response runtime beneath the strict **200ms project benchmark**.
* **Frontend UI (50%):** Formed the interactive `Workout Execution` UI utilizing checkable sets, dynamic repetitions, and automated rest interval allocations pulled straight from live database queries.
* **Frontend Validation:** Enforced real-time user validation inside assessment workflows to instantly catch and quarantine anomalous input ranges (e.g., negative weights or impossible age parameters) long before hitting analytical engines.

### Week 4: Responsive Execution UI & Error Handling
* **Frontend UI (50%):** Rolled out the interactive **Live Workout Mode** dashboard, providing a highly reactive view incorporating a state-driven automated rest-timer component to run dynamically between training cycles.
* **Intelligence Layer (30%):** Overhauled Python exception processing by constructing a customized `APIError` structural decorator class, safely standardizing error responses (e.g., `"Invalid BMI range"`) into pristine JSON formats digestible by the React client.

### Week 5: Mobile Responsiveness & Form Refinement
* **Frontend UI (50%):** Orchestrated a rigorous global CSS / Tailwind architecture review, resolving break-points to secure a flawless layout on a multitude of mobile screens used directly on gym floors.
* **Intelligence (30%):** Mitigated server wake-up lag and eliminated initial cold-start latency spikes by restructuring model pipelines and lazy-loading heavy analytic dependencies upon server instantiation.

### Week 6: UI Consistency & Responsive Design
* **Frontend Audit:** Conducted exhaustive rendering cross-examinations on the live training dash view spanning ultra-wide, standard desktop, tablet, and mobile device screen wrappers.
* **Asset Management:** Maintained project tracking accountability by compiling and capturing an end-to-end, high-fidelity deployment demonstration showcasing live analytical queries mapping across the full system data set.

### Week 7-8: Voice Integration & Adaptive UI
* **Voice-to-Text (Week 7):** Embedded the native browser **Web Speech API** context cleanly inside `ChatBot.jsx`. Enabled real-time vocal streaming captures allowing individuals to smoothly chat hands-free with the internal BeFit digital personal trainer.
* **Execution UI (Week 8):** Finalized the **Live Workout** user view execution grid by pairing real-time UI notification nodes, interactive motion breakdown modals, and real-time "Muscle Alert" safety logs when specific muscle groups show signs of overtraining.
* **Frontend State Architecture:** Constructed a robust State management system trackable across calendar sessions to visualize data trends across a dynamic 30-day continuous profile health matrix.
 
### 🚀 Added Task

#### 1. 🔐 Robust Registration Input Validation (Boundary Checks)
* **Problem:** Users were previously able to submit unrealistic, negative, or blank biological numbers during registration.
* **Solution:** Enhanced the registration form payload verification and integrated a rigorous multi-layered boundary defense system (`dietCalculator.js`) to enforce safe human physiological thresholds:
  * **Weight:** Minimum `30 kg` to Maximum `300 kg`. Prevents arbitrary accidental values like `10` or `20`.
  * **Height:** Minimum `100 cm` to Maximum `250 cm`.
  * **Age:** Minimum `10 years` to Maximum `100 years`.
* Extreme or erroneous boundaries are automatically clamped to standard safe limits, ensuring that calculated metrics like **BMR** and **TDEE** never hit impossible breakdown values.

#### 2. 🔌 Seamless End-to-End Authentication Sync
* **Problem:** Frontend-backend connection gaps causing authorization latency and persistent user login dropouts.
* **Solution:** Fixed `authController.js` logic and unified it with state configurations in `LoginPage.jsx`:
  * Connected global context dispatch securely via `login()` using localized authentication stores.
  * Synchronized proper multi-token routing handling with both JWT `accessToken` and long-term `refreshToken`.
  * Stripped outdated module handlers causing handshake/DNS validation delays to stabilize overall startup responsiveness.

#### 3. 🏋️‍♂️ Dynamic Interactive Workout Tracker & Progress Metric
* **Problem:** Static display of routines with non-functional tracking states.
* **Solution:** Completely overhauled the workout interaction loops on the Workout Dashboard:
  * Made routine completion check-boxes **fully functional** via standard react component hooks.
  * Introduced instant responsive **Dynamic Progress Completion Logic**. Checking an exercise automatically triggers progress step recalculations (e.g., executing 1 out of 4 movements dynamically updates UI metrics to reflect **`25% Workout Complete`**).
  * Tied interface click handlers directly to backend persistence responses to maintain historical validation accuracy.

#### 4. 🎛️ Fully Dynamic Personalization Profile Engine (`UserProfile.jsx`)
* **Problem:** Hardcoded user data representations or broken state syncs when loading the profile interface.
* **Solution:** Transformed the user management center to be entirely interactive and runtime-driven:
  * Wired state hooks to read straight from `/api/users/profile` endpoints upon page mounting.
  * Enabled instant form bindings mapping biological profiles (injuries, custom dietary structures like `noOnion` or `noGarlic`, goals, and physical statistics).
  * Built live multipart upload boundaries linking custom image payloads directly with clean asynchronous file buffers under Express routes. 

## 📊 Data Engineering & Preprocessing Pipeline

To fuel the "Smart Coach" recommendation microservice, a custom end-to-end data pipeline was designed and executed, spanning from generation to final serialization.

### 1. Dataset Generation
* **Workout Dataset:** Curated a custom repository of localized gym exercises categorized by target muscle groups, compounding variables, and multi-joint vs. isolation movements.
* **Nutrition Dataset:** Engineered an extensive macro/micronutrient mapping dataset reflecting caloric splits, macro distribution percentages (protein, carbs, fats), and dietary attributes (e.g., Vegetarian, No-Onion/No-Garlic options).

### 2. Data Cleaning & Feature Engineering (Python, Pandas, NumPy)
Because user inputs must map cleanly to model vectors, the data underwent strict processing:
* **Handling Incomplete Attributes:** Replaced or imputed missing qualitative metrics with baseline healthy reference distributions based on biological age and biological sex.
* **Categorical Encoding:** Converted text fields into standardized numerical matrices for mathematical proximity modeling.
  * *Experience Levels:* mapped sequentially (`Beginner` ➔ `1`, `Intermediate` ➔ `2`, `Advanced` ➔ `3`).
  * *Fitness Goals:* structurally vectorized (`Fat Loss` ➔ `1`, `Muscle Gain` ➔ `2`, `Maintenance` ➔ `3`).
* **Outlier Filtration:** Programmed restrictive verification constraints to automatically purge or clamp anomalies (e.g., preventing unrealistic heights, weights, or negative caloric limits) before data hit the model training phase.

### 3. Pipeline Integration & Serialization
* Preprocessed data frames were normalized and formatted into structures fully optimized for ingestion by the Python Flask microservice.
* This direct data serialization ensures sub-second response times when computing the mathematical distance between a live user's fitness profile and the curated workout matrix.

---

## 💻 Tech Stack Implemented

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React.js (v18), JavaScript (ES6+), React Router DOM |
| **Styling & Assets** | Tailwind CSS, Lucide React Icons, Material Symbols |
| **Data Visualization**| Recharts (Area Dynamics, Heatmaps) |
| **Voice Processing** | Web Speech API (SpeechRecognition Engine) |
| **Backend Core** | Node.js, Express.js, Axios Core Client |
| **Microservice** | Python 3, Flask, Flask-CORS, Joblib, Scikit-Learn |
| **Database/Auth** | MongoDB Mongoose ODM, JWT Access/Refresh tokens, NodeMailer OTP |

---

## 🚀 Installation and Deployment Guide

### Prerequisites
* Node.js (v16 or higher)
* Python (v3.8 or higher)
* MongoDB Local Instance or Atlas URI

### 1. Intelligence Microservice Setup (Flask)
```bash
# Navigate to the microservice layer directory
cd server/python-service

# Install python dependencies 
pip install flask flask-cors joblib scikit-learn

# Initialize the Flask microservice engine
python app.py