import React from "react";

const StatCard = ({ title, value, unit, footer, accent }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
      
      {/* Title */}
      <p className="text-sm font-bold text-slate-400">
        {title}
      </p>

      {/* Value */}
      <h2 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
        {value}
        <span className="ml-1 text-lg font-medium text-slate-400">
          {unit}
        </span>
      </h2>

      {/* Footer */}
      <p className={`mt-4 text-sm font-bold ${accent}`}>
        {footer}
      </p>
    </div>
  );
};

export default StatCard;
