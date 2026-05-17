import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const WeeklyConsistency = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  const [days, setDays] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("accessToken");

       const res = await fetch("http://localhost:5000/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("DATA:", data);

        const logs = Array.isArray(data.logs)
  ? data.logs
  : Array.isArray(data)
  ? data
  : [];

        const today = new Date();

        const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

        const formattedDays = [];

        let totalCompleted = 0;

        for (let i = 0; i < 7; i++) {
          const current = new Date();

          current.setDate(today.getDate() - today.getDay() + i);

          const currentDate =
            current.toLocaleDateString("en-CA");

          const hasWorkout = logs.some((log) => {
            const logDate =
              new Date(log.date).toLocaleDateString("en-CA");

            return logDate === currentDate && log.status === "active";
          });

          if (hasWorkout) totalCompleted++;

          formattedDays.push({
            label: weekDays[i],
            completed: hasWorkout,
          });
        }

        setDays(formattedDays);
        setCompletedCount(totalCompleted);

      } catch (err) {
        console.error("ERROR:", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div
      className={`
        rounded-2xl
        p-6
        shadow-sm
        border
        text-center
        backdrop-blur-md
        ${
          isDarkMode
            ? "bg-transparent border-[#334155]/60"
            : "bg-white/60 border-slate-100/60"
        }
      `}
      style={{ fontFamily: "'Libre Baskerville', serif" }}
    >
      <h3
        className={`mb-6 text-left text-lg font-bold ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        Weekly Consistency
      </h3>

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

      <p className={`mt-6 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-500'}`}>
        {completedCount} workouts completed this week.
      </p>
    </div>
  );
};

export default WeeklyConsistency;