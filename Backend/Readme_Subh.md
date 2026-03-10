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

---

### 4. Secured Diet Calculation API
- JWT-protected API endpoint implemented
- Only authenticated users can access BMR & TDEE data
- API tested using Thunder Client

---

# ##
## 🔹 Day 2: DietPlan Entity & Macro Mapping

### 5. DietPlan Logic Implementation
- Implemented complete DietPlan calculation logic
- Harris-Benedict based TDEE mapped to daily calorie targets
- Goal-based calorie adjustment:
  - Muscle Gain → Calorie surplus
  - Fat Loss → Calorie deficit
  - Maintenance → No adjustment

---

### 6. Macronutrient Distribution
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

### 7. UserLog Enhancements
- Extended UserLog schema with `difficultyRating` (1–10)
- Difficulty rating acts as an AI sensor for workout feedback
- Logs capture:
  - Workout status (active, rest, injured, sick, missed)
  - Perceived workout difficulty
  - Timestamped history

---

### 8. Decision Tree Logic Implementation
- Implemented rule-based Decision Tree for weekly plan adjustment
- Inputs considered:
  - Average difficulty rating
  - Missed workout count
  - Injury / sickness status
  - User fitness goal
- Safety-first logic prioritizes injury prevention and adherence

---

### 9. Weekly Workout Plan Adjustment
- Added secure API endpoint for weekly plan evaluation
- System analyzes last 7 days of user logs
- Workout plan dynamically adjusted by:
  - Modifying exercise sets (volume)
  - Adjusting rest duration
  - Applying deload when required
- Exercise-level updates ensure granular personalization

---

### 10. Backend Architecture & Security Fixes
- Fixed UserLog creation to derive user identity from JWT
- Prevented client-side injection of user identifiers
- Maintained clean MVC separation:
  - Services → Decision Tree logic
  - Controllers → Workflow orchestration
  - Middleware → Authentication & validation

---

# ##
## 🔹 Day 4: Diet Preference & Python AI Integration

### 11. User Diet Preference Management
- Extended User schema to store diet preferences:
  - `dietType` (vegetarian / non-vegetarian)
  - `noOnion` (boolean)
  - `noGarlic` (boolean)
- Preferences persist across sessions
- Defaults applied to avoid breaking existing users

---

### 12. Python AI Diet Recommendation Engine
- Integrated Flask-based Python AI engine
- Added recipe-level filtering logic for:
  - Vegetarian diet
  - No-Onion constraint
  - No-Garlic constraint
- Filtering performed inside the AI layer to ensure intelligent food selection

---

### 13. Backend–ML Integration
- Backend sends diet preferences to Python AI server
- Python engine returns filtered recipe recommendations
- Backend combines:
  - BMR
  - TDEE
  - Macronutrient targets
  - AI-recommended recipes
- Ensures clean separation of concerns between nutrition logic and AI logic

---

# ##
## ⏳ Pending Task
- Advanced WorkoutPlan intelligence (progressive overload history)
- Automation via scheduled weekly execution (cron job)
- Expansion of diet rules (Jain, Vegan, allergy-based filtering)

---

# ##
## 🔹 Day 5: Now Your Protection Layers Look Like This


### Layer 1 → Mongoose Schema

- Prevents impossible biological values from entering DB.

### Layer 2 → Controller Validation

- Prevents incomplete profile calculation.

### Layer 3 → Calculator Clamp

- Even if DB is bypassed, engine clamps safely.

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
| Diet preference integration | ✅ Completed |
| Python AI recipe filtering | ✅ Completed |
| Conduct "Stress Tests" | ✅ Completed |
| WorkoutPlan intelligence v2 | ⏳ Pending |
|Tagged all exercises with muscle group metadata (e.g., chest, triceps, quads) to enable future Muscle Recovery Tracker logic for intelligent workout filtering.|  ✅ Completed |

---

# ##
## 🧱 Tech Stack
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- JWT  
- bcryptjs  
- Python (Flask)  
- scikit-learn  
- dotenv  
- Nodemon  

---

# ##
## 📍 Notes
The backend now integrates deterministic nutrition logic with a Python-based AI recommendation engine.  
Dietary preferences such as Vegetarian and No-Onion-No-Garlic are handled intelligently at the recipe level, ensuring cultural compatibility, personalization, and scalability for future dietary constraints.
