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

### 5. DietPlan Logic Implementation
- Took ownership of complete DietPlan business logic
- Mapped Harris-Benedict based TDEE values to daily calorie targets
- Goal-based calorie adjustment implemented:
- Muscle Gain → Calorie surplus
- Fat Loss → Calorie deficit
- Maintenance → No adjustment

---

### 6. Macronutrient (Macro) Calculation
- Protein calculation based on body weight (2g/kg)
- Fat allocation set to approximately 25% of total calories
- Carbohydrates calculated from remaining calories
- Final output includes:
- Total Calories  
- Protein (g)  
- Carbohydrates (g)  
- Fats (g)

---

### 7. Backend Architecture Integration
- DietPlan logic placed inside service layer
- Controller integrates Day 1 (BMR/TDEE) and Day 2 (Macros)
- Proper MVC architecture maintained
- Authentication logic kept fully isolated

---

### 8. Secured DietPlan API
- Implemented JWT-protected DietPlan generation API
- Fetches user data securely from MongoDB
- Returns complete diet plan with calories and macros
- Tested using Thunder Client

---

# ##
## ⏳ Pending Task
- WorkoutPlan schema and model implementation

---

# ##
## 📊 Task Status Summary

| Task | Status |
|------|--------|
| Harris-Benedict BMR logic | ✅ Completed |
| TDEE calculation | ✅ Completed |
| Diet calculation API | ✅ Completed |
| DietPlan macro logic | ✅ Completed |
| Secured DietPlan API | ✅ Completed |
| WorkoutPlan schema | ❌ Pending |

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
