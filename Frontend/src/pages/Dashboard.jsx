import React from "react";
import Layout from "../componenets/layout/Layout";
import StatCard from "../componenets/cards/StatCard";
import WorkoutCard from "../componenets/cards/WorkoutCard";
import WeeklyConsistency from "../componenets/cards/WeeklyConsistency";
import TrainerInsight from "../componenets/cards/TrainerInsight";
import Leaderboard from "../componenets/cards/Leaderboard";
import WeightTrendCard from "../componenets/cards/WeightTrendCard";

const Dashboard = () => {
  return (
    <Layout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Good Morning, Guizz.
        </h1>
        <p className="mt-1 font-medium text-slate-500">
          AI Trainer: "Excellent sleep data!"
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatCard
          title="Current Weight"
          value="82.5"
          unit="kg"
          footer="-0.5kg this week"
          accent="text-teal-500"
        />
        <StatCard
          title="Goal (Hypertrophy)"
          value="88.0"
          unit="kg"
          footer="+5.5kg to go"
          accent="text-pink-500"
        />
        <StatCard
          title="Daily Calories"
          value="1,420"
          unit="/ 2,800 kcal"
          footer="1,380 kcal remaining"
          accent="text-pink-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-8">
          <WorkoutCard />
          <WeightTrendCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-4">
          <WeeklyConsistency />
          <TrainerInsight />
          <Leaderboard />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
