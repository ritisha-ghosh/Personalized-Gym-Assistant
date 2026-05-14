import React, { useEffect, useState, useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts";
import { DarkModeContext } from "../../context/DarkModeContext";

const GoalComparisonCard = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentWeight = 82.5;
  const height = 1.75;

  const currentBMI = (
    currentWeight / (height * height)
  ).toFixed(1);

  useEffect(() => {
  const fetchAI = async () => {
    try {
      const res = await fetch("http://localhost:5001/recommend-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          age: 22,
          weight_kg: 82.5,
          experience_level: 2,
          goal_type: 1
        })
      });

      const result = await res.json();
      console.log(result);

      const planId = Number(result.recommended_plan_id);

      let targetWeight = 75;
      let targetBMI = 24;

      if (planId === 1) {
        targetWeight = 78;
        targetBMI = 25;
      } else if (planId === 2) {
        targetWeight = 75;
        targetBMI = 24;
      } else if (planId === 3) {
        targetWeight = 72;
        targetBMI = 23;
      }

      setData([
        { name: "Weight", Current: 82.5, Target: targetWeight },
        { name: "BMI", Current: 27.0, Target: targetBMI }
      ]);
    } catch (error) {
      console.log("AI Error:", error);

      // fallback data so card always shows
      setData([
        { name: "Weight", Current: 82.5, Target: 75 },
        { name: "BMI", Current: 27, Target: 24 }
      ]);
    }

    setLoading(false);
  };

  fetchAI();
}, []);

  if (loading) {
    return (
      <div className={`p-5 rounded-2xl shadow-sm border backdrop-blur-md ${isDarkMode ? 'bg-[#1e293b]/60 border-[#334155]/60' : 'bg-white/60 border-slate-100/60'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
        <p className={isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-900'}>
          Loading AI Goal Comparison...
        </p>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl shadow-sm border backdrop-blur-md ${isDarkMode ? 'bg-[#1e293b]/60 border-[#334155]/60' : 'bg-white/60 border-slate-100/60'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
      <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        AI Goal Comparison
      </h2>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontFamily: "'Libre Baskerville', serif" }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#334155' : '#ffffff',
                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                borderRadius: '8px',
                color: isDarkMode ? '#f1f5f9' : '#000000',
                fontFamily: "'Libre Baskerville', serif"
              }}
            />
            <Bar dataKey="Current" fill="#00c4b4" />
            <Bar dataKey="Target" fill={isDarkMode ? '#00a89f' : '#14b8a6'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GoalComparisonCard;
