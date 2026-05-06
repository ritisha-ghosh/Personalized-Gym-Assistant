/**
 * Local Storage Utility Functions - USER-SPECIFIC
 * Each user's data is isolated and stored with their userId
 */

// Helper to get YYYY-MM-DD from a Date object, respecting local timezone
const toYYYYMMDD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ===== HELPER: Generate User-Specific Keys =====
const getUserStorageKey = (userId, dataType) => {
  if (!userId) {
    console.warn('⚠️ No userId provided - data will not be saved per user');
    return dataType; // Fallback (shouldn't happen)
  }
  return `${userId}_${dataType}`;
};

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUTS: 'workouts',
  NUTRITION: 'nutrition',
  PROGRESSION: 'progression',
  SETTINGS: 'settings',
  LOGIN_DATES: 'login_dates',
};

// ===== USER PROFILE =====
export const getUserProfile = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.USER_PROFILE);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : getDefaultUserProfile();
};

export const saveUserProfile = (userId, profileData) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.USER_PROFILE);
  localStorage.setItem(key, JSON.stringify(profileData));
  console.log(`✅ Profile saved for user ${userId}`);
  return profileData;
};

const getDefaultUserProfile = () => ({
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  height: '178 cm',
  weight: '75 kg',
  age: 28,
  goal: 'Muscle Gain',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop',
  joinDate: 'Jan 2023',
  level: 42,
  bio: 'Training for fitness goals',
});

// ===== WORKOUTS - USER-SPECIFIC =====
export const getWorkouts = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.WORKOUTS);
  const data = localStorage.getItem(key);
  console.log(`📥 Getting workouts for user ${userId}: ${data ? JSON.parse(data).length : 0} items`);
  return data ? JSON.parse(data) : [];
};

export const addWorkout = (userId, workout) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.WORKOUTS);
  const workouts = getWorkouts(userId);
  const newWorkout = {
    id: Date.now(),
    userId: userId, // 👈 Store userId with data
    createdAt: new Date().toISOString(),
    ...workout,
  };
  workouts.push(newWorkout);
  localStorage.setItem(key, JSON.stringify(workouts));
  console.log(`✅ Workout added for user ${userId}`);
  return newWorkout;
};

export const updateWorkout = (userId, id, updates) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.WORKOUTS);
  const workouts = getWorkouts(userId);
  const index = workouts.findIndex(w => w.id === id);
  if (index !== -1) {
    workouts[index] = { ...workouts[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(workouts));
    console.log(`✅ Workout updated for user ${userId}`);
    return workouts[index];
  }
  return null;
};

export const deleteWorkout = (userId, id) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.WORKOUTS);
  const workouts = getWorkouts(userId);
  const filtered = workouts.filter(w => w.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
  console.log(`✅ Workout deleted for user ${userId}`);
  return true;
};

// ===== NUTRITION - USER-SPECIFIC =====
export const getNutrition = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.NUTRITION);
  const data = localStorage.getItem(key);
  console.log(`📥 Getting nutrition for user ${userId}: ${data ? JSON.parse(data).length : 0} items`);
  return data ? JSON.parse(data) : [];
};

export const addNutrition = (userId, nutrition) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.NUTRITION);
  const items = getNutrition(userId);
  const newItem = {
    id: Date.now(),
    userId: userId, // 👈 Store userId with data
    createdAt: new Date().toISOString(),
    ...nutrition,
  };
  items.push(newItem);
  localStorage.setItem(key, JSON.stringify(items));
  console.log(`✅ Meal added for user ${userId}`);
  return newItem;
};

export const deleteNutrition = (userId, id) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.NUTRITION);
  const items = getNutrition(userId);
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
  console.log(`✅ Meal deleted for user ${userId}`);
  return true;
};

// ===== PROGRESSION - USER-SPECIFIC =====
export const getProgression = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.PROGRESSION);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : getDefaultProgression();
};

export const updateProgression = (userId, progressionData) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.PROGRESSION);
  localStorage.setItem(key, JSON.stringify(progressionData));
  console.log(`✅ Progression updated for user ${userId}`);
  return progressionData;
};

const getDefaultProgression = () => ({
  weightData: [
    { month: 'JAN', weight: 85.0 },
    { month: 'FEB', weight: 84.2 },
    { month: 'MAR', weight: 83.5 },
    { month: 'APR', weight: 81.8 },
    { month: 'MAY', weight: 79.5 },
    { month: 'JUN', weight: 78.4 },
  ],
});

// ===== SETTINGS - USER-SPECIFIC =====
export const getSettings = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.SETTINGS);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : getDefaultSettings();
};

export const saveSettings = (userId, settings) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.SETTINGS);
  localStorage.setItem(key, JSON.stringify(settings));
  console.log(`✅ Settings saved for user ${userId}`);
  return settings;
};

const getDefaultSettings = () => ({
  units: 'Metric (kg/cm)',
  language: 'English (US)',
  theme: 'Light',
  emailNotifs: true,
  pushNotifs: true,
  marketingEmails: false,
  twoFactor: true,
});

// ===== LOGIN TRACKING - USER-SPECIFIC =====
export const trackLogin = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.LOGIN_DATES);
  const loginDates = localStorage.getItem(key);
  const dates = loginDates ? JSON.parse(loginDates) : [];
  
  // Get today's date in YYYY-MM-DD format, respecting local timezone
  const today = toYYYYMMDD(new Date());
  
  // Only add if today's date is not already in the list
  if (!dates.includes(today)) {
    dates.push(today);
    localStorage.setItem(key, JSON.stringify(dates));
    console.log(`✅ Login tracked for user ${userId} on ${today}`);
  }
  
  return dates;
};

export const getLoginDates = (userId) => {
  const key = getUserStorageKey(userId, STORAGE_KEYS.LOGIN_DATES);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const getLoginHeatmapData = (userId) => {
  const loginDates = getLoginDates(userId);
  // Count logins per day for intensity visualization
  const loginCounts = {};
  loginDates.forEach(date => {
    loginCounts[date] = (loginCounts[date] || 0) + 1;
  });
  
  // Generate 365 day heatmap data
  const today = new Date();
  const heatmapData = [];
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = toYYYYMMDD(date); // Use local timezone-safe formatter
    heatmapData.push({
      date: dateStr,
      hasLogin: loginDates.includes(dateStr),
      count: loginCounts[dateStr] || 0,
    });
  }
  
  return heatmapData;
};

// ===== CLEAR USER-SPECIFIC DATA (When Logout) =====
export const clearUserData = (userId) => {
  Object.values(STORAGE_KEYS).forEach(dataType => {
    const key = getUserStorageKey(userId, dataType);
    localStorage.removeItem(key);
  });
  console.log(`✅ All data cleared for user ${userId}`);
};

// ===== CLEAR ALL DATA (Emergency) =====
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('🧹 All localStorage cleared');
};
