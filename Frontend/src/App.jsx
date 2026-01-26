import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; // Preserving the css import from the remote branch
import './index.css';

// Imports from your current branch (HEAD)
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";

// Imports from the merged branch (origin/dev/subh)
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Neutrations from './pages/Neutrations';
import Settings from './pages/Settings';
import Progression from './pages/Progression';
import ChatBot from './pages/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Dashboard & Feature Routes */}
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/workouts' element={<Workout/>}/>
        <Route path='/nutrition' element={<Neutrations/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/progress' element={<Progression/>}/>
        <Route path='/chat' element={<ChatBot/>}/>
      </Routes>
    </Router>
  );
}

export default App;