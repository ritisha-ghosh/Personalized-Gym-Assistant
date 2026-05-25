# Frontend Module - Gym & Fitness Assistant

---

## 👩‍💻 Developer: Shreya

---

## 📌 Weekly Development Progress

---

## ✅ Week 1: Dashboard Charting Library Research & Frontend Analytics Setup

📊 Charting Library Research
Analyzed React-compatible charting libraries for dashboard visualization

Compared options including:
Recharts
Chart.js
ApexCharts
Victory

Evaluated based on:
Ease of React integration
Responsive design support
Performance efficiency
Customization capabilities
Dashboard UI suitability

🏆 Library Selection

Confirmed Recharts as the most suitable library for the project

Reasons for selection:
Built specifically for React applications
Component-based architecture
Lightweight and scalable
Supports responsive containers
Ideal for fitness dashboards and health analytics

📈 Existing Dashboard Implementation Review

Inspected and validated existing WeightTrendChart.jsx component

Verified usage of Recharts modules:
LineChart
Line
XAxis
YAxis
Tooltip
ResponsiveContainer

Confirmed implementation of:
Actual vs Predicted weight trend visualization
Responsive chart rendering
Interactive tooltip support
Clean dashboard styling integration

💡 Future Dashboard Expansion Planning

Identified additional health metrics suitable for visualization:
BMI progress trends
Calories burned analytics
Workout consistency charts
Weekly performance tracking
Nutrition progress metrics

🏗 Frontend Architecture Alignment

Ensured selected charting solution aligns with:
React.js Single Page Application structure
Reusable component-based UI system
Dashboard card layout design
Responsive frontend standards

🧪 Testing & Validation

Verified chart rendering in local development environment using Vite

Confirmed frontend dependencies installed successfully

Tested successful project execution using:
npm install
npm run dev

🎯 Outcome

Established Recharts as the official frontend analytics library

Validated existing chart dashboard implementation

Created foundation for future health metric dashboards and advanced visual analytics


## ✅ Week 2: Weight Trends Component Development

📈 Weight Trends Dashboard Component

Developed and validated the React-based Weight Trends component for the health dashboard to visualize user body-weight progression over time.

Implemented reusable WeightTrendChart.jsx component using Recharts.

📊 Mock Data Integration

Created mock dataset to simulate real database records for frontend development and testing.

Included sample metrics for:
Daily weight logs
Actual recorded weight
Predicted trend values

This prepared the component for future backend API and MongoDB integration.

🎨 UI & Visualization Features

Implemented responsive line chart visualization using:
LineChart
Line
XAxis
YAxis
Tooltip
ResponsiveContainer

Added:
Actual weight trend line
Predicted progress trend line
Interactive hover tooltips
Mobile-friendly responsive layout

🔄 Future Database Readiness

Structured chart data in JSON array format for easy replacement with live backend API responses.

Prepared component to integrate with:
MongoDB user logs
Backend analytics APIs
ML prediction services

🧪 Testing & Validation

Tested component rendering in local Vite environment.

Verified chart responsiveness and tooltip accuracy.

Confirmed mock data displayed correctly.

🎯 Outcome

Successfully established Weight Trends dashboard module using mock data and created a production-ready frontend component for future real-time health metric integration.


## ✅ Week 3: Dashboard API Integration & Live Weight Trends

🔗 Frontend–Backend Integration
Connected the React dashboard Weight Trends component to the protected Logs API for real-time data retrieval.

📊 Live Data Visualization
Replaced mock chart data with actual user log entries stored in MongoDB.
Displayed dynamic weight progress over time using Recharts LineChart.

🔐 Authentication Handling
Integrated JWT-based authorization in frontend requests using access tokens for secure API communication.

⚙️ Data Processing
Fetched log history, transformed API responses into chart-friendly format, and rendered timestamps with weight values.

🎨 UI Fixes & Stability
Resolved chart container sizing, rendering issues, token expiration handling, and response-format bugs.

🧪 Testing
Verified complete end-to-end flow:

User login authentication
Token-protected Logs API access
Live data fetch from backend
Weight chart rendering in dashboard

🎯 Outcome
Successfully completed real-time dashboard integration by converting the Weight Trends section from static mock visuals into a functional live analytics component.



## ✅ Week 4: Workout Heatmap & Streak View

📊 Smart Dashboard Enhancement  
Implemented Workout Heatmap component to visualize user workout consistency over the last 30 days.

🔥 Motivation Features  
Displayed active workout days and missed days using color-coded grid blocks.  
Added streak counter to show consecutive active workout days.

🎨 UI Development  
Built responsive dashboard widget using React and Tailwind CSS.

🧪 Testing  
Verified 30-day display logic, streak calculations, and dashboard rendering.

🎯 Outcome  
Improved user motivation and habit tracking through visual consistency analytics.



## ✅ Week 5: Goal Comparison Dashboard Chart

📊 Smart Dashboard Enhancement  
Implemented Goal Comparison chart to compare current user metrics with target fitness goals.

⚖️ Metrics Included  
Displayed current weight vs target weight.  
Calculated and compared current BMI vs target BMI.

📈 Visualization  
Built responsive comparison chart using Recharts BarChart.

🎯 Motivation Feature  
Highlighted remaining progress to help users track transformation goals.

🧪 Testing  
Verified calculations, chart rendering, and responsive dashboard layout.

🎯 Outcome  
Users can now visually monitor progress toward ideal weight and BMI targets.



## ✅ Week 6: AI Goal Comparison Chart Finalization

🤖 ML Model Integration
Connected the Smart Dashboard Goal Comparison feature with the trained Flask-based AI model running from the ML Layer.

📡 API Connectivity
Integrated frontend React components with the live AI endpoint:

POST /recommend-plan

Used real-time model output to dynamically determine personalized fitness targets.

📊 Goal Comparison Enhancements
Updated the Goal Comparison chart to visually compare:

Current Weight vs AI Recommended Target Weight
Current BMI vs AI Recommended Target BMI

⚡ Frontend Improvements
Implemented asynchronous API fetching using React useEffect() and fetch().

Added:

Loading state while AI response is processed
Error fallback handling
Dynamic chart rendering using Recharts

🧠 AI Personalization Logic
Used collaborative filtering recommendations from the trained model to assign realistic target metrics based on similar user profiles.

🧪 Testing & Validation
Verified:

Flask ML server startup on port 5001
Successful API communication with frontend
Correct chart rendering after receiving AI data
Responsive UI behavior across dashboard layout

🎯 Outcome
The Smart Dashboard now reflects intelligent AI-generated fitness goals instead of static values, making progress tracking more personalized and realistic.




🧱 Tech Stack

React.js
Vite
Recharts
Tailwind CSS
JavaScript (ES6+)

🏗 Frontend Architecture

Component-based UI development

Reusable dashboard widgets

Responsive SPA design

Modern frontend build pipeline using Vite

📍 Notes

This frontend analytics module is designed to integrate with backend APIs and ML-generated fitness insights, enabling real-time visualization of user progress, trends, and personalized gym performance metrics.




---




# Backend Module - Gym & Fitness Assistant

## 👩‍💻 Developer: Shreya

---

## 📌 Weekly Development Progress

---

### ✅ Week 1: Backend Setup & Authentication

#### 🔧 Core Setup

 Initialized Express.js server
 Configured environment variables using dotenv
 Implemented MVC architecture (Models, Controllers, Routes)
 Setup Nodemon for development
 Server configured and running successfully

#### 🗄 Database Integration

 Connected backend to MongoDB Atlas using Mongoose
 Created reusable database configuration module (config/db.js)
 Added environment-based configuration via .env

#### 👤 User Schema & Model

Designed User schema with:

name, email, password (hashed)
age, weight, height
goal, injury, experience

#### 🔐 Authentication System

 Built Signup and Login APIs
 Password hashing using bcryptjs
 Implemented JWT authentication using jsonwebtoken
 Added secure token generation and validation

#### 🧪 Testing

Verified all APIs using Thunder Client


### ✅ Week 2: Workout & User Logs System

#### 🏋️ WorkoutPlan Module

Designed and implemented WorkoutPlan schema:

user reference
goal
experience level
duration
exercises
notes

Implemented full CRUD operations:

Create
Read
Update
Delete

#### 📊 User Logs Module

Built UserLog schema for:

workout status
date
notes
user activity history

Implemented full CRUD operations.

#### 🔐 Security & Middleware

Added JWT authentication middleware
Protected workout and log routes

#### ⚡ Database Optimization

Added MongoDB indexes for faster queries


### ✅ Week 3: Service Layer & Feature Expansion

#### ⚙️ Backend Improvements

Added service layer architecture
Separated business logic from controllers

#### 🥗 Diet & AI Features

Implemented:

diet calculation service
calorie estimation logic
nutrition planning logic
AI recommendation 

#### 🏗 Architecture

Maintained scalable modular MVC structure


### ✅ Week 4: Advanced Authentication & Security

#### 🔐 Token Upgrade

Implemented:

Access Token system
Refresh Token system
Refresh Token Flow
Built refresh token route/controller
Enabled silent session renewal
Redis Integration

Integrated Redis for:

refresh token storage
token revocation
secure session handling

#### 👤 User Model Update

Added refreshToken field.


### ✅ Week 6: Logging Stability & Performance Optimization

#### ⚡ Backend Improvements

Added MongoDB connection pooling
Added timeout handling
Implemented global error handling in server.js

#### 📊 Optimization

Added compound index (user + date) in UserLog
Improved log retrieval speed

#### 🛡 Reliability

Improved validation and API stability


### ✅ Week 7: User Log Analytics

#### 🔧 Aggregation Logic

Built MongoDB aggregation for last 48-hour logs.

Generated:

latest user status
average difficulty
total logs
missed workout count
API

Created protected route:

GET /api/logs/last-48-hours

#### 🎯 Outcome

Established foundation for recovery intelligence and AI suggestions.


### ✅ Week 8: Recovery Tracker & Production Readiness

#### History Aggregation

Enhanced recovery tracking system with:

authenticated user filtering
last 48-hour log history
recovery analytics support
Improvements
professional API structure
cleaner aggregation responses
deployment-ready backend architecture


### ✅ Week 9: Live Dashboard Metrics API

#### Implemented new protected dashboard endpoint:

GET /api/dashboard/metrics

Features Added

Built live aggregation for:

#### 📅 Daily Metrics

total logs
average difficulty
status breakdown
latest weight

#### 📊 Weekly Trends

weekly activity chart data
average daily difficulty

#### 📈 Monthly Trends

monthly weight progression
duplicate same-day weight removal

#### 🧠 Performance Score

Calculated based on:

active days
missed days
difficulty rating

#### ⚡ Performance Optimization

Used Promise.all() for parallel DB queries

#### 🧪 Testing

Successfully tested using Thunder Client

#### 🎯 Result

Dashboard endpoint is fully production-ready for frontend chart integration.



## 🧱 Tech Stack

Node.js
Express.js
MongoDB Atlas
Mongoose
Redis
JWT
bcryptjs
dotenv
Nodemon
🏗 Architecture Highlights
MVC Architecture
RESTful APIs
Modular backend design
Service-layer abstraction
Scalable database schema design

## 📍 Final Note

This backend system is designed to integrate seamlessly with the frontend and ML layer, enabling intelligent fitness recommendations, personalized workout generation, recovery analysis, and live dashboard insights.


---

# Extras

## Implemented a complete Workout Tracking and Consistency System for the Personalized Gym Assistant project.

### Key Features Added:

Workout Completion Tracking
Users can now mark exercises as completed.
Workout progress updates dynamically based on completed exercises.
“Complete Workout” button only activates after all exercises are completed.
Workout Logging System
After completing a workout, logs are stored in MongoDB through backend APIs.
Workout data now persists across sessions.
Dynamic Weekly Consistency Tracker
Converted Weekly Consistency from a static UI component into a backend-connected feature.
Workout completion days are automatically highlighted based on real workout logs.
Weekly completed workout count updates dynamically.
Workout Heatmap Integration
Connected Workout Heatmap with backend workout logs.
Heatmap now reflects actual completed workout days.
Added workout streak calculation logic.
Authentication & API Fixes
Fixed protected route authentication issues.
Updated frontend token handling to use accessToken from localStorage.
Fixed invalid token issues causing 401 Unauthorized errors.
Error Handling Improvements
Added safer API response handling.
Prevented crashes caused by invalid or empty responses.
Added fallback checks before using array methods like .some().
User-Specific Workout Data
Workout history and logs are now user-specific.
Different users have separate workout records.

Backend APIs Used:

GET /api/logs
POST /api/logs
GET /api/workouts

### Frontend Components Updated:

Workout.jsx
WeeklyConsistency.jsx
WorkoutHeatmap.jsx
Dashboard.jsx

Current Workflow:

User completes exercises.
Workout progress updates dynamically.
User clicks “Complete Workout”.
Workout log gets stored in MongoDB.
Weekly consistency updates automatically.
Heatmap updates automatically.
Workout streak updates automatically.

Additional Notes:

This was an extra enhancement work beyond the initial static UI.
Multiple frontend components were converted into fully backend-connected dynamic features.
Improved real-time workout tracking experience for users.


## Dashboard Module – Completed Features 
### 1. Backend Integration for Dashboard

Connected dashboard frontend with backend APIs to fetch real-time user data.

Integrated:

/users/profile
/logs
/workouts/weekly-plan

This removed static/mock data and made the dashboard fully dynamic.

### 2. Dynamic User Profile Stats

Implemented dynamic stat cards for:

Current Weight
Goal
Height

All values now come directly from the backend database.

### 3. AI Greeting & Weekly Motivation

Built dynamic greeting logic based on current time:

Good Morning
Good Afternoon
Good Evening

Also added AI trainer messages based on weekly workout count.

Examples:

“Let’s start your first workout this week!”
“Great start! 2 workouts this week.”
“Amazing! 5 workouts this week. Keep it up!”

### 4. Weekly Workout Count Logic

Integrated workout logs to calculate:

workouts completed this week
weekly consistency tracking

Implemented logic using workout log timestamps.

### 5. Dynamic Today's Workout Card

Connected dashboard workout card to:
/workouts/weekly-plan

Implemented:

fetch today’s workout dynamically
display workout title dynamically
show workout progress:
0% before completion
100% after completion
sync dashboard with workout progress page

Now updates automatically every day based on backend plan.

Example:

Sunday → Full Body Pump
Monday → Chest & Triceps
Tuesday → Back & Biceps
6. Workout Completion Sync

Fixed issue where dashboard was showing:

0% after workout completion

Now:

reads backend completion state
updates dashboard instantly
Tech Stack Used



Dashboard module completed successfully.


## Workout Module Bug Fixes & Enhancements 

### Issue Fixed

Resolved frontend-backend integration issues in the Workout Module where the weekly workout plan was not loading correctly due to inconsistent API response keys and state handling.

Fixes Implemented
Fixed mismatch between backend response keys (weekPlan vs weeklyPlan) to ensure proper data rendering.
Updated frontend state handling to support both response formats for backward compatibility.
Corrected initial page load issue where workouts remained stuck on loading.
Verified manual refresh functionality for updated workout plans.
Ensured today’s workout, weekly cards, and complete workout flow now work correctly.
Added safer fallback handling to prevent undefined data errors.
Result

✅ Weekly workout plan loads successfully
✅ Today's workout displays correctly
✅ Workout completion flow works
✅ Frontend and backend now fully synced

Status: Completed and tested successfully.