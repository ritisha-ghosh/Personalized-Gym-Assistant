import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom"; // 1. Import hook
import { Mic, Search } from "lucide-react"; // Add Mic to imports
import { useNavigate } from "react-router-dom"; // Add useNavigate
import Layout from "../componenets/layout/Layout";
import StatCard from "../componenets/cards/StatCard";
import WorkoutCard from "../componenets/cards/WorkoutCard";
import WeeklyConsistency from "../componenets/cards/WeeklyConsistency";
import TrainerInsight from "../componenets/cards/TrainerInsight";
import Leaderboard from "../componenets/cards/Leaderboard";
import WeightTrendCard from "../componenets/cards/WeightTrendCard";
import { getUserProfile, getWorkouts } from "../utils/storageUtils";
import WorkoutHeatmap from "../componenets/cards/WorkoutHeatmap";
import GoalComparisonCard from "../componenets/cards/GoalComparisonCard";
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const [userProfile, setUserProfile] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // 2. Get the search query from URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Fetch real data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch user profile from backend
        const profileResponse = await api.get('/users/profile');
        const profileData = profileResponse.data.user;
        
        setUserProfile({
          name: profileData.name,
          weight: profileData.weight,
          height: profileData.height,
          age: profileData.age,
          goal: profileData.goal,
          experience: profileData.experience,
          gender: profileData.gender
        });

        // Get local workouts - USER-SPECIFIC
        if (user?.id) {
          const workouts = getWorkouts(user.id);  // 👈 Pass userId
          setRecentWorkouts(workouts.slice(-3));
          console.log(`📥 Loaded ${workouts.length} workouts for user ${user.id} on Dashboard`);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        // Fallback to local storage
        if (user?.id) {
          const profile = getUserProfile(user.id);  // 👈 Pass userId
          setUserProfile(profile);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [user?.id]);  // 👈 Re-fetch when user changes

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
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
      footer: "-0.5kg this week", 
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df20af]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Greeting */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          {getGreeting()}, {user?.name || "User"}.
        </h1>
        <p className="mt-1 text-sm sm:text-base font-medium text-slate-500">
          AI Trainer: "Keep up the great work! {recentWorkouts.length} workouts this week."
        </p>
        
        {/* Search Result Indicator */}
        {searchQuery && (
          <p className="mt-4 text-sm font-bold text-[#df20af]">
            Showing results for: "{searchQuery}"
          </p>
        )}
      </div>

      {/* Stats - Responsive grid (Filtered) */}
      {filteredStats.length > 0 && (
        <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Conditionally render based on search keywords */}
          {shouldShow(["workout", "training", "exercise", "plan"]) && <WorkoutCard />}
          {shouldShow(["weight", "trend", "chart", "progress", "graph"]) && <WeightTrendCard />}
          
          {/* If search is active but nothing matches in this column, show a polite message (optional) */}
          {searchQuery && 
           !shouldShow(["workout", "training", "exercise", "plan", "weight", "trend", "chart", "progress", "graph"]) && (
             <div className="hidden lg:block text-slate-400 text-sm italic">No main charts match your search.</div>
           )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-4">
          {shouldShow(["consistency", "week", "streak", "calendar"]) && <WeeklyConsistency />}
          {shouldShow(["heatmap", "streak", "consistency", "activity"]) && <WorkoutHeatmap />}
          {shouldShow(["goal", "comparison", "bmi", "weight target"]) && <GoalComparisonCard />}
          {shouldShow(["trainer", "insight", "ai", "tip", "advice"]) && <TrainerInsight />}
          {shouldShow(["leaderboard", "rank", "social", "community", "top"]) && <Leaderboard />}
        </div>

      </div>

      {/* Empty State if absolutely nothing matches */}
      {searchQuery && 
       filteredStats.length === 0 && 
       !shouldShow(["workout", "weight", "consistency", "trainer", "leaderboard"]) && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">No results found for "{searchQuery}".</p>
          <button 
             onClick={() => window.history.back()} 
             className="mt-2 text-[#df20af] font-bold hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* --- NEW: VOICE ASSISTANT FAB --- */}
      <button 
        onClick={() => navigate('/chat')} // Redirects to chat so they can talk
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#df20af] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white"
      >
        <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Talk to PulseAI
        </div>
        <Mic size={28} />
      </button>
      
    </Layout>
  );
};

export default Dashboard;