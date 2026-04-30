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








# Backend Module - Gym & Fitness Assistant

## 👩‍💻 Developer: Shreya

---

## 📌 Weekly Development Progress

---

## ✅ Week 1: Backend Setup & Authentication

### 🔧 Core Setup
- Initialized Express.js server
- Configured environment variables using `dotenv`
- Implemented MVC architecture (Models, Controllers, Routes)
- Setup Nodemon for development
- Server successfully running

### 🗄 Database Integration
- Connected backend to MongoDB Atlas using Mongoose
- Created database configuration module (`config/db.js`)
- Environment-based configuration using `.env`

### 👤 User Schema & Model
- Designed `User` schema with fields:
  - name, email, password (hashed)
  - age, weight, height
  - goal, injury, experience
- Created MongoDB model using Mongoose

### 🔐 Authentication System
- Implemented Signup and Login APIs
- Password hashing using `bcryptjs`
- JWT-based authentication using `jsonwebtoken`
- Token generation on login
- Secure authentication flow

### 🧪 Testing
- Tested APIs using Thunder Client
- Verified signup and login functionality
- Confirmed JWT token generation

---

## ✅ Week 2: Workout & User Logs System

### 🏋️ WorkoutPlan Module
- Designed and implemented `WorkoutPlan` schema
- Fields include:
  - user reference, title, goal, experience level
  - duration, days per week
  - exercises (sets, reps, rest)
  - notes
- Implemented full CRUD operations:
  - Create, Read, Update, Delete
- User-specific data handling using JWT

### 📊 User Logs Module
- Designed `UserLog` schema
- Fields include:
  - user reference, status, date, notes
- Implemented full CRUD operations
- Enabled tracking of user activity and workout history

### 🔐 Security & Middleware
- Implemented JWT authentication middleware
- Protected routes for:
  - Workout plans
  - User logs
- Ensured secure request handling

### ⚡ Database Optimization
- Added MongoDB indexing:
  - User logs
  - Workout data
- Improved query performance and scalability

### 🧪 Testing
- Verified all CRUD APIs using Thunder Client
- Tested validation and error handling
- Confirmed end-to-end request flow

---

## ✅ Week 3: Service Layer & Feature Expansion

### ⚙️ Backend Enhancements
- Added service layer to separate business logic from controllers
- Improved code maintainability and scalability

### 🥗 Diet & AI Features
- Implemented diet calculation and planning services
- Added calorie and nutrition-based computations
- Integrated AI-related service module for intelligent recommendations

### 📦 Model & API Expansion
- Expanded MongoDB models:
  - Workout plans
  - Diet plans
  - User logs
- Added new API routes for extended features

### 🏗 Architecture
- Maintained clean MVC structure
- Ensured proper middleware usage

---

## ✅ Week 4: Advanced Authentication & Security

### 🔐 JWT Authentication Upgrade
- Implemented Access Token and Refresh Token system
- Access tokens used for protected routes
- Refresh tokens used for session persistence

### 🔄 Refresh Token System
- Created refresh token controller and routes
- Enabled generation of new access tokens without re-login

### ⚡ Redis Integration
- Integrated Redis for secure storage of refresh tokens
- Enabled token validation and revocation
- Improved session management

### 👤 User Model Update
- Added `refreshToken` field to User schema

### 🧪 Testing
- Verified:
  - Login → Access + Refresh token generation
  - Refresh token → New access token
  - Token validation and error handling

### 🎯 Outcome
- Improved authentication security and scalability
- Enabled seamless user sessions

---

## ✅ Week 6: Logging Stability & Performance Optimization

### ⚡ Backend Improvements
- Implemented MongoDB connection pooling and timeout settings
- Added global error handling in `server.js`
- Optimized logging operations in `logController.js`

### 📊 Performance Optimization
- Added indexing (`user + date`) in `UserLog` model
- Improved query performance for log retrieval

### 🛡 Reliability
- Enhanced validation and error handling for log APIs
- Ensured stability during high-volume logging

---

## ✅ Week 7: User Log Analytics (Advanced Backend Logic)

### 🔧 Key Features
- Implemented MongoDB aggregation pipeline for last 48-hour logs
- Grouped logs by user for activity analysis
- Computed key metrics:
  - Latest user status
  - Average difficulty rating
  - Total activity count
  - Missed workout count

### 🔌 API Integration
- Added protected endpoint:
  - `GET /api/logs/last-48-hours`
- Integrated JWT authentication
- Secured API using Bearer tokens

### 🧪 Testing
- Tested using Thunder Client
- Verified:
  - Authentication flow
  - Data filtering (last 48 hours)
  - Aggregation accuracy

### 🎯 Outcome
- Enabled structured data for recovery logic
- Built foundation for AI-based recommendations

---

## 🧱 Tech Stack

- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- JWT Authentication  
- bcryptjs  
- Redis  
- dotenv  
- Nodemon  

---

## 🏗 Backend Architecture

- MVC Architecture (Models, Controllers, Routes)
- RESTful API design
- Modular and scalable backend structure
- Service-layer abstraction for business logic
- Schema-based database modeling

---

## 📍 Notes

This backend module is designed to integrate seamlessly with the frontend and ML layer, enabling intelligent fitness recommendations and recovery analysis.