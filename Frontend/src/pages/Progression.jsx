import React, { useState, useEffect } from 'react';
import Layout from "../componenets/layout/Layout";
import { Download } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { downloadAsJSON, downloadAsCSV } from "../utils/pdfUtils";
import { getProgression, getUserProfile } from "../utils/storageUtils";

const Progression = () => {
  const [timeRange, setTimeRange] = useState('6 Months');
  const [weightData, setWeightData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const progression = getProgression();
    const profile = getUserProfile();
    setWeightData(progression.weightData || [
      { month: 'JAN', weight: 85.0 },
      { month: 'FEB', weight: 84.2 },
      { month: 'MAR', weight: 83.5 },
      { month: 'APR', weight: 81.8 },
      { month: 'MAY', weight: 79.5 },
      { month: 'JUN', weight: 78.4 },
    ]);
    setUserProfile(profile);
  }, []);

  // --- Lift Stats Data ---
  const liftStats = [
    { label: 'BENCH PRESS', growth: '+15%', weight: '105', unit: 'kg', bars: [40, 55, 70, 85, 100] },
    { label: 'SQUAT', growth: '+12%', weight: '140', unit: 'kg', bars: [30, 45, 60, 80, 95] },
    { label: 'DEADLIFT', growth: '+22%', weight: '185', unit: 'kg', bars: [20, 40, 60, 80, 100] },
  ];

  const handleExportPDF = () => {
    downloadAsJSON(weightData, `progression_${Date.now()}.json`);
  };

  const handleExportCSV = () => {
    downloadAsCSV(weightData, `progression_${Date.now()}.csv`);
  };

  return (
    <Layout>
      {/* Inject Fonts locally */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className="space-y-8 font-sans text-slate-900">
        
        {/* --- Page Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Progress Analytics</h1>
            <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-semibold">
              {['30 Days', '6 Months', 'Yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timeRange === range 
                      ? 'bg-white text-[#df20af] shadow-sm font-bold' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
            </div>
            {/* Profile Snippet */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold leading-none">{userProfile?.name || 'Alex Rivera'}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Athlete Level {userProfile?.level || 4}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-200 to-yellow-500 border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>        {/* --- Main Chart: Body Weight Trend --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Body Weight Trend</h2>
              <p className="text-slate-400 text-sm mt-1">Consistent decline over the last 6 months</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-3xl font-bold text-[#df20af]">78.4</span>
                <span className="text-slate-500 font-medium">kg</span>
              </div>
              <p className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg inline-block mt-1">
                -4.2KG OVERALL
              </p>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#df20af" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#df20af" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#df20af', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#df20af" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Lift Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liftStats.map((lift, index) => (
            <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lift.label}</h3>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{lift.growth}</span>
              </div>
              
              {/* Custom CSS Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-16 mt-4">
                {lift.bars.map((height, i) => (
                  <div 
                    key={i} 
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 ${i === lift.bars.length - 1 ? 'bg-[#00c4b4]' : 'bg-teal-50'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>

              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-slate-900">{lift.weight}</span>
                <span className="text-sm text-slate-400 font-medium">{lift.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* --- Consistency Heatmap (GitHub Style) --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-end mb-6 min-w-[600px]">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Consistency Heatmap</h2>
              <p className="text-slate-400 text-sm mt-1">You have trained <span className='text-[#df20af] font-bold'>24 days</span> this month.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-slate-100 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-teal-200 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-teal-400 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-teal-600 rounded-[2px]"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="flex gap-2 min-w-[600px]">
            {/* Days Column */}
            <div className="grid grid-rows-7 gap-1 text-[10px] font-bold text-slate-300 uppercase h-full py-[2px] pr-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {[...Array(365)].map((_, i) => { // ~52 weeks of data points
                // Random intensity
                const intensity = Math.random() > 0.8 ? 'bg-teal-600' : Math.random() > 0.6 ? 'bg-teal-400' : Math.random() > 0.4 ? 'bg-teal-200' : 'bg-slate-100';
                return (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-[2px] ${intensity} hover:scale-125 transition-transform cursor-pointer`} 
                    title={`Day ${i + 1}`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Progression;