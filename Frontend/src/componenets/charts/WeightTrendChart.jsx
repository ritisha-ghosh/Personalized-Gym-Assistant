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
    fetch("http://localhost:5000/api/logs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);

        const logs = Array.isArray(response)
          ? response
          : response.data || [];

        const formattedData = logs
          .slice()
          .reverse()
          .map((log) => ({
            day: new Date(log.date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            actual: log.weight,
          }));

        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
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