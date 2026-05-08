import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const days = [
  { label: "M", completed: true },
  { label: "T", completed: true },
  { label: "W", completed: true },
  { label: "T", completed: false },
  { label: "F", completed: false },
  { label: "S", completed: false },
  { label: "S", completed: false },
];

const WeeklyConsistency = ({ completedCount = 3, target = 5 }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`
        rounded-2xl
        p-6
        shadow-sm
        border
        text-center
        backdrop-blur-md
        ${isDarkMode ? 'bg-[#1e293b]/60 border-[#334155]/60' : 'bg-white/60 border-slate-100/60'}
      `}
    >
      {/* Title */}
      <h3 className={`mb-6 text-left text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Weekly Consistency
      </h3>

      {/* Days */}
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full
                flex items-center justify-center
                text-xs font-bold
                transition-all
                ${
                  day.completed
                    ? "bg-teal-500 text-white shadow-sm shadow-teal-500/30"
                    : "border-2 border-slate-200 text-slate-400"
                }
              `}
            >
              {day.label}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm font-medium text-slate-500">
        {completedCount} of {target} workouts completed this week.
      </p>
    </div>
  );
};

export default WeeklyConsistency;
