# Backend Module - Gym & Fitness Assistant

## Developer: Shreya

---

## 📌 Weekly Task Progress Report

### ✅ Completed Tasks

### 1. Express.js Server Setup
- Initialized Express server
- Configured dotenv for environment variables
- Implemented MVC architecture
- Nodemon configured for development
- Server running successfully

### 2. Database Connection (MongoDB Atlas)
- Connected backend to MongoDB Atlas using Mongoose
- Implemented database connection module (`config/db.js`)
- Environment-based configuration using `.env`
- Verified successful database connection

### 3. User Database Schema
- Designed and implemented `User` schema
- Fields:
  - name  
  - email  
  - password (hashed)  
  - age  
  - weight  
  - height  
  - goal  
  - injury  
  - experience  
- MongoDB model created using Mongoose

### 4. Authentication System
- User signup API implemented
- User login API implemented
- Password hashing using `bcryptjs`
- JWT authentication using `jsonwebtoken`
- Token generation on login
- Secure authentication flow

### 5. API Architecture
- Controllers layer
- Routes layer
- Models layer
- Config layer
- Proper separation of concerns (MVC structure)

### 6. API Testing
- APIs tested using Thunder Client
- Signup API verified
- Login API verified
- JWT token generation confirmed

---

### 7. WorkoutPlan Schema & Model
- Implemented complete `WorkoutPlan` schema
- Fields include:
  - user reference
  - title
  - goal
  - experience level
  - duration
  - days per week
  - exercises (sets, reps, rest)
  - notes
- Integrated with MongoDB using Mongoose
- Model structured for scalability and AI/ML integration
- Fully connected with CRUD APIs

Status: ✅ Completed


---

---

## 🧱 Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- dotenv
- Nodemon

---
### Backend Architecture & Design
- MVC Architecture (Models, Controllers, Routes)
- REST API structure
- Modular backend design
- Schema-based database modeling
- Scalable backend structure

### Database Models Implemented
- User Model
- WorkoutPlan Model (schema & structure implemented)

## 📍 Notes
This backend module is designed to integrate with the existing frontend and ML modules in the project architecture.


📌 Weekly Task Progress Report (Week 2)

✅ Completed Tasks

1. User Logs System (CRUD Implementation)

Designed and implemented UserLog schema

Fields include:

user reference

status

date

notes

MongoDB model created using Mongoose

Structured for tracking user workout history and progress

2. WorkoutPlan CRUD Operations

Full CRUD functionality implemented for workout plans:

Create workout plan

Retrieve user-specific workout plans

Update workout plan

Delete workout plan

Integrated controllers, routes, and models

User-based data isolation using JWT authentication

3. User Logs CRUD Operations

Full CRUD functionality implemented for user logs:

Create user log

Retrieve user logs

Update log

Delete log

Secure access using JWT middleware

User-specific data handling

4. JWT Middleware Integration

Implemented authentication middleware

JWT token validation

Protected routes for:

Workout plans

User logs

Secure request authorization flow

Token-based access control

5. API Architecture Expansion

Extended MVC structure

Added modular controllers:

workoutController.js

logController.js

Added modular routes:

workoutRoutes.js

logRoutes.js

Clean separation of responsibilities

Scalable API design

6. Database Optimization

MongoDB indexing implemented for:

User logs

Historical workout data

Optimized query performance

Faster retrieval of user activity history

Scalable database structure for analytics and ML integration

7. API Testing & Validation

APIs tested using Thunder Client:

WorkoutPlan CRUD APIs ✅

UserLog CRUD APIs ✅

JWT protected routes ✅

Validation error handling tested

Server error handling verified

End-to-end request flow confirmed

📊 Task Status Summary (Week 2)
Task	Status
UserLog schema	✅ Completed
WorkoutPlan CRUD	✅ Completed
UserLog CRUD	✅ Completed
JWT middleware integration	✅ Completed
Route protection	✅ Completed
MongoDB indexing	✅ Completed
API testing	✅ Completed

🧱 Tech Stack Additions (Week 2 Only)

JWT Middleware

Secure Route Guards

MongoDB Indexing

Advanced CRUD API Design

Token-based Authorization Flow


🎯 Week 2 Status: ✅ Completed Successfully



📌 Week 3 – Backend Development Progress
✅ Work Completed

Implemented additional backend controllers to handle advanced features related to diet plans, workouts, and user logs.

Created and integrated new service-layer logic to keep business logic separate from controllers (improving code structure and maintainability).

Added diet calculation and planning services, including calorie and nutrition-related computations.

Integrated an AI-related service module to support intelligent or automated responses/calculations.

Expanded and refined MongoDB models for workout plans, diet plans, and user logs.

Added and updated API routes to support new backend features.

Ensured proper use of middleware for authentication and request handling.

Maintained a clean MVC architecture across the backend.

Updated documentation to reflect Week 3 progress.

🛠 Tech Stack Used

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

MVC Architecture


✨ Week 4 Progress Report – Backend Module
🔐 Authentication & Authorization Enhancements

During Week 4, I worked on strengthening the authentication system of the backend by implementing secure token-based authentication using JWT and Redis.

✅ Tasks Completed
1. JWT Authentication Flow

Implemented Access Token generation using JWT

Implemented Refresh Token mechanism for session persistence

Access tokens are used for protected routes

Refresh tokens are used to generate new access tokens without re-login

2. Refresh Token Implementation

Created Refresh Token Controller

Created Refresh Token Route

Refresh token is validated before issuing a new access token

Improved security by separating access and refresh token logic

3. Redis Integration

Integrated Redis to store refresh tokens securely

Redis server running on port 5000

Refresh tokens are saved and verified from Redis

Helps in token revocation and session management

4. User Model Updates

Updated User schema to include:

refreshToken field

Ensured proper handling of token storage and updates

5. API Testing

Tested authentication and refresh token flow using Thunder Client

Verified:

Login → Access + Refresh token generation

Refresh token → New access token issuance

Token validation and error handling

6. Code Quality & Structure

Followed MVC architecture

Controllers, routes, and services are well-separated

Used environment variables for secrets and configurations

🚀 Outcome

By the end of Week 4, the backend authentication system became more secure, scalable, and production-ready, supporting token refresh without forcing users to log in repeatedly.


✨ Week 5 Progress Report – Backend Module

## Backend Improvements – Logging Stability

To ensure stable MongoDB performance during high-volume logging, the following improvements were implemented:

- Added MongoDB connection pooling and timeout configuration in `config/db.js`.
- Implemented global error handling in `server.js` to prevent crashes during heavy logging.
- Optimized log operations in `controllers/logController.js`.
- Added indexed schema (`user + date`) in `models/UserLog.js` for faster log retrieval.
- Improved validation and error handling for log creation APIs.
