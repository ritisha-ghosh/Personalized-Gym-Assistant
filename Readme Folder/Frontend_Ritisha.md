# 1. Link your project to the specific repository (only if you haven't done this yet)

git remote add origin https://github.com/Pritam7Chakraborty/Personalized-Gym-Assistant.git

# 2. Switch to the 'Ritisha' branch (or create it if it doesn't exist)

git checkout -b Ritisha

# 2. Rename the local branch from 'ritisha' to 'Ritisha'

git branch -m ritisha Ritisha

# 3. Add all your changes

git add .

# 4. Commit the changes

git commit -m "Register Schema Fix"

# 5. Push the code to the remote branch

# 5. Push the new branch and delete the old remote branch

git push -u origin Ritisha
git push origin --delete ritisha

# push full project

git checkout -b Ritisha
git add .
git commit -m "Register Schema Fix"
git push -u origin Ritisha


# Frontend And Backend run

npm run dev

# ml install

python -m pip install -r requirements.txt

# ML run

python app.py

# 🏋️ Personalized Gym Assistant - Frontend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Installation &amp; Setup](#installation--setup)
4. [Technologies Used](#technologies-used)
5. [Pages Documentation](#pages-documentation)
6. [Components Documentation](#components-documentation)
7. [Utilities Documentation](#utilities-documentation)
8. [Features](#features)
9. [Data Storage](#data-storage)
10. [API Integration](#api-integration)
11. [Deployment](#deployment)

---

## Project Overview

**Personalized Gym Assistant** is a comprehensive fitness management web application designed to help users track their workouts, monitor nutrition, analyze progression, and manage their fitness goals. The application features a modern, responsive UI built with React and Tailwind CSS, with local storage for data persistence.

### Key Features:

- 📊 Dashboard with real-time metrics
- 🏋️ Tutorial for new users
- 💪 Workout tracking and management
- 🍎 Nutrition monitoring with macro tracking
- 📈 Progression analytics with export capabilities
- 👤 User profile management with photo upload
- ⚙️ Customizable settings
- 💬 AI-powered chatbot assistance
- 📱 Fully responsive design

---

## Project Structure

```
Frontend/
├── src/
│   ├── assets/                 # Static assets (images, icons)
│   ├── componenets/            # Reusable UI components
│   │   ├── cards/              # Reusable card components
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TrainerInsight.jsx
│   │   │   ├── WeeklyConsistency.jsx
│   │   │   ├── WeightTrendCard.jsx
│   │   │   └── WorkoutCard.jsx
│   │   ├── charts/             # Chart components
│   │   │   └── WeightTrendChart.jsx
│   │   ├── common/             # Shared UI components
│   │   │   └── ProgressRing.jsx
│   │   └── layout/             # Layout components
│   │       ├── Header.jsx
│   │       ├── Layout.jsx
│   │       └── Sidebar.jsx
│   ├── pages/                  # Page components
│   │   ├── ChatBot.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── Nutrition.jsx
│   │   ├── Progression.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── Settings.jsx
│   │   ├── Tutorial.jsx
│   │   ├── UserProfile.jsx
│   │   └── Workout.jsx
│   ├── utils/                  # Utility functions
│   │   ├── api.js              # API service utility
│   │   ├── storageUtils.js     # Local storage management
│   │   ├── pdfUtils.js         # PDF/Export functionality
│   │   └── fileUploadUtils.js  # File upload utilities
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles (Tailwind)
│   └── main.jsx                # Entry point
├── public/                     # Static files
├── api.js                      # API service 
├── README.md                   # Project README file
├── package.json                # Dependencies & scripts
├── package-lock.json           # Exact dependency versions
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── .gitignore                  # Specifies files for Git to ignore
└── eslint.config.js            # ESLint configuration

```

---

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd Frontend
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Step 3: Build for Production

```bash
npm run build
```

### Step 4: Preview Production Build

```bash
npm run preview
```

### Step 5: Lint Code

```bash
npm run lint
```

---

## Technologies Used

| Technology             | Purpose              | Version  |
| ---------------------- | -------------------- | -------- |
| **React**        | UI Framework         | ^19.1.0  |
| **React Router** | Navigation & Routing | ^7.12.0  |
| **Tailwind CSS** | Utility-first CSS    | ^3.4.19  |
| **Recharts**     | Data visualization   | ^3.7.0   |
| **Lucide React** | Icon library         | ^0.563.0 |
| **Vite**         | Build tool           | ^6.3.5   |
| **PostCSS**      | CSS processing       | ^8.5.6   |
| **ESLint**       | Code linting         | ^9.25.0  |

---

## Pages Documentation

### 1. **Landing Page** (`LandingPage.jsx`)

Main entry point of the application with introduction and call-to-action buttons.

**Features:**

- Hero section with app overview
- Feature highlights
- Call-to-action buttons (Login/Register)
- Responsive design

**Route:** `/`

---

### 2. **Login Page** (`LoginPage.jsx`)

User authentication page for existing users.

**Features:**

- Email/password input fields
- Form validation
- Remember me option
- Sign up link

**Route:** `/login`

---

### 3. **Register Page** (`RegisterPage.jsx`)

New user registration page.

**Features:**

- User information form
- Password strength indicator
- Terms & conditions
- Login link for existing users

**Route:** `/register`

---

### 4. **Dashboard** (`Dashboard.jsx`)

Central hub showing user fitness overview and metrics.

**Features:**

- Welcome greeting with time-based personalization
- Quick stats (weight, workouts, calories)
- Recent workouts display
- Weekly consistency chart
- Trainer insights
- Leaderboard
- Weight trend visualization

**State Management:**

```javascript
const [userProfile, setUserProfile] = useState(null);
const [recentWorkouts, setRecentWorkouts] = useState([]);
const [currentTime, setCurrentTime] = useState(new Date());
```

**Route:** `/dashboard`

**Data Sources:**

- User profile from local storage
- Recent workouts from storage
- Dynamic greeting based on time

---

### 5. **Workout** (`Workout.jsx`)

Complete workout management interface.

**Features:**

- Add new workouts with form
- Track sets, reps, duration
- View recent workouts (last 5)
- Delete workouts
- Weekly workout stats
- Tab switching (Current Week/Next Week)

**State Management:**

```javascript
const [workouts, setWorkouts] = useState([]);
const [showAddForm, setShowAddForm] = useState(false);
const [formData, setFormData] = useState({
  exercise: '',
  sets: '',
  reps: '',
  duration: '',
  notes: '',
});
```

**CRUD Operations:**

- **Create:** `addWorkout()` - Add new workout
- **Read:** `getWorkouts()` - Fetch all workouts
- **Delete:** `deleteWorkout()` - Remove workout

**Route:** `/workouts`

---

### 6. **Nutrition** (`Nutrition.jsx`)

Nutrition tracking and macro management.

**Features:**

- Add meals with calorie tracking
- Macro tracking (protein, carbs, fats)
- Daily calorie target vs consumed
- Remaining calories display
- Delete meals
- Macro distribution visualization
- Meal history

**State Management:**

```javascript
const [nutrition, setNutrition] = useState([]);
const [showAddForm, setShowAddForm] = useState(false);
const [formData, setFormData] = useState({
  meal: '',
  calories: '',
  protein: '',
  carbs: '',
  fats: '',
});
```

**Calculations:**

- Total calories consumed
- Total protein intake
- Remaining calorie budget

**Route:** `/nutrition`

---

### 7. **Progression** (`Progression.jsx`)

Analytics and progress tracking with export capabilities.

**Features:**

- Weight progress chart
- Lift statistics (Bench Press, Squat, Deadlift)
- Progress percentage tracking
- Growth indicators
- Time range selection (30 Days, 6 Months, Yearly)
- Export to JSON
- Export to CSV

**State Management:**

```javascript
const [timeRange, setTimeRange] = useState('6 Months');
const [weightData, setWeightData] = useState([]);
const [userProfile, setUserProfile] = useState(null);
```

**Export Functions:**

- `handleExportPDF()` - Export as JSON
- `handleExportCSV()` - Export as CSV

**Route:** `/progress`

---

### 8. **User Profile** (`UserProfile.jsx`)

User profile management and personal information.

**Features:**

- Profile picture upload & gallery
- Personal information editing (height, weight, bio)
- Fitness goals selection
- Injury tracking
- Profile image compression
- Save confirmation feedback
- Image validation

**State Management:**

```javascript
const [formData, setFormData] = useState({
  height: '178 cm',
  weight: '75 kg',
  bio: 'Training for my first marathon...',
});
const [profileImage, setProfileImage] = useState(null);
const [showGalleryModal, setShowGalleryModal] = useState(false);
const [saveStatus, setSaveStatus] = useState('');
const [uploadError, setUploadError] = useState('');
```

**Features:**

- Photo upload with validation
- Image gallery selection
- Profile picture compression
- Form validation
- Success/error notifications

**Route:** `/profile`

---

### 9. **Settings** (`Settings.jsx`)

Application settings and preferences.

**Features:**

- Account settings (name, email)
- Preference settings (units, language, theme)
- Notification preferences
- Security settings (2FA)
- Logout button linked to landing page

**State Management:**

```javascript
const [activeTab, setActiveTab] = useState('account');
const [formData, setFormData] = useState({
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex.rivera@example.com',
  units: 'Metric (kg/cm)',
  language: 'English (US)',
  theme: 'Light',
  emailNotifs: true,
  pushNotifs: true,
  marketingEmails: false,
  twoFactor: true,
});
```

**Tabs:**

- Account Settings
- Preferences
- Notifications
- Security

**Route:** `/settings`

---

### 10. **ChatBot** (`ChatBot.jsx`)

AI-powered assistance for fitness queries.

**Features:**

- Chat interface
- AI responses
- Fitness advice
- Question history

**Route:** `/chat`

---

## Components Documentation

### Layout Components

#### **Layout** (`componenets/layout/Layout.jsx`)

Main layout wrapper for all authenticated pages.

```jsx
<Layout>
  {/* Page content goes here */}
</Layout>
```

**Features:**

- Fixed sidebar navigation
- Header with user info
- Main content area
- Responsive design

**Props:**

- `children` - Page content

---

#### **Sidebar** (`componenets/layout/Sidebar.jsx`)

Navigation sidebar with menu items.

**Menu Items:**

- Dashboard
- Workouts
- Nutrition
- Progress
- Progression (NEW)
- Profile
- Settings
- Chat Bot
- Logout

**Features:**

- Active route highlighting
- Icons from lucide-react
- Logout button linking to landing page
- Responsive on mobile

---

#### **Header** (`componenets/layout/Header.jsx`)

Top navigation header.

**Features:**

- User information display
- Search functionality
- Notifications
- Profile dropdown

---

### Card Components

#### **StatCard** (`componenets/cards/StatCard.jsx`)

Displays statistics with icons and trends.

**Props:**

```javascript
{
  title: string,
  value: string,
  unit: string,
  footer: string,
  accent: string (Tailwind color class)
}
```

---

#### **WorkoutCard** (`componenets/cards/WorkoutCard.jsx`)

Displays individual workout details.

---

#### **WeightTrendCard** (`componenets/cards/WeightTrendCard.jsx`)

Shows weight progress visualization.

---

#### **WeeklyConsistency** (`componenets/cards/WeeklyConsistency.jsx`)

Weekly workout consistency display.

---

#### **TrainerInsight** (`componenets/cards/TrainerInsight.jsx`)

AI trainer insights and recommendations.

---

#### **Leaderboard** (`componenets/cards/Leaderboard.jsx`)

User leaderboard and rankings.

---

### Chart Components

#### **WeightTrendChart** (`componenets/charts/WeightTrendChart.jsx`)

Line chart showing weight progression using Recharts.

**Dependencies:**

- Recharts library
- Chart data format: `[{ day: string, actual: number, predicted: number }]`

---

### Common Components

#### **ProgressRing** (`componenets/common/ProgressRing.jsx`)

Circular progress indicator for metrics.

---

## Utilities Documentation

### Storage Utils (`src/utils/storageUtils.js`)

**Functions:**

#### User Profile

```javascript
// Get user profile
const profile = getUserProfile();

// Save user profile
saveUserProfile(profileData);
```

#### Workouts

```javascript
// Get all workouts
const workouts = getWorkouts();

// Add new workout
const newWorkout = addWorkout({ exercise, sets, reps, duration });

// Update workout
const updated = updateWorkout(id, updates);

// Delete workout
deleteWorkout(id);
```

#### Nutrition

```javascript
// Get nutrition entries
const meals = getNutrition();

// Add meal
const newMeal = addNutrition({ meal, calories, protein, carbs, fats });

// Delete meal
deleteNutrition(id);
```

#### Progression

```javascript
// Get progression data
const data = getProgression();

// Update progression
updateProgression(progressionData);
```

#### Settings

```javascript
// Get settings
const settings = getSettings();

// Save settings
saveSettings(settingsData);
```

---

### PDF Utils (`src/utils/pdfUtils.js`)

**Functions:**

```javascript
// Export data as JSON
downloadAsJSON(data, filename);

// Export data as CSV
downloadAsCSV(data, filename);

// Download file (generic)
downloadFile(blob, filename);

// Generate progression PDF
generateProgressionPDF(data, userName);

// Generate workout report
generateWorkoutPDF(workouts, userName);
```

**Example Usage:**

```javascript
import { downloadAsJSON, downloadAsCSV } from "../utils/pdfUtils";

// Export as JSON
downloadAsJSON(weightData, `progression_${Date.now()}.json`);

// Export as CSV
downloadAsCSV(workouts, `workouts_${Date.now()}.csv`);
```

---

### File Upload Utils (`src/utils/fileUploadUtils.js`)

**Functions:**

```javascript
// Validate image file
const validation = validateImageFile(file);
// Returns: { valid: boolean, errors: string[] }

// Read file as Data URL
const dataUrl = await readFileAsDataURL(file);

// Compress image
const compressed = await compressImage(file, 800, 800, 0.8);

// Upload to local storage
const result = await uploadImageToLocalStorage(file, storageKey);

// Get stored image
const url = getStoredImage(storageKey);

// Delete stored image
deleteStoredImage(storageKey);
```

**Validation Rules:**

- Allowed types: JPEG, PNG, GIF, WebP
- Max file size: 5MB
- Image compression: 800x800px max, 0.8 quality

**Example Usage:**

```javascript
import { uploadImageToLocalStorage, validateImageFile } from "../utils/fileUploadUtils";

const file = e.target.files[0];
const validation = validateImageFile(file);

if (validation.valid) {
  const result = await uploadImageToLocalStorage(file, 'profile_image');
  if (result.success) {
    setProfileImage(result.url);
  }
}
```

---

## Features

### ✅ Core Features

1. **User Authentication**

   - Login/Register pages
   - Session management
2. **Dashboard**

   - Real-time metrics
   - Recent workouts
   - AI trainer insights
   - Leaderboard
3. **Workout Tracking**

   - Add/delete workouts
   - Track sets, reps, duration
   - Workout history
   - Weekly statistics
4. **Nutrition Monitoring**

   - Add meals with macros
   - Calorie tracking
   - Daily target management
   - Macro distribution
5. **Progress Analytics**

   - Weight tracking chart
   - Lift progression
   - Export capabilities (JSON/CSV)
   - Time range selection
6. **Profile Management**

   - Photo upload with compression
   - Personal information
   - Fitness goals
   - Injury tracking
7. **Settings**

   - Account preferences
   - Notification settings
   - Security settings
   - Units & language
8. **AI ChatBot**

   - Fitness advice
   - Q&A assistance

### 📊 Data Visualization

- Line charts for weight progression
- Circular progress indicators
- Bar charts for lifts
- Weekly consistency visualization

### 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly interface

---

## Data Storage

### Local Storage Keys

All data is stored in browser's LocalStorage:

```javascript
// User Profile
localStorage.getItem('user_profile')

// Workouts
localStorage.getItem('workouts')

// Nutrition
localStorage.getItem('nutrition')

// Progression
localStorage.getItem('progression')

// Settings
localStorage.getItem('settings')

// Profile Image
localStorage.getItem('profile_image')
```

### Data Structure Examples

**User Profile:**

```javascript
{
  name: "Alex Rivera",
  email: "alex@example.com",
  height: "178 cm",
  weight: "75 kg",
  age: 28,
  goal: "Muscle Gain",
  profileImage: "data:image/...",
  level: 42,
  lastUpdated: "2026-01-26T10:30:00Z"
}
```

**Workout:**

```javascript
{
  id: 1704067200000,
  exercise: "Bench Press",
  sets: "4",
  reps: "8-10",
  duration: "45",
  notes: "Good form",
  createdAt: "2026-01-26T10:30:00Z"
}
```

**Nutrition:**

```javascript
{
  id: 1704067200000,
  meal: "Chicken Breast",
  calories: "350",
  protein: "45",
  carbs: "2",
  fats: "18",
  createdAt: "2026-01-26T12:00:00Z"
}
```

---

## API Integration

### Current Status

The project includes a centralized API utility module located at `src/utils/api.js` to handle all communication with the backend. This module uses `axios` and is pre-configured with a request interceptor to automatically attach the user's JWT authentication token to every outgoing request.

### API Utility (`src/utils/api.js`)

This file exports a pre-configured `axios` instance.

```javascript
// src/utils/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend URL

const api = axios.create({
  baseURL: API_URL, // All requests will be prefixed with this
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assumes token is stored here after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example exported functions for authentication
export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

export default api;
```

### Connecting Components to the Backend

To fetch or send data, import the `api` instance or specific functions from `src/utils/api.js` and use them within your components, typically inside a `useEffect` hook for fetching data.

**Example: Fetching user workouts in `Workout.jsx`**

```jsx
import { useEffect, useState } from 'react';
import api from '../utils/api'; // Import the configured axios instance

function Workout() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // The interceptor automatically adds the auth token
        const response = await api.get('/workouts/user'); 
        setWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
        // Handle error (e.g., show a notification)
      }
    };

    fetchWorkouts();
  }, []);

  // ... component JSX
}
```

The next step is to replace all calls to `storageUtils.js` with API calls using this `api` utility.

---

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
npm install gh-pages --save-dev
```

Update `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

Then run:

```bash
npm run deploy
```

---

## Performance Optimization

### Implemented:

- ✅ Code splitting with React Router
- ✅ Image compression in file uploads
- ✅ LocalStorage caching
- ✅ Responsive images
- ✅ CSS optimization with Tailwind

### Recommended:

- Lazy loading for images
- Service Workers for offline support
- Code minification (automatic with Vite)
- Gzip compression on server

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### Issue: Port 5173 already in use

```bash
npm run dev -- --port 3000
```

### Issue: Dependencies not installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind styles not loading

```bash
npm run build
npm run preview
```

### Issue: LocalStorage not persisting

- Check browser privacy settings
- Ensure localStorage is not disabled
- Check browser console for errors

---

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## License

This project is part of a Final Year Project.

---

## Support

For issues and questions:

- Check the documentation
- Review component props
- Check browser console for errors
- Verify data structure in localStorage

---

**Last Updated:** January 26, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
