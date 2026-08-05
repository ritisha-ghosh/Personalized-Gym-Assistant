# Orchestration and Intelligence Layer — BeFit System

**Developer:** Pritam Chakraborty
**System Role:** Central Coordination and Predictive Engine

---

## System Overview

The BeFit Intelligence Layer is a standalone Python Flask microservice that functions as the AI core of the Personalized Gym Assistant. By pairing a high-performance Node.js orchestration layer with data-driven machine learning pipelines and a low-latency cloud LLM, the system operates as a dynamic, contextual, and medically-aware digital personal trainer rather than a static tracking utility.

---

## Architecture

```text
Node.js Backend (Render Container)
        │
        ▼  Axios HTTP Bridge with Fail-Safe Retry Logic
Python Flask Microservice (Render Container)
        ├── NLP Intent Router — Lightweight TF-IDF Classifier
        ├── Generative AI Engine — Groq Cloud API, Llama 3.1 RAG Pipeline
        ├── Medical Knowledge Graph — Dynamic Disease and Injury Mutators
        ├── Smart Coach Recommender — KNN Collaborative Filtering
        └── Adaptive Volume Scaler — Self-Correcting Feedback Loop
```

---

## Component Responsibilities

| Component | Function |
|---|---|
| **NLP Intent Router** | Classifies incoming user queries using a lightweight TF-IDF model to determine intent and route requests to the appropriate downstream service. |
| **Generative AI Engine** | Powers conversational coaching responses via the Groq Cloud API, using a Llama 3.1-based Retrieval-Augmented Generation (RAG) pipeline for contextually grounded output. |
| **Medical Knowledge Graph** | Applies dynamic mutators that adjust training and nutrition recommendations based on user-reported medical conditions and injuries. |
| **Smart Coach Recommender** | Generates personalized training profiles using K-Nearest Neighbors (KNN) collaborative filtering against comparable user cohorts. |
| **Adaptive Volume Scaler** | Continuously recalibrates workout volume through a self-correcting feedback loop driven by user difficulty ratings and recovery data. |

---

## Integration Model

The Node.js backend communicates with the Flask microservice over an internal HTTP bridge implemented with Axios. This bridge includes fail-safe retry logic to maintain system resilience in the event of transient network or service-availability issues, ensuring the orchestration layer degrades gracefully rather than failing outright when the intelligence layer is temporarily unreachable.