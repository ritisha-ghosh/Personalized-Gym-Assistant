import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { Calendar, Clock, Dumbbell, CheckCircle2, X, Eye, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { DarkModeContext } from '../context/DarkModeContext';

const Workout = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);
  
  const [weekPlan, setWeekPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedExerciseIds, setcompletedExerciseIds] = useState([]);
  const [isWorkoutDoneToday, setIsWorkoutDoneToday] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayForModal, setSelectedDayForModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserExperience, setCurrentUserExperience] = useState(null);
  const [userGoal, setUserGoal] = useState(null);
  const [userInjury, setUserInjury] = useState(null);
  
  const [notes, setNotes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [noteText, setNoteText] = useState("");

  const formatLocalDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
       month: 'short',
       day: 'numeric',
       year: 'numeric'
    });
  };

  // ⭐ Fetch weekly plan from backend - REFETCH when user.experience changes
  useEffect(() => {
    const fetchWeeklyPlan = async () => {
      try {
        setLoading(true);
        console.log(`🔄 Fetching workout plan for user: ${user?.name}, Experience: ${user?.experience}`);
        
        const response = await api.get('/workouts/weekly-plan');
        console.log(`✅ Received workout plan - Experience used: ${response.data.user?.experienceLevel}`);
        
        setWeekPlan(response.data.weekPlan || []);
        setCurrentUserExperience(response.data.user?.experienceLevel);
        setUserGoal(response.data.user?.goal);
        setUserInjury(response.data.user?.injury);
        
        // If today is completed, mark all exercises as completed
        if (response.data.weekPlan[0]?.completed) {
          setIsWorkoutDoneToday(true);
          setcompletedExerciseIds(
            response.data.weekPlan[0].exercises.map((_, idx) => idx)
          );
        } else if (response.data.weekPlan.length > 0 && user?.id) {
          const saved = localStorage.getItem(`workout_completed_${user.id}_${response.data.weekPlan[0].date}`);
          if (saved) {
             setcompletedExerciseIds(JSON.parse(saved));
          } else {
             setcompletedExerciseIds([]);
          }
        }

        // Fetch custom notes
        const notesResponse = await api.get('/workouts/notes');
        if (notesResponse.data.status === 'success') {
          setNotes(notesResponse.data.notes);
        }
      } catch (error) {
        console.error("❌ Failed to fetch weekly plan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchWeeklyPlan();
    }
  }, [user?.id, user?.experience]); // ⭐ REFETCH when experience changes

  // Save checkbox state to localStorage
  useEffect(() => {
    if (weekPlan.length > 0 && user?.id && !isWorkoutDoneToday) {
       localStorage.setItem(`workout_completed_${user.id}_${weekPlan[0].date}`, JSON.stringify(completedExerciseIds));
    }
  }, [completedExerciseIds, weekPlan, user?.id, isWorkoutDoneToday]);

  // Manual refresh function
  const handleRefreshWorkouts = async () => {
    try {
      setRefreshing(true);
      console.log(`🔃 Manual refresh triggered for user: ${user?.name}, Experience: ${user?.experience}`);
      
      const response = await api.get('/workouts/weekly-plan');
      console.log(`✅ Refreshed workout plan - Experience used: ${response.data.user?.experienceLevel}`);
      
      setWeekPlan(response.data.weekPlan || []);
      setCurrentUserExperience(response.data.user?.experienceLevel);
      setUserGoal(response.data.user?.goal);
      setUserInjury(response.data.user?.injury);
      
      if (response.data.weekPlan[0]?.completed) {
        setIsWorkoutDoneToday(true);
        setcompletedExerciseIds(
          response.data.weekPlan[0].exercises.map((_, idx) => idx)
        );
      } else if (response.data.weekPlan.length > 0 && user?.id) {
          const saved = localStorage.getItem(`workout_completed_${user.id}_${response.data.weekPlan[0].date}`);
          if (saved) {
             setcompletedExerciseIds(JSON.parse(saved));
          } else {
             setcompletedExerciseIds([]);
          }
      }
      
      alert(`✅ Workouts refreshed! Experience Level: ${response.data.user?.experienceLevel}`);
    } catch (error) {
      console.error("❌ Refresh failed:", error);
      alert("Failed to refresh workouts");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNote = async () => {
    if (noteText.trim() && user?.id) {
      try {
        const response = await api.post('/workouts/notes', {
          note: noteText.trim()
        });
        if (response.data.log) {
          setNotes([{ _id: response.data.log._id, text: response.data.log.notes }, ...notes]);
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
      await api.delete(`/workouts/notes/${noteId}`);
      setNotes(notes.filter(n => n._id !== noteId));
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  // Toggle exercise completion
  const toggleExercise = (id) => {
    if (isWorkoutDoneToday) return; // Prevent unchecking if workout is already done for today
    setcompletedExerciseIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle complete workout for today
  const handleCompleteWorkout = async () => {
    if (isWorkoutDoneToday || completedExerciseIds.length !== weekPlan[0]?.exercises?.length) return;

    try {
      const logData = {
        status: "active",
        difficultyRating: 7,
        weight: user?.weight || 70,
        date: new Date(),
        exercisesLogged: completedExerciseIds
      };

      await api.post("/logs", logData);
      
      // Mark as completed
      setIsWorkoutDoneToday(true);
      alert("✅ Workout Logged Successfully!");
      
    } catch (error) {
      console.error("Workout log error:", error);
      alert(error?.response?.data?.message || "Failed to log workout");
    }
  };

  // View routine for a specific day
  const handleViewRoutine = async (dayIndex) => {
    setSelectedDayForModal(weekPlan[dayIndex]);
    setShowModal(true);
    setModalLoading(false);
  };

  // Calculate progress for today
  const todayProgressPercentage = weekPlan.length > 0 && weekPlan[0]
    ? Math.round((completedExerciseIds.length / (weekPlan[0].type === 'rest' ? 1 : Math.max(weekPlan[0].exercises?.length || 1, 1))) * 100)
    : 0;

  // Get today's plan
  const todayPlan = weekPlan.length > 0 ? weekPlan[0] : null;

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
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Libre Baskerville', serif; }
        `}
      </style>

      <div className="space-y-6 sm:space-y-8">

        {/* --- Page Specific Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Workout Plan</h1>
            <div className={`text-sm mt-2 flex gap-3 flex-wrap items-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>Experience Level : <span className={`font-semibold capitalize px-2 py-1 rounded-lg inline-block ${
                currentUserExperience === 'beginner' ? 'bg-blue-500/20 text-blue-400' :
                currentUserExperience === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {currentUserExperience || user?.experience || 'Loading...'}
              </span></p>
              {userGoal && <p>Goal : <span className={`font-semibold capitalize px-2 py-1 rounded-lg inline-block bg-[#00c4b4]/20 text-[#00c4b4]`}>
                {userGoal}
              </span></p>}
              {userInjury && <p>Injury Status : <span className={`font-semibold capitalize px-2 py-1 rounded-lg inline-block bg-orange-500/20 text-orange-500`}>
                {userInjury}
              </span></p>}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#00c4b4]/20 w-full sm:w-auto hover:-translate-y-0.5 active:translate-y-0 h-[48px]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Note</span>
              <span className="sm:hidden">Note</span>
            </button>
          </div>
        </div>

        {/* Add Note Form */}
        {showAddForm && (
          <div className={`p-4 sm:p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#00c4b4]/20'}`}>
            <textarea
              rows="3"
              placeholder="How are you feeling today? Add a custom workout note..."
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
                  {note.date && <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatLocalDate(note.date.split('T')[0])}</p>}
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
                {weekPlan.length > 0 && weekPlan[6] ? `${formatLocalDate(weekPlan[0].date)} - ${formatLocalDate(weekPlan[6].date)}` : 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Today</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {completedExerciseIds.length} of {todayPlan?.type === 'rest' ? 1 : (todayPlan?.exercises?.length || 0)} exercises
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#00c4b4]/10 text-[#00c4b4] flex items-center justify-center">
              <Dumbbell size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Focus</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {todayPlan?.title || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Injury Warning Box */}
        <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 shadow-sm ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
          <span className="font-bold text-base sm:text-lg">⚠️ Note : If you have an injury, please skip today's workout.</span>
        </div>

        {/* --- Workouts Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {/* Active Card (Today) */}
          {todayPlan && (
            <div className="lg:col-span-1 xl:col-span-1 row-span-2">
              <div className={`p-6 rounded-[2rem] border-2 shadow-xl h-full flex flex-col ${isWorkoutDoneToday ? 'border-green-500 shadow-green-500/10' : 'border-[#00c4b4] shadow-[#00c4b4]/10'} ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isWorkoutDoneToday ? 'text-green-500' : 'text-[#00c4b4]'}`}>
                      {todayPlan.dayName} (Today)
                    </span>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatLocalDate(todayPlan.date)}
                    </p>
                    <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {todayPlan.title}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${isWorkoutDoneToday ? 'bg-green-500' : 'bg-[#00c4b4]'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Today's Progress</span>
                    <span className={isWorkoutDoneToday ? 'text-green-500' : 'text-[#00c4b4]'}>{todayProgressPercentage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#334155] border-[#334155]' : 'bg-slate-100 border-slate-100'}`}>
                    <div
                      className={`h-full transition-all duration-500 ${isWorkoutDoneToday ? 'bg-green-500' : 'bg-[#00c4b4]'}`}
                      style={{ width: `${todayProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Exercises List */}
                {todayPlan.type === 'rest' ? (
                  <div className="space-y-4 flex-1">
                    <div
                      onClick={() => toggleExercise(0)}
                      className={`flex gap-4 items-center p-3 rounded-xl transition-all cursor-pointer border
                        ${completedExerciseIds.includes(0)
                          ? (isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200')
                          : (isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:bg-[#334155]/50' : 'bg-white border-slate-100 hover:bg-slate-50')
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${completedExerciseIds.includes(0) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                        {completedExerciseIds.includes(0) && <CheckCircle2 size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${completedExerciseIds.includes(0) ? (isDarkMode ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                          Rest & Recovery
                        </p>
                        <div className={`flex gap-3 text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>1 Full Day</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ${completedExerciseIds.includes(0) ? 'text-green-600 bg-green-500/10' : 'text-[#00c4b4] bg-[#00c4b4]/10'}`}>
                        Bodyweight
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1">
                    {todayPlan.exercises.map((exercise, idx) => {
                      const isDone = completedExerciseIds.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleExercise(idx)}
                          className={`flex gap-4 items-center p-3 rounded-xl transition-all cursor-pointer border
                            ${isDone
                              ? (isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200')
                              : (isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:bg-[#334155]/50' : 'bg-white border-slate-100 hover:bg-slate-50')
                            }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                            {isDone && <CheckCircle2 size={12} />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${isDone ? (isDarkMode ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                              {exercise.name}
                            </p>
                            <div className={`flex gap-3 text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span>{exercise.sets} Sets</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                              <span>{exercise.reps} Reps</span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ${isDone ? 'text-green-600 bg-green-500/10' : 'text-[#00c4b4] bg-[#00c4b4]/10'}`}>
                            {exercise.weight}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Complete Workout Button */}
                <button
                  disabled={isWorkoutDoneToday || completedExerciseIds.length !== (todayPlan.type === 'rest' ? 1 : todayPlan.exercises.length)}
                  onClick={handleCompleteWorkout}
                  className={`w-full mt-6 py-4 font-bold rounded-xl transition-all shadow-md flex justify-center items-center gap-2 ${
                    isWorkoutDoneToday
                      ? 'bg-green-500 text-white cursor-default shadow-none'
                      : completedExerciseIds.length === (todayPlan.type === 'rest' ? 1 : todayPlan.exercises.length)
                        ? 'bg-[#00c4b4] text-white hover:bg-[#00a89f] cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
                        : (isDarkMode ? 'bg-[#334155] text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none')
                  }`}
                >
                  {isWorkoutDoneToday
                    ? <><CheckCircle2 size={20} /> Done for Today</>
                    : completedExerciseIds.length === (todayPlan.type === 'rest' ? 1 : todayPlan.exercises.length)
                      ? (todayPlan.type === 'rest' ? "✅ Complete Rest Day" : "✅ Complete Workout")
                      : `Finish ${(todayPlan.type === 'rest' ? 1 : todayPlan.exercises.length) - completedExerciseIds.length} more to Complete`}
                </button>
              </div>
            </div>
          )}

          {/* Other Days Cards */}
          {weekPlan.slice(1).map((day, idx) => (
            <div key={idx + 1} className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow flex flex-col ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {day.dayName}
                </span>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {formatLocalDate(day.date)}
                </p>
              </div>
              
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {day.title}
              </h3>

              {day.type === 'rest' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="text-3xl mb-2">
                    😴
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Complete Rest Day
                  </p>
                </div>
              ) : (
                <div className="flex-1 space-y-3">
                  {day.exercises.slice(0, 3).map((exercise, i) => (
                    <div key={i} className={`flex justify-between items-start text-sm border-b pb-2 last:border-0 ${isDarkMode ? 'border-[#334155]' : 'border-slate-50'}`}>
                      <div>
                        <span className={`font-semibold block ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {exercise.name}
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </div>
                      <span className="text-[#00c4b4] font-bold text-xs bg-[#00c4b4]/10 px-2 py-1 rounded whitespace-nowrap">
                        {exercise.weight}
                      </span>
                    </div>
                  ))}
                  {day.exercises.length > 3 && (
                    <p className={`text-xs italic pt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      +{day.exercises.length - 3} more exercises
                    </p>
                  )}
                </div>
              )}

              <button 
                onClick={() => handleViewRoutine(idx + 1)}
                className={`w-full mt-6 py-3 font-bold rounded-xl transition-all text-sm active:scale-95 flex items-center justify-center gap-2 ${isDarkMode ? 'bg-[#00c4b4]/10 text-[#00c4b4] hover:bg-[#00c4b4]/20' : 'bg-[#00c4b4]/5 text-[#00c4b4] hover:bg-[#00c4b4]/10'}`}>
                <Eye size={16} />
                View Routine
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* View Routine Modal */}
      {showModal && selectedDayForModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedDayForModal.dayName}
                </h2>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {formatLocalDate(selectedDayForModal.date)}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-[#1e293b] text-white hover:bg-[#334155]' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                <X size={20} />
              </button>
            </div>

            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {selectedDayForModal.title}
            </h3>

            {selectedDayForModal.type === 'rest' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">
                  😴
                </div>
                <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Today is a complete rest day. Focus on recovery, hydration, and sleep!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayForModal.exercises.map((exercise, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {exercise.name}
                      </h4>
                      <span className="text-[#00c4b4] font-bold text-sm bg-[#00c4b4]/10 px-2 py-1 rounded">
                        {exercise.weight}
                      </span>
                    </div>
                    <div className={`flex gap-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>Sets: {exercise.sets}</span>
                      <span>Reps: {exercise.reps}</span>
                      {exercise.muscleGroup && (
                        <span className="capitalize text-[#00c4b4]">{exercise.muscleGroup}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 py-3 bg-[#00c4b4] text-white font-bold rounded-xl hover:bg-[#00a89f] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Workout;