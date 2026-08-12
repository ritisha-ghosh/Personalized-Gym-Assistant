<<<<<<< HEAD
# 🏋️ BeFit - Personalized Workout And Diet Assistant
### An Adaptive Web & Machine Learning Fitness Ecosystem
============
# BeFit — Personalized Gym Assistant
>>>>>>> 2c18345d68e19bcc3f64c02c23a14201e1e75086

**An Adaptive Web and Machine Learning Fitness Platform**

---

## Executive Summary

BeFit is a full-stack digital fitness platform engineered to deliver personalized coaching at scale. The system moves beyond static, one-size-fits-all fitness applications by leveraging user-specific biometric data — including BMI, fitness goals, and experience level — in combination with a hybrid computation engine. This engine integrates deterministic physiological models (Harris-Benedict) with probabilistic machine learning models (K-Nearest Neighbors, TF-IDF) to generate and continuously adapt personalized workout and nutrition programs.

---

## Core Capabilities

### Adaptive Recommendation Engine
- **Self-Correcting Volume Management** — Automatically adjusts training sets and repetitions based on weekly user-reported difficulty and recovery data.
- **Collaborative Filtering Coach** — Applies K-Nearest Neighbors (KNN) modeling to align users with optimized training profiles derived from comparable user cohorts.
- **Automated Nutrition Planning** — Generates calorie-tracked meal plans within a controlled ML data pipeline, respecting individual dietary constraints (e.g., vegan, allergen exclusions).

### Intelligence Microservice Layer
- A dedicated Python Flask microservice functioning as a low-latency AI processing bridge.
- Incorporates structured ETL pipelines for dataset preparation and enforces payload validation for operational safety.

### Conversational AI Coach with Voice Integration
- A natural language processing chatbot powered by the Groq API with custom system-prompt engineering.
- Integrated with the browser's native Web Speech API to support hands-free, voice-guided coaching sessions.

### Analytics Dashboard
- Real-time data visualization built on Recharts, covering weight trends, workout heatmaps, and consistency tracking.
- Maintains a 48-hour rolling window of recovery data to support overtraining prevention.

---

## System Architecture

BeFit is built on a modular, multi-tier architecture designed for cloud deployment, fault isolation, and low-latency performance.

| Layer | Technology | Responsibility |
|---|---|---|
| **Presentation** | React.js (Vite, Tailwind CSS) | Single-page application hosted on Vercel |
| **Orchestration** | Node.js / Express | API gateway managing authentication (OTP, JWT), database connectivity, and environment routing; deployed via Docker on Render |
| **Intelligence** | Python / Flask | Persistent microservice for ML inference and AI processing; deployed via Docker on Render |
| **Data** | MongoDB Atlas | NoSQL data store for user records and activity logs |

---

## Technology Stack

**Frontend**
React.js (v18), Vite, Tailwind CSS, Recharts, Lucide Icons

**Backend**
Node.js (v20), Express.js, JWT (access/refresh token rotation)

**Database**
MongoDB (Mongoose ODM)

**Intelligence Layer**
Python 3.12, Flask, Scikit-Learn, Pandas, Groq API

**Deployment & Infrastructure**
Docker (Alpine and Slim images), Vercel, Render

---

## Deployment

The platform is fully containerized and supports both local development and distributed cloud deployment.

### Production Environment

The production system operates across three isolated cloud services:

- **Frontend** — Hosted on Vercel with environment-driven API routing.
- **Backend (Node.js)** — Containerized and deployed as a Render Web Service.
- **ML Engine (Python)** — Containerized and deployed as an independent Render microservice.

### Local Development

To run the platform locally, configure the required `.env` variables in each service directory, then execute the following in three separate terminal sessions:

**Terminal 1 — Frontend**
```bash
cd Frontend
npm install
npm run dev
```

**Terminal 2 — Backend (API Gateway)**
```bash
cd Backend
npm install
npm start
```

**Terminal 3 — Intelligence Microservice**
```bash
cd ML_Layer
pip install -r requirements.txt
python app.py
```

---

## License & Attribution

© 2025–2026 BeFit. All rights reserved.
