import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import Hook
import Layout from "../componenets/layout/Layout";
import { Download, Filter } from 'lucide-react'; // Added Filter icon
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { downloadAsJSON, downloadAsCSV } from "../utils/pdfUtils";
import { getProgression, getUserProfile, getLoginHeatmapData, getLoginDates } from "../utils/storageUtils";
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

// Import the extracted WeightTrendCard
import WeightTrendCard from "../componenets/cards/WeightTrendCard";

const Progression = () => {
  // 2. Search Params Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [timeRange, setTimeRange] = useState('6 Months');
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [loginHeatmapData, setLoginHeatmapData] = useState([]);
  const [loginCount, setLoginCount] = useState(0);

  // Fetch user progress data from backend
  useEffect(() => {
    const loadProgressionData = async () => {
      // If the user object from context isn't loaded yet, wait.
      if (!user?.id) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        // Fetch the complete user profile from the backend
        const profileResponse = await api.get('/users/profile');
        const profileData = profileResponse.data.user;
        setUserProfile(profileData);

        const progression = getProgression(user.id);
        // Use fetched profile weight to generate mock chart data if needed.
        setWeightData(progression.weightData || [
          { month: 'JAN', weight: profileData.weight ? profileData.weight - 5 : 85.0 },
          { month: 'FEB', weight: profileData.weight ? profileData.weight - 4.2 : 84.2 },
          { month: 'MAR', weight: profileData.weight ? profileData.weight - 3.5 : 83.5 },
          { month: 'APR', weight: profileData.weight ? profileData.weight - 1.8 : 81.8 },
          { month: 'MAY', weight: profileData.weight ? profileData.weight + 0.5 : 79.5 },
          { month: 'JUN', weight: profileData.weight || 78.4 },
        ]);

        const heatmap = getLoginHeatmapData(user.id);
        const logins = getLoginDates(user.id);
        setLoginHeatmapData(heatmap);
        setLoginCount(logins.length);

        console.log(`📥 Loaded progression data for user ${user.id}`);
      } catch (error) {
        console.error("Failed to fetch progression data", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressionData();
  }, [user?.id]); // Re-run when the user object from context changes (e.g., after name update).

  // --- Lift Stats Data ---
  const liftStats = [
    { label: 'BENCH PRESS', growth: '+15%', weight: '105', unit: 'kg', bars: [40, 55, 70, 85, 100] },
    { label: 'SQUAT', growth: '+12%', weight: '140', unit: 'kg', bars: [30, 45, 60, 80, 95] },
    { label: 'DEADLIFT', growth: '+22%', weight: '185', unit: 'kg', bars: [20, 40, 60, 80, 100] },
  ];

  // --- 3. FILTER LOGIC ---

  // A. Filter Chart Visibility
  const showChart = !searchQuery || 
    ['weight', 'trend', 'kg', 'loss', 'body'].some(kw => searchQuery.toLowerCase().includes(kw));

  // B. Filter Heatmap Visibility
  const showHeatmap = !searchQuery || 
    ['consistency', 'heatmap', 'streak', 'history', 'days'].some(kw => searchQuery.toLowerCase().includes(kw));

  // C. Filter Lift Cards
  const filteredLiftStats = liftStats.filter(lift => 
    !searchQuery || // Show all if no search
    lift.label.toLowerCase().includes(searchQuery.toLowerCase()) || // Match Label
    lift.weight.includes(searchQuery) // Match Weight value
  );

  const handleExportPDF = () => {
    downloadAsJSON(weightData, `progression_${Date.now()}.json`);
  };

  const handleExportCSV = () => {
    downloadAsCSV(weightData, `progression_${Date.now()}.csv`);
  };

  // Calculate current streak (consecutive days from today backwards)
  const calculateStreak = () => {
    const loginDates = getLoginDates(user?.id || '');
    if (!loginDates || loginDates.length === 0) return 0;

    const toYYYYMMDD = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    let streak = 0;
    let checkDate = new Date();

    // If today is not a login day, start checking from yesterday.
    // This provides a better UX for users who haven't logged in yet today.
    if (!loginDates.includes(toYYYYMMDD(checkDate))) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days backwards
    while (loginDates.includes(toYYYYMMDD(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  // Calculate longest streak ever
  const calculateLongestStreak = () => {
    const loginDates = getLoginDates(user?.id || '').sort();
    if (loginDates.length <= 1) return loginDates.length;

    let longest = 1;
    let current = 1;

    for (let i = 1; i < loginDates.length; i++) {
      // Use UTC dates at noon to safely calculate day differences, avoiding DST issues
      const prevDate = new Date(loginDates[i - 1] + 'T12:00:00Z');
      const currDate = new Date(loginDates[i] + 'T12:00:00Z');
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        current++;
      } else {
        current = 1;
      }
      longest = Math.max(longest, current);
    }

    return longest;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  const currentWeight = userProfile?.weight || (weightData[weightData.length - 1]?.weight || 78.4);
  const initialWeight = weightData[0]?.weight || 85.0;
  const weightChange = (initialWeight - currentWeight).toFixed(1);

  return (
    <Layout>
      {/* Inject Fonts locally */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className={`space-y-6 sm:space-y-8 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        
        {/* --- Page Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Progress Analytics</h1>
     {/*       <div className="bg-slate-100 p-1 rounded-xl flex text-xs sm:text-sm font-semibold overflow-x-auto">
              {['30 Days', '6 Months', 'Yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timeRange === range 
                      ? 'bg-white text-teal-500 shadow-sm font-bold' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>   */}
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
                <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Goal: {userProfile?.goal ? userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1) : 'N/A'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-200 to-yellow-500 border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Search Indicator */}
        {searchQuery && (
          <p className="text-sm font-bold text-teal-500 animate-pulse">
            Filtering results for: "{searchQuery}"
          </p>
        )}

        {/* --- Main Chart: Body Weight Trend --- */}
        {/* OLD INLINE CHART COMMENTED OUT 
        {showChart && (
          <div className={`p-8 rounded-[2rem] border shadow-sm animate-fade-in ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Body Weight Trend</h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-400'}`}>Your weight progress over time</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-3xl font-bold text-teal-500">{currentWeight}</span>
                  <span className={`font-medium ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-500'}`}>kg</span>
                </div>
                <p className={`text-xs font-bold ${weightChange < 0 ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50'} px-2 py-1 rounded-lg inline-block mt-1`}>
                  {weightChange > 0 ? '+' : ''}{weightChange}KG {weightChange < 0 ? 'LOSS' : 'GAIN'}
                </p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c4b4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00c4b4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      color: isDarkMode ? '#f1f5f9' : '#000000'
                    }}
                    cursor={{ stroke: '#00c4b4', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#00c4b4" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        */}

        {/* --- IMPORTED WEIGHT TREND CARD --- */}
        {showChart && <WeightTrendCard />}

        {/* --- Lift Stats Cards (Filtered) COMMENTED OUT --- */}
        {/* {filteredLiftStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {filteredLiftStats.map((lift, index) => (
              <div key={index} className={`p-6 rounded-[2rem] border shadow-sm flex flex-col justify-between h-48 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-start">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>{lift.label}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isDarkMode ? 'text-emerald-400 bg-emerald-500/20' : 'text-emerald-500 bg-emerald-50'}`}>{lift.growth}</span>
                </div>
                
                <div className="flex items-end justify-between gap-2 h-16 mt-4">
                  {lift.bars.map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 ${i === lift.bars.length - 1 ? 'bg-[#00c4b4]' : isDarkMode ? 'bg-[#334155]' : 'bg-teal-50'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{lift.weight}</span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>{lift.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        */}

        {/* --- Consistency Heatmap (GitHub Style with Years) --- */}
        {showHeatmap && (
          <div className={`p-8 rounded-[2rem] border shadow-sm overflow-x-auto animate-fade-in ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-end mb-8 min-w-[600px]">
              <div>
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Workout Heatmap</h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-400'}`}>
                  You have workedout <span className='text-[#00c4b4] font-bold'>{loginCount} days</span> in the last year.
                  <span className={`ml-2 font-bold ${isDarkMode ? 'text-[#00c4b4]' : 'text-teal-600'}`}>(Updated Today ✓)</span>
                </p>
              </div>
            </div>

            {/* Legend - Bottom Right */}
           {/*  <div className={`flex items-center justify-end gap-2 text-[10px] font-bold uppercase mb-4 pb-2 border-b ${isDarkMode ? 'text-[#94a3b8] border-[#334155]' : 'text-slate-400 border-slate-200'}`}>
              <span>Less</span>
              <div className="flex gap-1">
                <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-[#334155]' : 'bg-slate-100'}`}></div>
                <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-[#00c4b4]/40' : 'bg-teal-200'}`}></div>
                <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-[#00c4b4]/70' : 'bg-teal-400'}`}></div>
                <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-[#00c4b4]' : 'bg-teal-600'}`}></div>
              </div>
              <span>More</span>
            </div>  */}

            <div className="overflow-x-auto -mx-2 px-2">
              <div className="flex gap-1 items-start pb-4 min-w-min">
                {/* Day labels on left (M-S) */}
                <div className={`flex flex-col gap-1 pt-6 pr-3 min-w-[25px]`}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div 
                      key={i} 
                      className={`text-[9px] font-bold uppercase text-center h-3 leading-none ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}
                    >
                      {day.charAt(0)}
                    </div>
                  ))}
                </div>

                {/* Weeks grid (horizontal columns) */}
                <div className="flex gap-1">
                  {/* Build proper calendar grid - Week starts on Monday */}
                  {/* First, organize data by week with proper day alignment */}
                  {(() => {
                    const weeks = [];
                    let currentWeek = Array(7).fill(null);
                    let weekDayIdx = 0;

                    loginHeatmapData.forEach((day) => {
                      // FIX: Parse date string as local time to avoid timezone shift issues.
                      // new Date('YYYY-MM-DD') parses as UTC, which can shift the day.
                      const dateObj = new Date(day.date + 'T00:00:00');
                      
                      // JS getDay(): 0=Sun, 1=Mon...6=Sat
                      // We want: 0=Monday, 1=Tuesday...6=Sunday
                      let dayOfWeek = dateObj.getDay(); // 0-6
                      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon=0...Sun=6

                      currentWeek[dayOfWeek] = day;

                      // When Sunday (index 6) is filled, push the week and start a new one
                      if (dayOfWeek === 6) {
                        weeks.push([...currentWeek]);
                        currentWeek = Array(7).fill(null);
                      }
                    });

                    // Push last week even if incomplete
                    if (currentWeek.some(d => d !== null)) {
                      weeks.push(currentWeek);
                    }

                    return weeks.map((week, weekIdx) => {
                      const firstValidDay = week.find(d => d !== null);
                      let weekLabel = '';
                      
                      if (firstValidDay) {
                        const weekStartDate = new Date(firstValidDay.date);
                        const month = weekStartDate.toLocaleDateString('en-US', { month: 'short' });
                        const date = weekStartDate.getDate();
                        weekLabel = `${month}`;
                      }

                      return (
                        <div key={weekIdx} className="flex flex-col gap-1 items-center">
                          {/* Week label at top */}
                          <div className={`text-[7px] font-bold h-5 flex items-end pb-0.5 min-h-6 ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                            {weekIdx % 4 === 0 && weekLabel ? weekLabel : ''}
                          </div>

                          {/* 7 day cells (vertical column) - properly aligned */}
                          <div className="flex flex-col gap-1">
                            {week.map((day, dayIdx) => {
                              let intensity = isDarkMode ? 'bg-[#334155]' : 'bg-slate-100';

                              if (day && day.hasLogin) {
                                // Color intensity based on login count
                                if (day.count >= 3) {
                                  intensity = isDarkMode ? 'bg-[#00c4b4]' : 'bg-teal-600';
                                } else if (day.count === 2) {
                                  intensity = isDarkMode ? 'bg-[#00c4b4]/70' : 'bg-teal-400';
                                } else if (day.count === 1) {
                                  intensity = isDarkMode ? 'bg-[#00c4b4]/40' : 'bg-teal-200';
                                }
                              }

                              const isTodayOrRecent = () => {
                                if (!day) return false;
                                const today = new Date();
                                // Format today's date to YYYY-MM-DD to match the data
                                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                return day.date === todayStr;
                              };

                              return (
                                <div 
                                  key={dayIdx} 
                                  className={`w-3 h-3 rounded-sm ${intensity} hover:ring-1 hover:ring-offset-1 ${isDarkMode ? 'hover:ring-[#00c4b4]' : 'hover:ring-teal-400'} transition-all cursor-pointer ${isTodayOrRecent() ? `ring-1 ring-offset-1 ${isDarkMode ? 'ring-[#00c4b4]' : 'ring-teal-400'}` : ''}`}
                                  title={day ? `${day.date} (${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIdx]}) : ${day.hasLogin ? `✓ Done` : 'No login'}` : 'No data'}
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Login Stats Summary */}
            <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'} grid grid-cols-2 md:grid-cols-4 gap-4`}>
              {[
                { label: 'Total Days', value: loginCount },
                { label: 'Current Streak', value: calculateStreak() },
                { label: 'Longest Streak', value: calculateLongestStreak() },
                { label: 'Consistency', value: `${((loginCount / 365) * 100).toFixed(1)}%` }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-[#00c4b4]">{stat.value}</p>
                  <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Empty State --- */}
        {searchQuery && !showChart && !showHeatmap && filteredLiftStats.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No results found</h3>
            <p className="text-slate-500 mt-2">Try searching for "Weight", "Bench", or "Consistency".</p>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Progression;