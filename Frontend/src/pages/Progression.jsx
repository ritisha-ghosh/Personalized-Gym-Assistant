import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { Download, Filter } from 'lucide-react';
import { getProgression } from "../utils/storageUtils";
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

// CORRECTED PDF Generation Imports for Vite/React
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import the extracted WeightTrendCard
import WeightTrendCard from "../componenets/cards/WeightTrendCard";

const Progression = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [timeRange, setTimeRange] = useState('6 Months');
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  // Dynamic Workout States
  const [workoutHeatmapData, setWorkoutHeatmapData] = useState([]);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [workoutDates, setWorkoutDates] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]); // Raw logs for PDF

  // Helper to get local date string YYYY-MM-DD safely
  const toYYYYMMDD = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Fetch user progress & workout logs from backend
  const loadProgressionData = useCallback(async () => {
      if (!user?.id) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch User Profile
        const profileResponse = await api.get('/users/profile');
        const profileData = profileResponse.data.user;
        setUserProfile(profileData);

        // 2. Load real Weight Data from Local Storage or use current weight from profile
        const progression = getProgression(user.id);
        let historicalWeight = progression.weightData || [];

        // If no historical data exists, create a single entry with the current weight from the backend profile.
        if (historicalWeight.length === 0 && profileData.weight) {
            const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
            historicalWeight = [{ month: currentMonth, weight: profileData.weight }];
        }
        setWeightData(historicalWeight);

        // 3. Fetch Dynamic Workout Logs from Backend
        const logsResponse = await api.get('/logs');
        const logs = logsResponse.data.logs || logsResponse.data || [];
        setWorkoutLogs(logs); // Store raw logs for PDF generation

        // 4. Process Logs into Heatmap Data
        const activeLogs = logs.filter(log => log.status === "active");
        
        const dates = activeLogs.map(log => {
          const d = new Date(log.date || log.createdAt);
          return toYYYYMMDD(d);
        });
        
        const uniqueDates = [...new Set(dates)];
        setWorkoutDates(uniqueDates);
        setWorkoutCount(uniqueDates.length);

        // Count workouts per day for color intensity
        const dateCounts = {};
        dates.forEach(date => {
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        // Generate exactly 365 days of history for the heatmap
        const heatmapData = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = toYYYYMMDD(d);
          
          heatmapData.push({
            date: dateStr,
            hasWorkout: uniqueDates.includes(dateStr),
            count: dateCounts[dateStr] || 0
          });
        }
        setWorkoutHeatmapData(heatmapData);

      } catch (error) {
        console.error("Failed to fetch progression data", error);
      } finally {
        setLoading(false);
      }
  }, [user?.id]);

  useEffect(() => {
    loadProgressionData();
  }, [loadProgressionData]);

  // Refetch when window regains focus
  useEffect(() => {
    const handleFocus = () => loadProgressionData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadProgressionData]);

  // --- Dynamic Streak Calculations ---
  const calculateStreak = () => {
    if (!workoutDates || workoutDates.length === 0) return 0;
    let streak = 0;
    let checkDate = new Date();
    if (!workoutDates.includes(toYYYYMMDD(checkDate))) checkDate.setDate(checkDate.getDate() - 1);
    while (workoutDates.includes(toYYYYMMDD(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  const calculateLongestStreak = () => {
    if (!workoutDates || workoutDates.length === 0) return 0;
    const sortedDates = [...workoutDates].sort();
    if (sortedDates.length <= 1) return sortedDates.length;

    let longest = 1;
    let current = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1] + 'T12:00:00Z');
      const currDate = new Date(sortedDates[i] + 'T12:00:00Z');
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) current++;
      else if (diffDays > 1) current = 1;
      longest = Math.max(longest, current);
    }
    return longest;
  };

  // --- PDF Generation Logic ---
  const handleExportReport = () => {
    if (!userProfile || workoutLogs.length === 0) {
      alert("Not enough data to generate a report. Please log a workout first!");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // 1. Header Section
      doc.setFontSize(22);
      doc.setTextColor(0, 196, 180); // Teal 500
      doc.text("BeFit Progress Report", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      
      // Format current date for the generation timestamp (DD-Month-YYYY)
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const monthName = today.toLocaleString('default', { month: 'long' });
      const yyyy = today.getFullYear();
      doc.text(`Generated on: ${dd}-${monthName}-${yyyy} at ${today.toLocaleTimeString()}`, 14, 30);
      
      // 2. User Profile Info
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59); // Slate 800
      doc.text("Athlete Profile", 14, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: [
          ['Name', userProfile.name || 'N/A'],
          ['Goal', userProfile.goal ? userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1) : 'N/A'],
          ['Current Weight', `${userProfile.weight || 'N/A'} kg`],
          ['Height', `${userProfile.height || 'N/A'} cm`],
          ['Diet Type', userProfile.dietType || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [0, 196, 180], textColor: 255 },
        styles: { fontSize: 11 },
        margin: { top: 10 }
      });

      // 3. Workout Statistics
      const finalYProfile = doc.lastAutoTable.finalY || 50;
      doc.setFontSize(14);
      doc.text("Workout Statistics", 14, finalYProfile + 15);
      
      autoTable(doc, {
        startY: finalYProfile + 20,
        head: [['Total Workouts', 'Current Streak', 'Longest Streak', 'Consistency (1 Yr)']],
        body: [[
          workoutCount.toString(),
          `${calculateStreak()} Days`,
          `${calculateLongestStreak()} Days`,
          `${((workoutCount / 365) * 100).toFixed(1)}%`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [219, 39, 119], textColor: 255 }, // Pink 600
        styles: { halign: 'center', fontSize: 11 },
      });

      // 4. Workout History Log (Table)
      const finalYStats = doc.lastAutoTable.finalY || finalYProfile + 20;
      doc.setFontSize(14);
      doc.text("Recent Workout Logs (Last 30 Days)", 14, finalYStats + 15);
      
      const filteredLogs = workoutLogs.filter(log => !['note', 'diet_day_completed'].includes(log.status));
      
      // Helper to find the last recorded weight on or before a given date
      const getHistoricalWeight = (targetDate, isToday) => {
        // For today, always prioritize the live profile weight, regardless of workout status
        if (isToday && userProfile?.weight) {
          return `${userProfile.weight} kg`;
        }

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const pastLogs = workoutLogs
          .filter(l => l.weight && new Date(l.date || l.createdAt) <= endOfDay)
          .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
          
        if (pastLogs.length > 0) return `${pastLogs[0].weight} kg`;
        
        // Return '-' instead of a default profile weight for days before any logs exist
        return '-';
      };
      
      const logDataForTable = [];
      const todayDate = new Date();
      
      // Generate exactly the last 30 days to include skipped days
      for (let i = 0; i < 30; i++) {
        const targetDate = new Date(todayDate);
        targetDate.setDate(todayDate.getDate() - i);
        
        const day = String(targetDate.getDate()).padStart(2, '0');
        const monthStr = targetDate.toLocaleString('default', { month: 'long' });
        const year = targetDate.getFullYear();
        const formattedDate = `${day}-${monthStr}-${year}`;
        
        const targetYMD = `${year}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${day}`;
        
        // Find if any log exists for this date
        const dayLogs = filteredLogs.filter(log => {
          const lDate = new Date(log.date || log.createdAt);
          const lYMD = `${lDate.getFullYear()}-${String(lDate.getMonth() + 1).padStart(2, '0')}-${String(lDate.getDate()).padStart(2, '0')}`;
          return lYMD === targetYMD;
        });
        
        // Get actual historical weight for this specific date
        const historicalWeight = getHistoricalWeight(targetDate, i === 0);

        if (dayLogs.length > 0) {
          // Use the most recent log if there are multiple on the same day
          const latestLog = dayLogs.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))[0];
          const displayStatus = latestLog.status === 'active' 
            ? 'Completed' 
            : latestLog.status ? latestLog.status.charAt(0).toUpperCase() + latestLog.status.slice(1) : 'Completed';
            
          const weightDisplay = latestLog.weight ? `${latestLog.weight} kg` : historicalWeight;
          
          logDataForTable.push([formattedDate, displayStatus, weightDisplay]);
        } else {
          // Skipped day
          logDataForTable.push([formattedDate, 'Not Completed', historicalWeight]);
        }
      }

      autoTable(doc, {
        startY: finalYStats + 20,
        head: [['Date', 'Workout Status', 'Body Weight logged']],
        body: logDataForTable,
        theme: 'striped',
        headStyles: { fillColor: [51, 65, 85], textColor: 255 }, // Slate 700
        styles: { fontSize: 10 },
      });

      // 5. Download the PDF
      const safeName = (userProfile?.name || 'User').replace(/\s+/g, '_');
      doc.save(`BeFit_Report_${safeName}.pdf`);

    } catch (err) {
      console.error("PDF Generation Error: ", err);
      console.error(err.stack); // This prints the detailed error in console
      alert("Error generating PDF. Check console for details.");
    }BeFit
  };

  // --- FILTER LOGIC ---
  const liftStats = []; // Lift stats removed/commented logically
  const showChart = !searchQuery || ['weight', 'trend', 'kg', 'loss', 'body'].some(kw => searchQuery.toLowerCase().includes(kw));
  const showHeatmap = !searchQuery || ['consistency', 'heatmap', 'streak', 'history', 'days', 'workout'].some(kw => searchQuery.toLowerCase().includes(kw));
  const filteredLiftStats = []; 

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={handleExportReport}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-px active:scale-95 shadow-sm ${
                  isDarkMode 
                    ? 'bg-[#1e293b] border border-[#334155] text-slate-200 hover:bg-[#00c4b4]/20 hover:border-[#00c4b4]/50 hover:text-[#00c4b4]' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#00c4b4]/10 hover:border-[#00c4b4]/40 hover:text-[#00c4b4]'
                }`}
              >
                <Download size={18} />
                Export
              </button>
            </div>
            <div className={`hidden md:flex items-center gap-3 pl-4 border-l ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="text-right">
                <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Goal : {userProfile?.goal ? userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1) : 'N/A'}</p>
              </div>
              {/* Added border-2 for thicker border */}
              <div
                className={`w-10 h-10 rounded-full bg-cover bg-center border-2 shadow-sm ${isDarkMode ? 'border-slate-500' : 'border-slate-300'}`}
                style={{
                  backgroundImage: userProfile?.profileImage ? `url(${userProfile.profileImage})` : 'linear-gradient(to top right, #fde047, #f59e0b)',
                  backgroundColor: !userProfile?.profileImage ? '#facc15' : 'transparent'
                }}
              ></div>
            </div>
          </div>
        </div>

        {searchQuery && (
          <p className="text-sm font-bold text-teal-500 animate-pulse">
            Filtering results for: "{searchQuery}"
          </p>
        )}

        {/* --- IMPORTED WEIGHT TREND CARD --- */}
        {showChart && (
          <div className="h-96">{/* Wrapper with explicit height to fix chart rendering */}
            <WeightTrendCard />
          </div>
        )}

        {/* --- Workout Consistency Heatmap (Dynamic from Backend) --- */}
        {showHeatmap && (
          <div className={`p-8 rounded-[2rem] border shadow-sm overflow-x-auto animate-fade-in ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-end mb-8 min-w-[600px]">
              <div>
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Workout Consistency</h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#cbd5e1]' : 'text-slate-400'}`}>
                  You have logged <span className='text-[#00c4b4] font-bold'>{workoutCount} workouts</span> in the last year.
                  <span className={`ml-2 font-bold ${isDarkMode ? 'text-[#00c4b4]' : 'text-teal-600'}`}>Keep pushing! 💪</span>
                </p>
              </div>
            </div>

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
                  {(() => {
                    const weeks = [];
                    let currentWeek = Array(7).fill(null);

                    workoutHeatmapData.forEach((day) => {
                      const dateObj = new Date(day.date + 'T12:00:00Z');
                      let dayOfWeek = dateObj.getUTCDay(); 
                      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 

                      currentWeek[dayOfWeek] = day;

                      if (dayOfWeek === 6) {
                        weeks.push([...currentWeek]);
                        currentWeek = Array(7).fill(null);
                      }
                    });

                    if (currentWeek.some(d => d !== null)) {
                      weeks.push(currentWeek);
                    }

                    return weeks.map((week, weekIdx) => {
                      const firstValidDay = week.find(d => d !== null);
                      let weekLabel = '';
                      
                      if (firstValidDay) {
                        const weekStartDate = new Date(firstValidDay.date);
                        const month = weekStartDate.toLocaleDateString('en-US', { month: 'short' });
                        weekLabel = `${month}`; 
                      }

                      return (
                        <div key={weekIdx} className="flex flex-col gap-1 items-center">
                          {/* Week label at top */}
                          <div className={`text-[7px] font-bold h-5 flex items-end pb-0.5 min-h-6 ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                            {weekIdx % 4 === 0 && weekLabel ? weekLabel : ''}
                          </div>

                          {/* 7 day cells */}
                          <div className="flex flex-col gap-1">
                            {week.map((day, dayIdx) => {
                              let intensity = isDarkMode ? 'bg-[#334155]' : 'bg-slate-100';

                              if (day && day.hasWorkout) {
                                intensity = 'bg-[#00c4b4]';
                              }

                              const isTodayOrRecent = () => {
                                if (!day) return false;
                                const today = new Date();
                                const todayStr = toYYYYMMDD(today);
                                return day.date === todayStr;
                              };

                              // Generate formatted date for Tooltip DD-MonthName-YYYY
                              let tooltipDate = 'No data';
                              if (day) {
                                const [y, m, d] = day.date.split('-');
                                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                const formattedDate = `${d}-${monthNames[parseInt(m, 10) - 1]}-${y}`;
                                tooltipDate = `${formattedDate} (${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIdx]}) : ${day.hasWorkout ? '✓ Done' : 'No workout'}`;
                              }

                              return (
                                <div 
                                  key={dayIdx} 
                                  className={`w-3 h-3 rounded-sm ${intensity} hover:ring-1 hover:ring-offset-1 ${isDarkMode ? 'hover:ring-[#00c4b4]' : 'hover:ring-teal-400'} transition-all cursor-pointer ${isTodayOrRecent() ? `ring-1 ring-offset-1 ${isDarkMode ? 'ring-[#00c4b4]' : 'ring-teal-400'}` : ''}`}
                                  title={tooltipDate}
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

            {/* Workout Stats Summary */}
            <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'} grid grid-cols-2 md:grid-cols-4 gap-4`}>
              {[
                { label: 'Total Workouts', value: workoutCount },
                { label: 'Current Streak', value: `${calculateStreak()} Days` },
                { label: 'Longest Streak', value: `${calculateLongestStreak()} Days` },
                { label: 'Consistency', value: `${((workoutCount / 365) * 100).toFixed(1)}%` }
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
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-[#334155] text-slate-300' : 'bg-slate-100 text-slate-400'}`}>
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No results found</h3>
            <p className="text-slate-500 mt-2">Try searching for "Weight", "Trend", or "Consistency".</p>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Progression;