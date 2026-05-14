import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const Leaderboard = ({ users }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const data = users || [
    { name: "Sarah Miller", xp: 2450, initials: "SM", active: false },
    { name: "Alex Johnson", xp: 2210, initials: "AJ", active: true },
    { name: "Ryan Kim", xp: 1980, initials: "RK", active: false },
  ];

  return (
    <div className={`rounded-2xl p-6 shadow-sm border backdrop-blur-md ${isDarkMode ? 'bg-[#1e293b]/60 border-[#334155]/60' : 'bg-white/60 border-slate-100/60'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
      <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Leaderboard
      </h3>

      <div className="space-y-3">
        {data.map((user, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-between
              px-3 py-2 rounded-xl
              transition-colors
              ${
                user.active
                  ? isDarkMode ? 'bg-teal-500/20' : 'bg-teal-50/60'
                  : isDarkMode ? 'hover:bg-[#334155]/40' : 'hover:bg-slate-50/60'
              }
            `}
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-8 h-8 rounded-full
                  flex items-center justify-center
                  text-[10px] font-black
                  ${
                    user.active
                      ? "border-2 border-pink-500 text-pink-500"
                      : "bg-slate-50 border border-slate-200 text-slate-900"
                  }
                `}
              >
                {user.initials}
              </div>

              <span
                className={`
                  text-sm
                  ${
                    user.active
                      ? "font-bold text-slate-900"
                      : "font-medium text-slate-500"
                  }
                `}
              >
                {user.name}
              </span>
            </div>

            {/* XP */}
            <span
              className={`
                text-xs font-bold
                ${
                  user.active
                    ? "text-pink-500"
                    : "text-teal-500"
                }
              `}
            >
              {user.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
