import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom"; // 1. Import hook
import { Mic, Search } from "lucide-react"; // Add Mic to imports
import { useNavigate } from "react-router-dom"; // Add useNavigate
import Layout from "../componenets/layout/Layout";
import StatCard from "../componenets/cards/StatCard";
import WorkoutCard from "../componenets/cards/WorkoutCard";
import WeeklyConsistency from "../componenets/cards/WeeklyConsistency";
import TrainerInsight from "../componenets/cards/TrainerInsight";
//import Leaderboard from "../componenets/cards/Leaderboard";
//import WeightTrendCard from "../componenets/cards/WeightTrendCard";
//import { getUserProfile, getWorkouts } from "../utils/storageUtils";
import GoalComparisonCard from "../componenets/cards/GoalComparisonCard";
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const { isDarkMode } = useContext(DarkModeContext);

  const [userProfile, setUserProfile] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [weeklyWorkoutCount, setWeeklyWorkoutCount] = useState(0);
  const [recommendedWorkout, setRecommendedWorkout] = useState(null);

  // 2. Get the search query from URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Fetch real data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch user profile from the backend as the single source of truth.
        let profileResponse;
        try {
          profileResponse = await api.get('/users/profile');
        } catch (err) {
          profileResponse = await api.get('/auth/profile');
        }
        const profileData = profileResponse.data.user || profileResponse.data;
        
       setUserProfile(profileData);

// Fetch workout logs from backend
const logsResponse = await api.get("/logs");
const logs = logsResponse.data.logs || logsResponse.data || [];

const now = new Date();
const startOfWeek = new Date(now);

// Use a rolling 7-day window to perfectly match the Weekly Consistency tracker
startOfWeek.setDate(startOfWeek.getDate() - 6);
startOfWeek.setHours(0, 0, 0, 0);

const thisWeekLogs = logs.filter((log) => {
  const logDate = new Date(log.date || log.createdAt);
  return log.status === "active" && logDate >= startOfWeek;
});

const uniqueWorkoutDatesThisWeek = new Set(
  thisWeekLogs.map((log) => {
    // Extract the raw date to prevent browser timezone shifts from merging days
    if (log.date) {
      return log.date.split('T')[0]; 
    }
    const d = new Date(log.date || log.createdAt);
    return d.toDateString();
  })
);

setWeeklyWorkoutCount(uniqueWorkoutDatesThisWeek.size);

let weeklyPlan = [];
try {
  const weeklyPlanResponse = await api.get("/workouts/weekly-plan");
  weeklyPlan = weeklyPlanResponse.data.weekPlan || weeklyPlanResponse.data.weeklyPlan || weeklyPlanResponse.data || [];
  if (!Array.isArray(weeklyPlan)) weeklyPlan = [];
} catch (err) {
  console.warn("Failed to fetch weekly plan:", err);
}

console.log("Weekly plan:", weeklyPlan);

// today's workout
const todayWorkout = weeklyPlan.find(day => day.isToday);

if (todayWorkout) {
  let progressPercentage = 0;
  
  if (todayWorkout.completed) {
    progressPercentage = 100;
  } else {
    const dateStr = todayWorkout.date ? todayWorkout.date.split('T')[0] : new Date().toISOString().split('T')[0];
    
    const keysToCheck = [
      user?.id && todayWorkout.date && `workout_completed_${user.id}_${todayWorkout.date}`,
      user?.id && `workout_completed_${user.id}_${dateStr}`,
      todayWorkout.date && `workout_completed_${todayWorkout.date}`,
      `workout_completed_${dateStr}`
    ].filter(Boolean);
    const finalSaved = keysToCheck.reduce((found, key) => found || localStorage.getItem(key), null);
    
    if (finalSaved) {
      try {
        const completedData = JSON.parse(finalSaved);
        const completedCount = Array.isArray(completedData) ? completedData.length : (Number(completedData) || 0);
        const totalExercises = todayWorkout.type === 'rest' ? 1 : Math.max(todayWorkout.exercises?.length || 1, 1);
        progressPercentage = Math.min(Math.round((completedCount / totalExercises) * 100), 100);
      } catch (e) {
        console.error("Error parsing saved workout progress:", e);
      }
    }
  }

  setRecommendedWorkout({
    ...todayWorkout,
    progress: progressPercentage
  });
}

// last few workouts for AI message if needed
setRecentWorkouts(weeklyPlan.slice(0, 3));
      } catch (error) {
        console.error("Dashboard error:", error);
        // On failure, set profile to null so the UI can show a loading/error state.
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [user?.id]);

  // Real-time progress percentage update
  useEffect(() => {
    if (!recommendedWorkout || recommendedWorkout.completed) return;
    
    const interval = setInterval(() => {
      const dateStr = recommendedWorkout.date ? recommendedWorkout.date.split('T')[0] : new Date().toISOString().split('T')[0];
      
      const keysToCheck = [
        user?.id && recommendedWorkout.date && `workout_completed_${user.id}_${recommendedWorkout.date}`,
        user?.id && `workout_completed_${user.id}_${dateStr}`,
        recommendedWorkout.date && `workout_completed_${recommendedWorkout.date}`,
        `workout_completed_${dateStr}`
      ].filter(Boolean);
      const finalSaved = keysToCheck.reduce((found, key) => found || localStorage.getItem(key), null);
      
      let newProgress = 0;

      if (finalSaved) {
        try {
          const completedData = JSON.parse(finalSaved);
          const completedCount = Array.isArray(completedData) ? completedData.length : (Number(completedData) || 0);
          const totalExercises = recommendedWorkout.type === 'rest' ? 1 : Math.max(recommendedWorkout.exercises?.length || 1, 1);
          newProgress = Math.min(Math.round((completedCount / totalExercises) * 100), 100);
        } catch (e) {
          // ignore
        }
      }
      
      if (newProgress !== recommendedWorkout.progress) {
        setRecommendedWorkout(prev => ({...prev, progress: newProgress}));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [recommendedWorkout, user?.id]);

 const getGreeting = () => {
  const hour = currentTime.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const getAiMessage = () => {
  if (weeklyWorkoutCount === 0) {
    return "Let's start your first workout this week!";
  }

  if (weeklyWorkoutCount < 3) {
    return `Great start! ${weeklyWorkoutCount} workouts this week.`;
  }

  return `Amazing ! ${weeklyWorkoutCount} workouts this week. Keep it up !`;
};

  // 3. Helper to check if a component should be visible
  // Returns true if search is empty OR if the keyword matches the search query
  const shouldShow = (keywords) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return keywords.some(k => k.toLowerCase().includes(query));
  };

  // 4. Data for Stats (Moved to array for filtering) - Dynamic from user data
  const statsData = [
    { 
      id: 1, 
      title: "Current Weight", 
      value: userProfile?.weight?.toString() || "0", 
      unit: "kg", 
      footer: "Updated from profile",
      accent: "text-teal-500",
      keywords: ["weight", "kg", "loss", "current"] 
    },
    { 
      id: 2, 
      title: "Goal", 
      value: userProfile?.goal ? userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1) : "N/A", 
      unit: "Target", 
      footer: "Keep working hard", 
      accent: "text-pink-500",
      keywords: ["goal", "target"]
    },
    { 
      id: 3, 
      title: "Height", 
      value: userProfile?.height?.toString() || "0", 
      unit: "cm", 
      footer: "Body metrics", 
      accent: "text-pink-500",
      keywords: ["height", "cm", "metrics"]
    }
  ];

  // Filter stats based on search
  const filteredStats = statsData.filter(stat => shouldShow([stat.title, ...stat.keywords]));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Libre Baskerville', serif; }
          
          /* Responsive fixes to prevent card text overflow on small screens */
          .cards-responsive-wrapper {
            min-width: 0;
          }
          .cards-responsive-wrapper > div {
            min-width: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          @media (max-width: 640px) {
            .cards-responsive-wrapper [class*="text-2xl"],
            .cards-responsive-wrapper [class*="text-3xl"],
            .cards-responsive-wrapper [class*="text-4xl"],
            .cards-responsive-wrapper [class*="text-5xl"] {
              font-size: 1.15rem !important;
              line-height: 1.5rem !important;
              white-space: normal !important;
              word-break: break-word;
            }
            .cards-responsive-wrapper [class*="whitespace-nowrap"] {
              white-space: normal !important;
            }
          }
        `}
      </style>
      <div className={`space-y-6 sm:space-y-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
        {/* Greeting */}
        <div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {getGreeting()}, {user?.name || "User"}.
          </h1>
          <p className={`mt-1 text-sm sm:text-base font-medium ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-500'}`}>
  AI Trainer : {getAiMessage()}
</p>
          
          {/* Search Result Indicator */}
          {searchQuery && (
            <p className={`mt-4 text-sm font-bold ${isDarkMode ? 'text-[#00c4b4]' : 'text-teal-500'}`}>
              Showing results for: "{searchQuery}"
            </p>
          )}
        </div>

        {/* Stats - Responsive grid (Filtered) */}
        {filteredStats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 cards-responsive-wrapper">
            {filteredStats.map((stat) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                unit={stat.unit}
                footer={stat.footer}
                accent={stat.accent}
              />
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 cards-responsive-wrapper">
          
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-8">
            {/* Conditionally render based on search keywords */}
            {shouldShow(["workout", "training", "exercise", "plan"]) && (
              <WorkoutCard
  workout={recommendedWorkout}
  onStartSession={() => navigate('/workouts')}
  hideViewRoutine={true}
/>
            )}
            
            {/* WEIGHT TREND CHART - COMMENTED OUT */}
            {/* {shouldShow(["weight", "trend", "chart", "progress", "graph"]) && <WeightTrendCard />} */}
            
            {/* If search is active but nothing matches in this column, show a polite message (optional) */}
            {searchQuery && 
            !shouldShow(["workout", "training", "exercise", "plan", "weight", "trend", "chart", "progress", "graph"]) && (
                <div className="hidden lg:block text-slate-400 text-sm italic">No main charts match your search.</div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-4">
            {shouldShow(["consistency", "week", "streak", "calendar"]) && <WeeklyConsistency />}
            
            {/* GOAL COMPARISON CARD - COMMENTED OUT */}
            {/* {shouldShow(["goal", "comparison", "bmi", "weight target"]) && <GoalComparisonCard />} */}
            
            {shouldShow(["trainer", "insight", "ai", "tip", "advice"]) && <TrainerInsight />}
            
            {/* LEADERBOARD - COMMENTED OUT */}
            {/* {shouldShow(["leaderboard", "rank", "social", "community", "top"]) && <Leaderboard />} */}
          </div>

        </div>

        {/* Empty State if absolutely nothing matches */}
        {searchQuery && 
        filteredStats.length === 0 && 
        !shouldShow(["workout", "weight", "consistency", "trainer", "leaderboard"]) && (
            <div className={`text-center py-20 rounded-xl border border-dashed ${isDarkMode ? 'bg-transparent border-slate-600 text-white' : 'bg-slate-50 border-slate-300'}`}>
            <p className={isDarkMode ? 'text-white' : 'text-slate-500'}>No results found for "{searchQuery}".</p>
            <button 
                onClick={() => window.history.back()}
                className="mt-2 text-[#df20af] font-bold hover:underline transition-transform active:scale-95 inline-block"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
                Clear Search
            </button>
            </div>
        )}
      </div>

      {/* --- NEW: VOICE ASSISTANT FAB --- */}
      <button 
        onClick={() => navigate('/chat')} // Redirects to chat so they can talk
        className="fixed bottom-8 right-8 w-16 h-16 bg-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white"
        style={{ fontFamily: "'Libre Baskerville', serif" }}
      >
        <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Talk to BeFit AI
        </div>
        <Mic size={28} />
      </button>
      
    </Layout>
  );
};

export default Dashboard;