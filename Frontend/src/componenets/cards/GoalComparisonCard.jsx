import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts";

const GoalComparisonCard = () => {
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
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        Loading AI Goal Comparison...
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold mb-4">
        AI Goal Comparison
      </h2>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="Current" fill="#df20af" />
            <Bar dataKey="Target" fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GoalComparisonCard;