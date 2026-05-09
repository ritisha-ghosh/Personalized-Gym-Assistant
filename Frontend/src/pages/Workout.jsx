import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { Calendar, Clock, BarChart3, Dumbbell, Play, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { getWorkouts, addWorkout, deleteWorkout } from "../utils/storageUtils";
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { DarkModeContext } from '../context/DarkModeContext';

const Workout = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);
  
  const [activeTab, setActiveTab] = useState('Current Week');
  const [workouts, setWorkouts] = useState([]);
  const [userWorkoutPlans, setUserWorkoutPlans] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    exercise: '', sets: '', reps: '', duration: '', notes: '',
  });
  const [completedExerciseIds, setcompletedExerciseIds] = useState([]);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get('/workouts');
        setUserWorkoutPlans(response.data || []);
      } catch (error) {
        console.error("Failed to fetch workout plans", error);
      }
      
      if (user?.id) {
        const savedWorkouts = getWorkouts(user.id);
        setWorkouts(savedWorkouts);
      }
      setLoading(false);
    };
    fetchWorkoutPlans();
  }, [user?.id]);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (lowerQuery.includes('next')) setActiveTab('Next Week');
      else if (lowerQuery.includes('current')) setActiveTab('Current Week');
    }
  }, [searchQuery]);

  const handleAddWorkout = () => {
    if (formData.exercise.trim() && user?.id) {
      const newWorkout = addWorkout(user.id, formData);
      setWorkouts([...workouts, newWorkout]);
      setFormData({ exercise: '', sets: '', reps: '', duration: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteWorkout = (id) => {
    if (user?.id) {
      deleteWorkout(user.id, id);
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  const filteredSavedWorkouts = workouts.filter(w =>
    !searchQuery ||
    w.exercise.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.sets && w.sets.toString().includes(searchQuery)) ||
    (w.reps && w.reps.toString().includes(searchQuery))
  );

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

  const showMondayCard = !searchQuery ||
    mondayRoutine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mondayRoutine.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mondayRoutine.exercises.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Workout Plan</h1>
            <div className={`p-1 rounded-xl flex text-xs sm:text-sm font-semibold overflow-x-auto ${isDarkMode ? 'bg-[#1e293b]' : 'bg-slate-100'}`}>
              {['Current Week', 'Next Week'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab
                    ? (isDarkMode ? 'bg-[#334155] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm')
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
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
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#1e293b] border-[#00c4b4]/20' : 'bg-white border-[#00c4b4]/20'}`}>
            <input
              type="text"
              placeholder="Exercise Name"
              value={formData.exercise}
              onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#00c4b4] ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200'}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sets"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:border-[#00c4b4] ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200'}`}
              />
              <input
                type="text"
                placeholder="Reps"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:border-[#00c4b4] ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200'}`}
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
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition ${isDarkMode ? 'bg-[#334155] text-white hover:bg-[#475569]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Recent Workouts List (Filtered) */}
        {workouts.length > 0 && filteredSavedWorkouts.length > 0 && (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Added Workouts ({filteredSavedWorkouts.length})</h3>
            <div className="space-y-3">
              {filteredSavedWorkouts.slice(-5).map((workout) => (
                <div key={workout.id} className={`flex items-center justify-between p-4 rounded-lg transition ${isDarkMode ? 'bg-[#0f172a] hover:bg-[#334155]/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className="flex-1">
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{workout.exercise}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x ${isDarkMode ? 'bg-[#1e293b] border-[#334155] divide-[#334155]' : 'bg-white border-slate-100 divide-slate-100'}`}>
          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Focus Phase</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Hypertrophy Block 1</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Workouts</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{workouts.length} sessions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#00c4b4]/10 text-[#00c4b4] flex items-center justify-center">
              <Dumbbell size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Duration</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>60 mins</p>
            </div>
          </div>
        </div>

        {/* --- Workouts Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {/* Active Card (Monday) - Only show if it matches search */}
          {showMondayCard && (
            <div className="lg:col-span-1 xl:col-span-1 row-span-2">
              <div className={`p-6 rounded-[2rem] border-2 border-[#00c4b4] shadow-xl shadow-[#00c4b4]/10 h-full flex flex-col ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-[#00c4b4] uppercase tracking-wider">{mondayRoutine.day}</span>
                    <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mondayRoutine.title}</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#00c4b4] text-white flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Workout Progress</span>
                    <span className="text-[#00c4b4]">{progressPercentage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#334155] border-[#334155]' : 'bg-slate-100 border-slate-100'}`}>
                    <div
                      className="h-full bg-[#00c4b4] transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

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
                            : (isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:bg-[#334155]/50' : 'bg-white border-slate-100 hover:bg-slate-50')
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                          {isDone && <CheckCircle2 size={12} />}
                        </div>

                        <div className="flex-1">
                          <p className={`text-sm font-bold ${isDone ? (isDarkMode ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                            {exercise.name}
                          </p>
                          <div className={`flex gap-3 text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>{exercise.sets} Sets</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                            <span>{exercise.reps} Reps</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#00c4b4] bg-[#00c4b4]/10 px-2 py-1 rounded-lg">
                          {exercise.weight}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
  disabled={completedExerciseIds.length !== mondayRoutine.exercises.length}
  onClick={async () => {
    try {
      const logData = {
        status: "active",
        difficultyRating: 7,
        weight: user?.weight || 70,
      };

      await api.post("/logs", logData);

      alert("Workout Logged Successfully!");

      setcompletedExerciseIds([]);

      window.location.reload();
    } catch (error) {
      console.error("Workout log error:", error);

      alert(
        error?.response?.data?.message ||
        "Failed to log workout"
      );
    }
  }}
  className={`w-full mt-6 py-4 font-bold rounded-xl transition-all shadow-md ${
    completedExerciseIds.length === mondayRoutine.exercises.length
      ? "bg-[#00c4b4] text-white hover:bg-[#00a89f] cursor-pointer"
      : (
          isDarkMode
            ? "bg-[#334155] text-slate-400 cursor-not-allowed shadow-none"
            : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
        )
  }`}
>
  {completedExerciseIds.length === mondayRoutine.exercises.length
    ? "Complete Workout"
    : `Finish ${
        mondayRoutine.exercises.length - completedExerciseIds.length
      } more to Complete`}
</button>
          {/* Routine Cards (Filtered) */}
          {filteredRoutineCards.map((card, idx) => (
            <div key={idx} className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-shadow flex flex-col ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{card.day}</span>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>

              {card.type === 'recovery' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-12 h-12 bg-teal-500/10 text-teal-500 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">self_improvement</span>
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{card.desc}</p>
                </div>
              ) : (
                <div className="flex-1 space-y-4">
                  {card.exercises.map((ex, i) => (
                    <div key={i} className={`flex justify-between items-center text-sm border-b pb-3 last:border-0 ${isDarkMode ? 'border-[#334155]' : 'border-slate-50'}`}>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{ex.name}</span>
                      <span className="text-[#00c4b4] font-bold text-xs bg-[#00c4b4]/10 px-2 py-1 rounded">{ex.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className={`w-full mt-6 py-3 font-bold rounded-xl transition-colors text-sm ${isDarkMode ? 'bg-[#00c4b4]/10 text-[#00c4b4] hover:bg-[#00c4b4]/20' : 'bg-[#00c4b4]/5 text-[#00c4b4] hover:bg-[#00c4b4]/10'}`}>
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