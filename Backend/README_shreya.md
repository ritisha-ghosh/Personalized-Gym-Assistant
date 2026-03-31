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