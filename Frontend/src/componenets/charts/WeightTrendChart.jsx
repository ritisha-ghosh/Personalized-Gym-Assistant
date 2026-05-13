import React, { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DarkModeContext } from "../../context/DarkModeContext"; // 1. Imported Context

const WeightTrendChart = () => {
  const [data, setData] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext); // 2. Extracted dark mode state

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    Promise.all([
      fetch("http://localhost:5000/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json())
    ])
      .then(([logsResponse, profileResponse]) => {
        const logs = Array.isArray(logsResponse)
          ? logsResponse
          : logsResponse.data || [];

        const currentProfileWeight = profileResponse?.user?.weight || null;

        const sortedLogs = logs.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let firstLogDate = new Date(today);
        if (sortedLogs.length > 0) {
          firstLogDate = new Date(sortedLogs[0].date);
          firstLogDate.setHours(0, 0, 0, 0);
        }
        
        // Ensure we show at least the last 7 days so the chart always has a timeline
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startDate = firstLogDate < start ? firstLogDate : start;

        const dateMap = {};
        sortedLogs.forEach(log => {
          if (log.weight) {
            const d = new Date(log.date);
            dateMap[d.toDateString()] = log.weight;
          }
        });

        // Ensure today always has the most up-to-date weight from the profile
        if (currentProfileWeight) {
          dateMap[today.toDateString()] = currentProfileWeight;
        }

        const formattedData = [];
        let current = new Date(startDate);
        
        while (current <= today) {
          const dateString = current.toDateString();
          formattedData.push({
            day: current.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            fullDate: current.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric"
            }),
            actual: dateMap[dateString] || null, // Let connectNulls interpolate missing days
          });
          current.setDate(current.getDate() + 1);
        }

        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data for chart:", error);
      });
  }, []);

  return (
    <div className="h-48 w-full">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* 3. Make the X-Axis text visible in dark mode */}
            <XAxis 
              dataKey="day" 
              tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }}
            />
            <YAxis hide />
            
            {/* 4. Applied Dark Mode CSS to Tooltip */}
            <Tooltip 
              labelFormatter={(value, payload) => payload?.[0]?.payload?.fullDate || value}
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#f1f5f9',
                color: isDarkMode ? '#f1f5f9' : '#0f172a',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ color: isDarkMode ? '#FF00FF' : '#0ea5e9' }}
            />
            
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FF00FF"
              strokeWidth={3}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <p>Loading weight data...</p>
        </div>
      )}
    </div>
  );
};

export default WeightTrendChart;