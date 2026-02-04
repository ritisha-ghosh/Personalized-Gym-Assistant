import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import './index.css';

// Imports from your current branch
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";

// Imports from the merged branch
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Nutrition from './pages/Nutrition';
import Settings from './pages/Settings';
import Progression from './pages/Progression';
import ChatBot from './pages/ChatBot';
import Tutorial from "./pages/Tutorial"; // Imported but was missing in Routes

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
        <Route path='/tutorial' element={<Tutorial/>}/> {/* Added this line */}
        <Route path='/nutrition' element={<Nutrition/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/progress' element={<Progression/>}/>
        <Route path='/chat' element={<ChatBot/>}/>
      </Routes>
    </Router>
  );
}

export default App;