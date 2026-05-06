import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeightTrendChart = () => {
  const [data, setData] = useState([]);

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
            <XAxis dataKey="day" />
            <YAxis hide />
            <Tooltip />
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