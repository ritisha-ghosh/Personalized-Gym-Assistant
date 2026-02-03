# ##
## 🏋️‍♂️ Backend Module – Gym & Fitness Assistant
### 👩‍💻 Developer: **Subham**

---

# ##
## 📌 Weekly Task Progress Report

---

# ##
## ✅ Completed Tasks

---

# ##
## 🔹 Day 1: Harris-Benedict & TDEE Implementation

### 1. Harris-Benedict Equation Implementation
- Implemented Harris-Benedict Equation logic in Node.js
- Gender-based BMR calculation (Male/Female)
- Inputs used:
  - Age  
  - Weight (kg)  
  - Height (cm)  
  - Gender  
- Logic implemented in a dedicated service layer

---

### 2. BMR (Basal Metabolic Rate) Calculation
- Accurate BMR calculation using standard Harris-Benedict formulas
- Rule-based, deterministic logic
- Ensures safe and consistent nutritional computation

---

### 3. TDEE (Total Daily Energy Expenditure) Calculation
- Implemented TDEE using activity multipliers
- Supported activity levels:
  - Sedentary  
  - Light  
  - Moderate  
  - Active  
  - Very Active  
- Formula used:


---

### 4. Secured Diet Calculation API
- JWT-protected API endpoint implemented
- Only authenticated users can access BMR & TDEE data
- API tested using Thunder Client

---

# ##
## 🔹 Day 2: DietPlan Entity & Macro Mapping

### 3. DietPlan Logic Implementation
- Implemented complete DietPlan calculation logic
- Harris-Benedict based TDEE mapped to daily calorie targets
- Goal-based calorie adjustment:
- Muscle Gain → Calorie surplus
- Fat Loss → Calorie deficit
- Maintenance → No adjustment

---

### 4. Macronutrient Distribution
- Protein calculated using bodyweight (2g/kg)
- Fat set to ~25% of total calories
- Remaining calories allocated to carbohydrates
- Output includes:
- Calories
- Protein (g)
- Carbohydrates (g)
- Fats (g)

---

# ##
## 🔹 Day 3: Decision Tree Recommendation Engine (Weekly Adjustment)

### 5. UserLog Enhancements
- Extended UserLog schema with `difficultyRating` (1–10)
- Difficulty rating acts as an AI sensor for workout feedback
- Logs capture:
- Workout status (active, rest, injured, sick, missed)
- Perceived workout difficulty
- Timestamped history

---

### 6. Decision Tree Logic Implementation
- Implemented rule-based Decision Tree for weekly plan adjustment
- Inputs considered:
- Average difficulty rating
- Missed workout count
- Injury / sickness status
- User fitness goal
- Safety-first logic prioritizes injury prevention and adherence

---

### 7. Weekly Workout Plan Adjustment
- Added secure API endpoint for weekly plan evaluation
- System analyzes last 7 days of user logs
- Workout plan dynamically adjusted by:
- Modifying exercise sets (volume)
- Adjusting rest duration
- Applying deload when required
- Exercise-level updates ensure granular personalization

---

### 8. Backend Architecture & Security Fixes
- Fixed UserLog creation to derive user identity from JWT
- Prevented client-side injection of user identifiers
- Maintained clean MVC separation:
- Services → Decision Tree logic
- Controllers → Workflow orchestration
- Middleware → Authentication & validation

---

# ##
## ⏳ Pending Task
- Advanced WorkoutPlan intelligence (progressive overload history)
- Automation via scheduled weekly execution (cron job)

---

# ##
## 📊 Task Status Summary

| Task | Status |
|------|--------|
| Harris-Benedict BMR logic | ✅ Completed |
| TDEE calculation | ✅ Completed |
| DietPlan macro logic | ✅ Completed |
| Decision Tree engine | ✅ Completed |
| Weekly plan adjustment API | ✅ Completed |
| UserLog schema enhancement | ✅ Completed |
| WorkoutPlan intelligence v2 | ⏳ Pending |

---

# ##
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

# ##
## 📍 Notes
The DietPlan module is implemented using rule-based nutritional formulas to ensure accuracy, safety, and reliability.  
The backend now supports full calorie and macronutrient computation and is ready to integrate with frontend dashboards and ML-based workout planning modules.
