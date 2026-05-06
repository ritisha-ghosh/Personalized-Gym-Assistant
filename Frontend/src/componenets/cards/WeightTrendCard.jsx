import React, { useContext } from "react";
import WeightTrendChart from "../charts/WeightTrendChart";
import { DarkModeContext } from "../../context/DarkModeContext";

const WeightTrendCard = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`
        rounded-2xl
        p-6
        shadow-sm
        border
        w-full
        backdrop-blur-md
        ${isDarkMode ? 'bg-[#1e293b]/60 border-[#334155]/60' : 'bg-white/60 border-slate-100/60'}
      `}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Weight Trend (7 Days)
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-charcoal/50">
            <span className="h-2 w-2 rounded-full bg-primary-magenta" />
            Actual
          </span>
          <span className="flex items-center gap-1 text-charcoal/50">
            <span className="h-2 w-2 rounded-full bg-charcoal/20" />
            Predicted
          </span>
        </div>
      </div>

      {/* Chart */}
      <WeightTrendChart />
    </div>
  );
};

export default WeightTrendCard;
