import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const StatCard = ({ title, value, unit, footer, accent }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`rounded-2xl p-6 shadow-sm border flex flex-col justify-between backdrop-blur-md ${isDarkMode ? 'bg-[#1e293b]/60 border-[#334155]/60' : 'bg-white/60 border-slate-100/60'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
      
      {/* Title */}
      <p className={`text-sm font-bold ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
        {title}
      </p>

      {/* Value */}
      <h2 className={`mt-1 text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {value}
        <span className={`ml-1 text-lg font-medium ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
          {unit}
        </span>
      </h2>

      {/* Footer */}
      <p className={`mt-4 text-sm font-bold ${isDarkMode && accent.includes('teal') ? 'text-[#00c4b4]' : isDarkMode ? 'text-[#cbd5e1]' : accent}`}>
        {footer}
      </p>
    </div>
  );
};

export default StatCard;
