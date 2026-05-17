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
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // Import new page
import ResetPasswordPage from "./pages/ResetPasswordPage"; // Import new page
import OurStory from "./pages/OurStory"; // Import the new OurStory page

// --- Main Feature Pages ---
import UserProfile from "./pages/UserProfile";
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
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Libre Baskerville', serif; }
        `}
      </style>
      <div style={{ fontFamily: "'Libre Baskerville', serif", width: "100%", height: "100%" }}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* New route */}
            <Route path="/reset-password" element={<ResetPasswordPage />} /> {/* New route */}
            <Route path="/register" element={<RegisterPage />} /> 
            <Route path='/OurStory' element={<OurStory/>}/>

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
      </div>
    </DarkModeProvider>
  );
}

export default App;