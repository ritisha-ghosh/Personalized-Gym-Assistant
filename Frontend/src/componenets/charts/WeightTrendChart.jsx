import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const WeightTrendChart = () => {
    const data = [
  { day: "Mon", actual: 82.1, predicted: 82.0 },
  { day: "Tue", actual: 82.2, predicted: 82.1 },
  { day: "Wed", actual: 82.3, predicted: 82.2 },
  { day: "Thu", actual: 82.4, predicted: 82.35 },
  { day: "Fri", actual: 82.6, predicted: 82.5 },
  { day: "Sat", actual: 82.7, predicted: 82.6 },
  { day: "Sun", actual: 82.8, predicted: 82.7 },
];
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <YAxis
            hide
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#FF00FF"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#E5E7EB"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeightTrendChart
