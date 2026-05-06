import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import Hook
import Layout from "../componenets/layout/Layout";
import { Calendar, Clock, BarChart3, Dumbbell, Play, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { getWorkouts, addWorkout, deleteWorkout } from "../utils/storageUtils";
import { AuthContext } from '../context/AuthContext';  // 👈 Import AuthContext
import api from '../utils/api';
import { DarkModeContext } from '../context/DarkModeContext'; // Import DarkModeContext

const Workout = () => {
  // 2. Search Params Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);  // 👈 Get logged-in user

  const { isDarkMode } = useContext(DarkModeContext); // Get dark mode state
  const [activeTab, setActiveTab] = useState('Current Week');
  const [workouts, setWorkouts] = useState([]);
  const [userWorkoutPlans, setUserWorkoutPlans] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    duration: '',
    notes: '',
  });

  // --- NEW: Execution State to do checkable exercise---
  const [completedExerciseIds, setcompletedExerciseIds] = useState([]);

  // Fetch workout plans from backend
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get('/workouts');
        setUserWorkoutPlans(response.data || []);
      } catch (error) {
        console.error("Failed to fetch workout plans", error);
      }
      
      // Also get local workouts - NOW USER-SPECIFIC
      if (user?.id) {
        const savedWorkouts = getWorkouts(user.id);  // 👈 Pass userId
        setWorkouts(savedWorkouts);
        console.log(`📥 Loaded ${savedWorkouts.length} workouts for user ${user.id}`);
      }
      setLoading(false);
    };

    fetchWorkoutPlans();
  }, [user?.id]);  // 👈 Re-fetch when user changes

  // --- Smart Tab Switching ---
  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (lowerQuery.includes('next')) setActiveTab('Next Week');
      else if (lowerQuery.includes('current')) setActiveTab('Current Week');
    }
  }, [searchQuery]);

  const handleAddWorkout = () => {
    if (formData.exercise.trim() && user?.id) {
      const newWorkout = addWorkout(user.id, formData);  // 👈 Pass userId
      setWorkouts([...workouts, newWorkout]);
      setFormData({ exercise: '', sets: '', reps: '', duration: '', notes: '' });
      setShowAddForm(false);
      console.log(`✅ Workout added for user ${user.id}`);
    }
  };

  const handleDeleteWorkout = (id) => {
    if (user?.id) {
      deleteWorkout(user.id, id);  // 👈 Pass userId
      setWorkouts(workouts.filter(w => w.id !== id));
      console.log(`✅ Workout deleted for user ${user.id}`);
    }
  };

  // --- 3. FILTER LOGIC ---

  // A. Filter Recent Workouts (User Added)
  // Search matches: Exercise Name OR Sets/Reps details
  const filteredSavedWorkouts = workouts.filter(w =>
    !searchQuery ||
    w.exercise.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.sets && w.sets.toString().includes(searchQuery)) ||
    (w.reps && w.reps.toString().includes(searchQuery))
  );

  // B. Define Static Routine Data (with fallbacks for demo)
  const mondayRoutine = {
    day: 'Monday',
    title: 'Chest & Triceps',
    exercises: [
      { id: '01', name: 'Bench Press (Barbell)', sets: '4 Sets', reps: '8-10 Reps', weight: '85 kg' },
      { id: '02', name: 'Incline DB Press', sets: '3 Sets', reps: '12 Reps', weight: '28 kg' },
      { id: '03', name: 'Cable Flyes', sets: '3 Sets', reps: '15 Reps', weight: '15 kg' },
      { id: '04', name: 'Skullcrushers', sets: '4 Sets', reps: '10 Reps', weight: '30 kg' },
    ]
  };

  const otherDaysRoutine = [
    { day: 'Tuesday', title: 'Back & Biceps', exercises: [{ name: 'Pull-ups', detail: '4 x MAX' }, { name: 'Barbell Row', detail: '3 x 10' }, { name: 'Hammer Curls', detail: '3 x 12' }] },
    { day: 'Wednesday', title: 'Active Recovery', type: 'recovery', desc: '30 min Yoga or Light Walk recommended by AI Coach.' },
    { day: 'Thursday', title: 'Shoulders & Abs', exercises: [{ name: 'Military Press', detail: '4 x 8' }, { name: 'Lateral Raises', detail: '3 x 15' }] },
    { day: 'Friday', title: 'Leg Day (Quads)', exercises: [{ name: 'Barbell Squats', detail: '5 x 5' }] },
    { day: 'Saturday', title: 'Leg Day (Hams)', exercises: [{ name: 'Deadlift', detail: '3 x 8' }] },
    { day: 'Sunday', title: 'Full Body Pump', exercises: [{ name: 'Circuit 1', detail: '3 Rounds' }] },
  ];

  // This logic calculates progress based on the Monday Routine
  const progressPercentage = useMemo(() => {
    const total = mondayRoutine.exercises.length;
    const completed = mondayRoutine.exercises.filter(ex =>
      completedExerciseIds.includes(ex.id)
    ).length;
    return Math.round((completed / total) * 100);
  }, [completedExerciseIds]);

  const toggleExercise = (id) => {
    setcompletedExerciseIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // C. Filter Logic for Routine Cards
  // Check if Monday matches search
  const showMondayCard = !searchQuery ||
    mondayRoutine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mondayRoutine.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mondayRoutine.exercises.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Check other days
  const filteredRoutineCards = otherDaysRoutine.filter(card => {
    const titleMatch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const dayMatch = card.day.toLowerCase().includes(searchQuery.toLowerCase());
    const exerciseMatch = card.exercises?.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const descMatch = card.desc?.toLowerCase().includes(searchQuery.toLowerCase());

    return !searchQuery || titleMatch || dayMatch || exerciseMatch || descMatch;
  });

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
      {/* Inject Fonts locally if not already global */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className="space-y-6 sm:space-y-8">

        {/* --- Page Specific Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Weekly Workout Plan</h1>
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs sm:text-sm font-semibold overflow-x-auto">
              {['Current Week', 'Next Week'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#00c4b4]/20 w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Workout</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Smart Search Feedback */}
        {searchQuery && (
          <p className="text-sm font-bold text-[#00c4b4] mt-2 animate-pulse transition-all">
            Searching for "{searchQuery}" in {activeTab}...
          </p>
        )}

        {/* Add Workout Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl border border-[#00c4b4]/20 space-y-4">
            <input
              type="text"
              placeholder="Exercise Name"
              value={formData.exercise}
              onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00c4b4]"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sets"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00c4b4]"
              />
              <input
                type="text"
                placeholder="Reps"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00c4b4]"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddWorkout}
                className="flex-1 bg-[#00c4b4] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#00a89f] transition"
              >
                Save Workout
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Recent Workouts List (Filtered) */}
        {workouts.length > 0 && filteredSavedWorkouts.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Workouts ({filteredSavedWorkouts.length})</h3>
            <div className="space-y-3">
              {filteredSavedWorkouts.slice(-5).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{workout.exercise}</p>
                    <p className="text-xs text-slate-500">
                      {workout.sets && `${workout.sets} sets`} {workout.reps && `x ${workout.reps} reps`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Stats Row --- */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Focus Phase</p>
              <p className="text-slate-900 font-bold">Hypertrophy Block 1</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Workouts</p>
              <p className="text-slate-900 font-bold">{workouts.length} sessions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#00c4b4]/10 text-[#00c4b4] flex items-center justify-center">
              <Dumbbell size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Duration</p>
              <p className="text-slate-900 font-bold">60 mins</p>
            </div>
          </div>
        </div>

        {/* --- Workouts Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {/* Active Card (Monday) - Only show if it matches search */}
          {showMondayCard && (
            <div className="lg:col-span-1 xl:col-span-1 row-span-2">
              <div className={`p-6 rounded-[2rem] border-2 border-[#00c4b4] shadow-xl shadow-[#00c4b4]/10 h-full flex flex-col ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-[#00c4b4] uppercase tracking-wider">{mondayRoutine.day}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{mondayRoutine.title}</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#00c4b4] text-white flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                </div>

                {/*  UPDATED PROGRESS BAR AS CHECKABLE */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Workout Progress</span>
                    <span className="text-[#00c4b4]">{progressPercentage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-transparent border-[#334155]' : 'bg-slate-100 border-slate-100'}`}> {/* Conditional background and border */}
                    <div
                      className="h-full bg-[#00c4b4] transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/*  UPDATED MONDAY PROGRESS BAR  */}
                <div className="space-y-4 flex-1">
                  {mondayRoutine.exercises.map((exercise) => {
                    const isDone = completedExerciseIds.includes(exercise.id);
                    return (
                      <div
                        key={exercise.id}
                        onClick={() => toggleExercise(exercise.id)}
                        className={`flex gap-4 items-center p-3 rounded-xl transition-all cursor-pointer border
                          ${isDone
                            ? (isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200')
                            : (isDarkMode ? 'bg-transparent border-[#334155]/60 hover:bg-[#334155]/40' : 'bg-transparent border-slate-100 hover:bg-slate-50')
                          }`}
                      >
                        {/* Checkbox Icon */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'
                          }`}>
                          {isDone && <CheckCircle2 size={12} />}
                        </div>

                        <div className="flex-1">
                          <p className={`text-sm font-bold ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {exercise.name}
                          </p>
                          <div className="flex gap-3 text-xs text-slate-500 mt-1">
                            <span>{exercise.sets} Sets</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                            <span>{exercise.reps} Reps</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#00c4b4] bg-[#00c4b4]/5 px-2 py-1 rounded-lg">
                          {exercise.weight}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* UPDATED COMPLETE WORKOUT BUTTON , IT WILL SHOW HOW MANY EXERCISE LEFT TO COMPLETE */}
                <button
                  // Disable the button unless every exercise ID is in the completed state
                  disabled={completedExerciseIds.length !== mondayRoutine.exercises.length}

                  onClick={() => {
                    alert("Workout Logged Successfully!");
                    // You can also add logic here to clear the state or save to DB
                  }}

                  className={`w-full mt-6 py-4 font-bold rounded-xl transition-all shadow-md ${completedExerciseIds.length === mondayRoutine.exercises.length
                      ? 'bg-[#00c4b4] text-white hover:bg-[#00a89f] cursor-pointer' // Active state
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' // Locked state
                    }`}
                >
                  {completedExerciseIds.length === mondayRoutine.exercises.length
                    ? "Complete Workout"
                    : `Finish ${mondayRoutine.exercises.length - completedExerciseIds.length} more to Complete`}
                </button>
              </div>
            </div>
          )}

          {/* Routine Cards (Filtered) */}
          {filteredRoutineCards.map((card, idx) => (
            <div key={idx} className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow flex flex-col ${isDarkMode ? 'bg-transparent border-[#334155]' : 'bg-transparent border-slate-100'}`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{card.day}</span>
              <h3 className="text-xl font-bold  text-slate-900 mb-6">{card.title}</h3>

              {card.type === 'recovery' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">self_improvement</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
              ) : (
                <div className="flex-1 space-y-4">
                  {card.exercises.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0">
                      <span className="font-bold text-slate-700">{ex.name}</span>
                      <span className="text-[#00c4b4] font-bold text-xs bg-[#00c4b4]/5 px-2 py-1 rounded">{ex.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-full mt-6 py-3 bg-[#00c4b4]/5 text-[#00c4b4] font-bold rounded-xl hover:bg-[#00c4b4]/10 transition-colors text-sm">
                {card.type === 'recovery' ? 'View Details' : 'View Routine'}
              </button>
            </div>
          ))}

          {/* No Results Message */}
          {searchQuery && !showMondayCard && filteredRoutineCards.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400">
              No routine cards match "{searchQuery}"
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Workout;