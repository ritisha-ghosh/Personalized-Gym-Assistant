# 🏋️ Personalized Gym Assistant  
### A Web + ML Ecosystem

## 📌 Project Overview

The **Personalized Gym Assistant** is an intelligent digital ecosystem designed to democratize access to personalized fitness coaching.  
Unlike static fitness applications, this system utilizes **user-specific bio-data** such as BMI, fitness goals, and experience level to generate **dynamic workout and nutrition plans** through a hybrid methodology combining **deterministic logic** and **probabilistic Machine Learning models**.

---

## ✨ Key Features

### 🔁 Adaptive Recommendation Engine
- Dynamically adjusts workout **sets and reps**
- Supports **Bulking** and **Cutting** goals
- Evolves plans based on user progress

### 🧠 Intelligence Layer
- Python-based microservice
- Uses **K-Means Clustering** for user classification

### 💬 NLP Trainer Bot
- Integrated chatbot for real-time fitness query resolution

### 📊 Smart Dashboard
- Visualizes health metrics and weight trends
- Enhances tracking and motivation

---

## 🏗️ System Architecture

The system follows a **modular four-layer architecture** to ensure scalability and low-latency performance (**< 200ms**).

- **Presentation Layer:** React.js Single Page Application (SPA)
- **Application Layer:** Node.js & Express acting as the API Gateway
- **Intelligence Layer:** Python Flask microservice for ML and NLP processing
- **Data Layer:** MongoDB for flexible NoSQL schema management

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js (HTML5, CSS3, JavaScript)

**Backend:**  
- Node.js, Express.js

**Database:**  
- MongoDB (Mongoose ODM)

**ML / Intelligence:**  
- Python, Pandas, Scikit-learn, Flask

**Integration:**  
- `child_process.spawn` for Node–Python orchestration

---

## 👥 Team & Contribution Matrix

This project is developed by a specialized team from **Techno Bengal Institute of Technology**, following a strategic partnership-based contribution model.

| Team Member | Primary Focus | Contribution & Role Split |
|------------|--------------|---------------------------|
| **Pritam Chakraborty** | System Integration & Orchestration | System Orchestration (100%), Backend Support (10%), Intelligence Layer (30%) |
| **Shreya Sarkar** | Backend & Data Visualization | Backend Lead (60%), Dashboard Visualization (40%) |
| **Subham Roy** | Frontend Dashboard & Clustering | Frontend Lead – Dashboard & Viz (60%), Intelligence Layer (30%) |
| **Debanka Samanta** | UI & Intelligence | Frontend UI (50%), Intelligence Layer (30%) |
| **Ritisha Ghosh** | Documentation & UI Support | Documentation & UI (50%), Backend Support (30%) |

> **Note:**  
> - The **Intelligence Layer** is collaboratively developed by **Debanka, Pritam, and Subham (30% each)** with **Gemini AI contributing 10% as an assistive tool**.  
> - **System Integration & Orchestration** (Node.js ↔ Python bridge) is fully owned by **Pritam Chakraborty**.

---

## 🚀 Roadmap

- **Phase 1:** Core Foundation & Database Schema (Days 1–15)
- **Phase 2:** ML Model Integration & API Bridging (Days 16–30)
- **Phase 3:** Visualization, Testing & Final Deployment (Days 31–45)

---

## 📝 License

This project is developed **strictly for academic purposes** as part of the  
**B.Tech CSE – 7th Semester Curriculum (2025–26)**.
