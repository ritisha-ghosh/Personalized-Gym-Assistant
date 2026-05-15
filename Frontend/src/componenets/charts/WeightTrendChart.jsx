import React, { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DarkModeContext } from "../../context/DarkModeContext";

const WeightTrendChart = () => {
  const [data, setData] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

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

        // Sort logs chronologically to track weight changes accurately
        const sortedLogs = logs.slice().sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the earliest date to start the chart
        let firstLogDate = new Date(today);
        if (sortedLogs.length > 0) {
          firstLogDate = new Date(sortedLogs[0].date || sortedLogs[0].createdAt);
          firstLogDate.setHours(0, 0, 0, 0);
        }
        
        // Ensure we show at least the last 7 days so the chart always has a timeline
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startDate = firstLogDate < start ? firstLogDate : start;

        // Map every explicit weight log to its date
        const dateMap = {};
        sortedLogs.forEach(log => {
          if (log.weight && !isNaN(log.weight)) {
            const d = new Date(log.date || log.createdAt);
            d.setHours(0, 0, 0, 0);
            dateMap[d.toDateString()] = Number(log.weight);
          }
        });

        // Find the absolute first known weight to start our running total
        // Fallback to profile weight if no logs have weights yet
        let runningWeight = currentProfileWeight ? Number(currentProfileWeight) : 0; 
        for (let i = 0; i < sortedLogs.length; i++) {
            if (sortedLogs[i].weight && !isNaN(sortedLogs[i].weight)) {
                runningWeight = Number(sortedLogs[i].weight);
                break; 
            }
        }

        const formattedData = [];
        let current = new Date(startDate);
        
        // Step through every single day, assigning a weight so NO days are null
        while (current <= today) {
          const dateString = current.toDateString();
          
          // If a new weight was logged on this specific day, update the running total
          if (dateMap[dateString]) {
             runningWeight = dateMap[dateString];
          }

          // If it's today, the profile weight is the absolute source of truth
          if (dateString === today.toDateString() && currentProfileWeight) {
             runningWeight = Number(currentProfileWeight);
          }

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
            // Because we pass the carried-over runningWeight, EVERY day gets a dot! No more blank points.
            actual: runningWeight, 
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
    <div className="h-48 w-full" style={{ fontFamily: "'Libre Baskerville', serif" }}>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontFamily: "'Libre Baskerville', serif", fontSize: 12 }}
              tickMargin={10}
            />
            {/* Added padding to bottom and top to ensure the line floats above the baseline */}
            <YAxis 
              hide 
              domain={['dataMin - 5', 'dataMax + 5']} 
              padding={{ bottom: 20, top: 20 }} 
            />
            
            <Tooltip 
              labelFormatter={(value, payload) => payload?.[0]?.payload?.fullDate || value}
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#f1f5f9',
                color: isDarkMode ? '#f1f5f9' : '#0f172a',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontFamily: "'Libre Baskerville', serif"
              }}
              itemStyle={{ color: isDarkMode ? '#FF00FF' : '#0ea5e9', fontWeight: 'bold' }}
            />
            
            <Line
              type="linear"
              dataKey="actual"
              name="Weight"
              stroke="#FF00FF"
              strokeWidth={3}
              // Dots will now explicitly render for every day since data is never null
              dot={{ r: 4, fill: isDarkMode ? '#1e293b' : '#ffffff', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: "#FF00FF", stroke: "#ffffff", strokeWidth: 2 }}
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