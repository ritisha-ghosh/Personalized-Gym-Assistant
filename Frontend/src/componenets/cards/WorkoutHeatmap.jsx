import React, { useEffect, useState } from "react";

const WorkoutHeatmap = () => {
  const [days, setDays] = useState([]);

  useEffect(() => {
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const logs = await res.json();

      const today = new Date();
      const temp = [];

      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);

        const dateStr = d.toISOString().split("T")[0];

        const didWorkout = logs.some((log) => {
          const logDate = new Date(log.date)
            .toISOString()
            .split("T")[0];
          return logDate === dateStr;
        });

        temp.push({
          date: dateStr,
          active: didWorkout,
        });
      }

      setDays(temp);
    } catch (err) {
      console.error("Heatmap fetch error:", err);
    }
  };

  fetchLogs();
}, []);

  const currentStreak = [...days]
    .reverse()
    .findIndex((d) => !d.active);

  const streak = currentStreak === -1 ? days.length : currentStreak;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-3">
        Workout Heatmap
      </h2>

      <div className="grid grid-cols-6 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            title={day.date}
            className={`h-7 rounded-md ${
              day.active
                ? "bg-[#df20af]"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Current Streak:
        <span className="font-bold text-[#df20af] ml-1">
          {streak} days
        </span>
      </p>
    </div>
  );
};

export default WorkoutHeatmap;