import React from "react";

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
  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        border border-slate-100
        text-center
      "
    >
      {/* Title */}
      <h3 className="mb-6 text-left text-lg font-bold text-slate-900">
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
