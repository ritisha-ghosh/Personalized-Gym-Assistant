import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import ProgressRing from "../common/ProgressRing";
import { DarkModeContext } from "../../context/DarkModeContext";

const WorkoutCard = ({ workout }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div
      className={`
        rounded-2xl
        p-8
        shadow-sm
        border
        flex flex-col md:flex-row
        items-center
        justify-between
        gap-8
        w-full
        backdrop-blur-md
        transition-colors
        ${isDarkMode 
          ? 'bg-transparent border-[#334155]/60' 
          : 'bg-transparent border-slate-100/70'}
      `}
      style={{ fontFamily: "'Libre Baskerville', serif" }}
    >
      {/* Left Content */}
      <div className="flex-1">
        {/* Tag */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${isDarkMode ? 'bg-teal-500/40 text-teal-300' : 'bg-pink-50/80 text-pink-500'}`}>
            Intense
          </span>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-400'}`}>
            Hypertrophy Session
          </span>
        </div>

        {/* Title */}
        <h3 className={`mb-2 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {workout?.title || "No Workout Available"}
        </h3>

        {/* Description */}
        <p className={`mb-6 max-w-xl leading-relaxed ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-500'}`}>
         {workout?.goal || "Your next recommended workout will appear here."}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/workouts')} // Connects to workouts page
            className={`
              flex items-center gap-2
              rounded-xl
              px-8 py-3.5
              font-bold
              text-white
              shadow-lg
              transition-all
              hover:-translate-y-0.5 active:translate-y-0
              ${isDarkMode ? 'bg-teal-500 shadow-teal-500/30' : 'bg-pink-500 shadow-pink-500/30'}
            `}
          >
            Start Session
          </button>

          {/* VIEW ROUTINE BUTTON COMMENTED OUT
          <button
            className={`
              rounded-xl
              border
              px-8 py-3.5
              text-sm
              font-bold
              transition-colors
              ${isDarkMode 
                ? 'border-[#334155] bg-[#334155]/50 text-[#cbd5e1] hover:bg-[#334155]/70' 
                : 'border-slate-100 bg-slate-50 text-slate-900 hover:bg-slate-100'}
            `}
          >
            View Routine
          </button>
          */}
        </div>
      </div>

      {/* Right Progress */}
      <div className="flex flex-col items-center">
  <ProgressRing percent={60} />
  <span
    className={`mt-2 text-2xl font-bold ${
      isDarkMode ? "text-white" : "text-slate-900"
    }`}
  >
    60%
  </span>
</div>
    </div>
  );
};

export default WorkoutCard;