import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const WorkoutHeatmap = () => {

  const [days, setDays] = useState([]);

  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {

    const fetchLogs = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/logs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const streak =
    currentStreak === -1
      ? days.length
      : currentStreak;

  return (

    <div
      className={`rounded-2xl shadow-sm p-5 border backdrop-blur-md ${
        isDarkMode
          ? "bg-[#1e293b]/60 border-[#334155]/60"
          : "bg-white/60 border-slate-100/60"
      }`}
    >

      <h2
        className={`text-lg font-bold mb-3 ${
          isDarkMode
            ? "text-white"
            : "text-slate-900"
        }`}
      >
        Workout Heatmap
      </h2>

      <div className="grid grid-cols-6 gap-2">

        {days.map((day, index) => (

          <div
            key={index}
            title={day.date}
            className={`h-7 rounded-md ${
              day.active
                ? "bg-[#00c4b4]"
                : "bg-slate-200"
            }`}
          />

        ))}

      </div>

      <p className="mt-4 text-sm text-slate-500">

        Current Streak:

        <span className="font-bold text-[#00c4b4] ml-1">
          {streak} days
        </span>

      </p>

    </div>
  );
};

export default WorkoutHeatmap;