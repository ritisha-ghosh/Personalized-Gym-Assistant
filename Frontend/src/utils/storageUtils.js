/**
 * Local Storage Utility Functions
 * Handles all local storage operations for data persistence
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUTS: 'workouts',
  NUTRITION: 'nutrition',
  PROGRESSION: 'progression',
  SETTINGS: 'settings',
};

// ===== USER PROFILE =====
export const getUserProfile = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : getDefaultUserProfile();
};

export const saveUserProfile = (profileData) => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profileData));
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

// ===== WORKOUTS =====
export const getWorkouts = () => {
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  return data ? JSON.parse(data) : [];
};

export const addWorkout = (workout) => {
  const workouts = getWorkouts();
  const newWorkout = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...workout,
  };
  workouts.push(newWorkout);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  return newWorkout;
};

export const updateWorkout = (id, updates) => {
  const workouts = getWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  if (index !== -1) {
    workouts[index] = { ...workouts[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    return workouts[index];
  }
  return null;
};

export const deleteWorkout = (id) => {
  const workouts = getWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
  return true;
};

// ===== NUTRITION =====
export const getNutrition = () => {
  const data = localStorage.getItem(STORAGE_KEYS.NUTRITION);
  return data ? JSON.parse(data) : [];
};

export const addNutrition = (nutrition) => {
  const items = getNutrition();
  const newItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...nutrition,
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(items));
  return newItem;
};

export const deleteNutrition = (id) => {
  const items = getNutrition();
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(filtered));
  return true;
};

// ===== PROGRESSION =====
export const getProgression = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESSION);
  return data ? JSON.parse(data) : getDefaultProgression();
};

export const updateProgression = (progressionData) => {
  localStorage.setItem(STORAGE_KEYS.PROGRESSION, JSON.stringify(progressionData));
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

// ===== SETTINGS =====
export const getSettings = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : getDefaultSettings();
};

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
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

// ===== CLEAR ALL DATA =====
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
