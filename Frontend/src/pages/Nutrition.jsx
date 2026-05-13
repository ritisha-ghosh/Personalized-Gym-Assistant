import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { Calendar, Clock, Droplet, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

const Neutrations = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [userDietData, setUserDietData] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [notes, setNotes] = useState([]);
  const [completedMeals, setCompletedMeals] = useState([]);
  const [allMealsCompletedToday, setAllMealsCompletedToday] = useState(false);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);

  const getTodayDateString = () => new Date().toISOString().split("T")[0];
  
  const formatLocalDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
       month: 'short',
       day: 'numeric',
       year: 'numeric'
    });
  };
  
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long' });
  };

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setLoading(true);
        console.log(`🔄 Fetching nutrition plan for user: ${user?.name}`);

        // Fetch User Profile
        const userResponse = await api.get('/users/profile');
        const userData = userResponse.data.user;
        setUserDietData({
          dietType: userData.dietType,
          noOnion: userData.noOnion,
          noGarlic: userData.noGarlic,
          glutenFree: userData.glutenFree,
          goal: userData.goal,
          weight: userData.weight
        });

        // Fetch Weekly Plan with ML integration
        const planResponse = await api.get('/diet-tracking/weekly-plan');
        if (planResponse.data.status === 'success') {
          const plan = planResponse.data.plan;
          setWeeklyPlan(plan);
          console.log(`✅ Received nutrition plan - Days: ${plan.length}`);
          
          // Set completed meals from today's plan
          const todayPlan = plan.find(p => p.isToday);
          if (todayPlan) {
            const todayMeals = todayPlan.meals || [];
            const completedMealTypes = todayMeals
              .filter(m => m.status === 'done')
              .map(m => m.type);
            setCompletedMeals(completedMealTypes);
            setAllMealsCompletedToday(completedMealTypes.length === todayMeals.length);
          }
        }

        // Fetch ALL notes (not just today's) from the backend
        const notesResponse = await api.get('/diet-tracking/notes');
        if (notesResponse.data.status === 'success') {
          setNotes(notesResponse.data.notes || []);
          console.log(`✅ Received ${notesResponse.data.notes?.length || 0} notes`);
        }
      } catch (error) {
        console.error("❌ Failed to fetch diet data", error);
      }
      setLoading(false);
    };

    if (user?.id) {
      fetchNutritionData();
    }
  }, [user?.id]);

  const handleAddNote = async () => {
    if (noteText.trim() && user?.id) {
      try {
        const response = await api.post('/diet-tracking/add-note', {
          date: getTodayDateString(),
          note: noteText.trim()
        });
        if (response.data.status === 'success') {
          setNotes([response.data.note, ...(notes || [])]);
          setNoteText("");
          setShowAddForm(false);
        }
      } catch (err) {
        console.error("Failed to add note", err);
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await api.delete(`/diet-tracking/notes/${noteId}`);
      if (response.data.status === 'success') {
        setNotes((notes || []).filter(n => n._id !== noteId));
      }
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  const handleToggleMeal = async (date, mealType, isToday) => {
    if (!isToday) return; // Only allow toggling for today
    try {
      const response = await api.post('/diet-tracking/toggle-meal', {
        date,
        mealType
      });
      if (response.data.status === 'success') {
        // Update local state
        const newCompleted = response.data.completedMeals;
        setCompletedMeals(newCompleted);
        
        // Update the weekly plan
        const updatedPlan = weeklyPlan.map(dayPlan => {
          if (dayPlan.date === date) {
            const updatedMeals = dayPlan.meals.map(m => ({
              ...m,
              status: newCompleted.includes(m.type) ? "done" : "pending"
            }));
            const todayMeals = updatedMeals;
            setAllMealsCompletedToday(newCompleted.length === todayMeals.length);
            return { ...dayPlan, meals: updatedMeals };
          }
          return dayPlan;
        });
        setWeeklyPlan(updatedPlan);
      }
    } catch (err) {
      console.error("Failed to toggle meal", err);
    }
  };

  // Calculate meal progress for today
  const todayPlan = weeklyPlan.find(p => p.isToday) || { meals: [] };
  const todayMealProgress = todayPlan.meals ? (completedMeals.length / todayPlan.meals.length) * 100 : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c4b4]"></div>
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

      <div className="space-y-6 sm:space-y-8">

        {/* --- Page Specific Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Meal Plan</h1>
            <div className={`text-sm mt-2 flex gap-3 flex-wrap items-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {userDietData && (
                <>
                  <p>Diet Type : <span className={`font-semibold capitalize px-2 py-1 rounded-lg inline-block bg-[#00c4b4]/20 text-[#00c4b4]`}>
                    {userDietData.dietType}
                  </span></p>
                  {userDietData.noOnion && <p className={`font-semibold px-2 py-1 rounded-lg inline-block bg-orange-500/20 text-orange-400`}>No Onion</p>}
                  {userDietData.noGarlic && <p className={`font-semibold px-2 py-1 rounded-lg inline-block bg-orange-500/20 text-orange-400`}>No Garlic</p>}
                  {userDietData.glutenFree && <p className={`font-semibold px-2 py-1 rounded-lg inline-block bg-orange-500/20 text-orange-400`}>Gluten-Free</p>}
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#00c4b4]/20 w-full sm:w-auto hover:-translate-y-0.5 active:translate-y-0 h-[48px]"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Note</span>
            <span className="sm:hidden">Note</span>
          </button>
        </div>

        {/* Add Note Form */}
        {showAddForm && (
          <div className={`p-4 sm:p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#00c4b4]/20'}`}>
            <textarea
              rows="3"
              placeholder="How are you feeling today? Any cravings or off-plan meals?"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/50 border resize-none ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddNote}
                className="flex-1 bg-[#00c4b4] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#00a89f] transition text-sm shadow-md shadow-[#00c4b4]/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Save Note
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition text-sm active:scale-95 ${isDarkMode ? 'bg-[#334155] text-white hover:bg-[#475569]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notes && notes.length > 0 && (
          <div className={`space-y-3`}>
            {notes.map((note) => (
              <div key={note._id} className={`p-4 rounded-xl border flex justify-between items-start transition gap-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{note.text}</p>
                  {note.date && <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatLocalDate(note.date)}</p>}
           {/*       {note.time && <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(note.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>}  */} 
                </div>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-red-500 hover:text-red-700 transition active:scale-90 p-2 flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x ${isDarkMode ? 'bg-[#1e293b] border-[#334155] divide-[#334155]' : 'bg-white border-slate-100 divide-slate-100'}`}>
          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Week Range</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {weeklyPlan.length > 0 && weeklyPlan[6] ? `${formatLocalDate(weeklyPlan[0].date)} - ${formatLocalDate(weeklyPlan[6].date)}` : 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#00c4b4]/10 text-[#00c4b4] flex items-center justify-center">
              <Droplet size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meals Completed Today</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {completedMeals.length} of {todayPlan?.meals?.length || 0} meals
              </p>
            </div>
          </div>


        </div>

        {/* --- Hydration Tips Section --- */}
        <div className={`rounded-[2rem] p-4 md:p-5 relative overflow-hidden ${isDarkMode ? 'bg-transparent border border-transparent text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/20'}`}>
          {!isDarkMode && <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>}
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
              {/*  <Droplet size={20} className="text-cyan-200" /> */}
                <p className="text-xl font-bold tracking-widest uppercase text-white/80">💧 Hydration Tip</p>
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-tight">
                Drink 500ml of water before each meal
              </h2>
              <p className={`text-sm mt-2 max-w-md ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>
                Staying hydrated improves digestion and keeps your metabolism active!
              </p>
            </div>
        <div className={`backdrop-blur-md p-7 rounded-xl border text-center min-w-[240px] max-w-[280px] ${isDarkMode ? 'bg-transparent border-transparent' : 'bg-black/20 border-white/30'}`}>
              <div className="text-xl font-bold mb-1 leading-tight text-white">🍕 Cheat  Food 🍔</div>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>is OK sometimes to change taste!</p>
            </div>
          </div>
        </div>

        {/* --- Meal Plan Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {/* Active Card (Today) */}
          {todayPlan && todayPlan.meals && todayPlan.meals.length > 0 && (
            <div className="lg:col-span-1 xl:col-span-1 row-span-2">
              <div className={`p-6 rounded-[2rem] border-2 shadow-xl h-full flex flex-col ${allMealsCompletedToday ? 'border-green-500 shadow-green-500/10' : 'border-[#00c4b4] shadow-[#00c4b4]/10'} ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold uppercase tracking-wider block break-words ${allMealsCompletedToday ? 'text-green-500' : 'text-[#00c4b4]'}`}>
                      {getDayName(todayPlan.date)} (Today)
                    </span>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatLocalDate(todayPlan.date)}
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 ${allMealsCompletedToday ? 'bg-green-500' : 'bg-[#00c4b4]'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Meal Progress</span>
                    <span className={allMealsCompletedToday ? 'text-green-500' : 'text-[#00c4b4]'}>{Math.round(todayMealProgress)}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#334155] border-[#334155]' : 'bg-slate-100 border-slate-100'}`}>
                    <div
                      className={`h-full transition-all duration-500 ${allMealsCompletedToday ? 'bg-green-500' : 'bg-[#00c4b4]'}`}
                      style={{ width: `${todayMealProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meals List */}
                <div className="space-y-3 flex-1">
                  {todayPlan.meals.map((meal, idx) => {
                    const isDone = completedMeals.includes(meal.type);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleMeal(todayPlan.date, meal.type, true)}
                        className={`flex gap-3 items-start p-3 rounded-xl transition-all cursor-pointer border
                          ${isDone
                            ? (isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200')
                            : (isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:bg-[#334155]/50' : 'bg-white border-slate-100 hover:bg-slate-50')
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                          {isDone && <CheckCircle2 size={12} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-base font-extrabold break-words ${isDone ? (isDarkMode ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                            {meal.type}
                          </p>
                          <p className={`text-sm font-bold mt-1 leading-tight break-words ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {meal.food}
                          </p>
                          <div className={`flex items-center gap-3 text-xs mt-2`}>
                            <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{meal.time}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${isDone ? 'text-green-600 bg-green-500/10' : 'text-[#00c4b4] bg-[#00c4b4]/10'}`}>
                              {meal.cal}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Completion Status Text */}
                <div className={`mt-6 text-center font-bold text-sm ${allMealsCompletedToday ? 'text-green-500' : 'text-[#00c4b4]'}`}>
                  {allMealsCompletedToday
                    ? "✅ All meals done"
                    : `${todayPlan.meals.length - completedMeals.length} more to complete`}
                </div>

              </div>
            </div>
          )}

          {/* Other Days Cards */}
          {weeklyPlan.slice(1).map((day, idx) => (
            <div key={idx + 1} className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow flex flex-col ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {getDayName(day.date)}
                </span>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {formatLocalDate(day.date)}
                </p>
              </div>
              
              <div className="flex-1 space-y-2">
                {day.meals.slice(0, 4).map((meal, i) => (
                  <div key={i} className={`flex flex-col items-start gap-1.5 text-sm border-b pb-2 last:border-0 ${isDarkMode ? 'border-[#334155]' : 'border-slate-50'}`}>
                    <div className="w-full break-words">
                      <span className={`text-base font-extrabold block break-words ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {meal.type}
                      </span>
                      <span className={`text-sm font-bold block leading-tight mt-0.5 break-words ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {meal.food}
                      </span>
                    </div>
                    <span className="text-[#00c4b4] font-bold text-xs bg-[#00c4b4]/10 px-2 py-0.5 rounded whitespace-nowrap inline-block">
                      {meal.cal}
                    </span>
                  </div>
                ))}
                {day.meals.length > 4 && (
                  <p className={`text-xs italic pt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    +{day.meals.length - 4} more meals
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default Neutrations;
