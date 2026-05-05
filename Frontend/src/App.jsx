import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import './index.css';
import './dark-mode.css';

// --- Context Providers ---
import { DarkModeProvider } from "./context/DarkModeContext";

// --- Auth & Landing Pages ---
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";

// --- Main Feature Pages ---
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Nutrition from './pages/Nutrition'; // Matches your file: Nutrition.jsx
import Settings from './pages/Settings';
import Progression from './pages/Progression';
import ChatBot from './pages/ChatBot';
import Tutorial from "./pages/Tutorial";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected / App Routes */}
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/profile" element={<UserProfile />} />
          <Route path='/workouts' element={<Workout/>}/>
          <Route path='/tutorial' element={<Tutorial/>}/>
          <Route path='/nutrition' element={<Nutrition/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/progress' element={<Progression/>}/>
          <Route path='/chat' element={<ChatBot/>}/>
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;