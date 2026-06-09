import { Brain } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import api from "../../utils/api";

const TrainerInsight = ({
  title = "Trainer Insight",
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [message, setMessage] = useState("Loading your personalized insight...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const userResponse = await api.get('/users/profile');
        const user = userResponse.data.user;
        
        // Generate personalized messages based on user data
        const insights = [];
        
        if (user?.goal === 'muscle_gain') {
          insights.push("Your goal is Muscle Gain! Ensure you're eating in a caloric surplus and getting enough protein.");
          insights.push("Push hard in the gym and focus on progressive overload to build muscle effectively.");
          insights.push("Don't forget adequate rest - muscles grow during recovery, not just during workouts!");
        } else if (user?.goal === 'fat_loss') {
          insights.push("Your goal is Fat Loss! Maintain a caloric deficit while preserving muscle with strength training.");
          insights.push("Cardio combined with resistance training will accelerate your fat loss journey.");
          insights.push("Track your meals and stay consistent - fat loss is a marathon, not a sprint!");
        } else if (user?.goal === 'maintenance') {
          insights.push("Your goal is Maintenance! Keep your current fitness level with consistent workouts.");
          insights.push("Balance cardio and strength training for overall fitness and health.");
          insights.push("Mix up your routine to prevent plateaus and keep workouts interesting!");
        }

        if (user?.medicalConditions && user.medicalConditions.length > 0 && !user.medicalConditions.includes('Regular')) {
          insights.push(`Remember your medical conditions: ${user.medicalConditions.join(', ')}. Consult your trainer for modifications.`);
        }

        if (user?.injuries && user.injuries.length > 0 && !user.injuries.includes('Regular')) {
          insights.push(`Be cautious with your injuries: ${user.injuries.join(', ')}. Avoid exercises that strain these areas.`);
        }

        if (user?.experienceLevel === 'beginner') {
          insights.push("As a beginner, focus on learning proper form before increasing weights.");
        } else if (user?.experienceLevel === 'advanced') {
          insights.push("You're advanced! Challenge yourself with new training methods and techniques.");
        }

        // Pick a random insight
        const randomInsight = insights[Math.floor(Math.random() * insights.length)] || 
          "Stay consistent with your workouts and nutrition for best results!";
        
        setMessage(randomInsight);
      } catch (err) {
        console.error("Error fetching trainer insight:", err);
        setMessage("Stay consistent with your workouts and nutrition for best results!");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, []);

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        border
        p-6
        backdrop-blur-md
        ${isDarkMode ? 'bg-transparent border-teal-500/30' : 'bg-teal-50/60 border-teal-100/60'}
      `}
      style={{ fontFamily: "'Libre Baskerville', serif" }}
    >
      <div className="relative z-10 flex items-start gap-3">
        {/* Icon */}
        <div
          className="
            bg-teal-500
            p-2.5
            rounded-xl
            text-white
            shadow-lg shadow-teal-500/30
          "
        >
          <span className="material-symbols-outlined text-xl">
            <Brain />
          </span>
        </div>

        {/* Text */}
        <div>
          <h4 className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-teal-600'}`}>
            {title}
          </h4>
          <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-600'}`}>
            {loading ? "Loading..." : message}
          </p>
        </div>
      </div>

      {/* Glow */}
      <div
        className="
          pointer-events-none
          absolute -bottom-8 -right-8
          h-24 w-24
          rounded-full
          bg-teal-300/30
          blur-3xl
        "
      />
    </div>
  );
};

export default TrainerInsight;
