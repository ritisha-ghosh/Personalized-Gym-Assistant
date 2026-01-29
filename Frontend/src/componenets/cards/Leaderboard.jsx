import React from "react";

const Leaderboard = ({ users }) => {
  const data = users || [
    { name: "Sarah Miller", xp: 2450, initials: "SM", active: false },
    { name: "Alex Johnson", xp: 2210, initials: "AJ", active: true },
    { name: "Ryan Kim", xp: 1980, initials: "RK", active: false },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="font-bold text-lg mb-4 text-slate-900">
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
                  ? "bg-teal-50"
                  : "hover:bg-slate-50"
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
