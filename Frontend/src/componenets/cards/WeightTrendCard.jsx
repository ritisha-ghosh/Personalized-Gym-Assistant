import React from "react";
import WeightTrendChart from "../charts/WeightTrendChart";

const WeightTrendCard = () => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        border border-gray-100
        w-full
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-blue">
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
