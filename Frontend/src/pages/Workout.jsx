import React, { useState, useEffect } from 'react';
import Layout from "../componenets/layout/Layout";
import { Calendar, Clock, BarChart3, RefreshCw, Dumbbell, MoreHorizontal, Play, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { getWorkouts, addWorkout, deleteWorkout } from "../utils/storageUtils";

const Workout = () => {
  const [activeTab, setActiveTab] = useState('Current Week');
  const [workouts, setWorkouts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    duration: '',
    notes: '',
  });

  useEffect(() => {
    const savedWorkouts = getWorkouts();
    setWorkouts(savedWorkouts);
  }, []);

  const handleAddWorkout = () => {
    if (formData.exercise.trim()) {
      const newWorkout = addWorkout(formData);
      setWorkouts([...workouts, newWorkout]);
      setFormData({ exercise: '', sets: '', reps: '', duration: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteWorkout = (id) => {
    deleteWorkout(id);
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <Layout>
      {/* Inject Fonts locally if not already global */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className="space-y-8">
        
        {/* --- Page Specific Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Weekly Workout Plan</h1>
            <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-semibold">
              {['Current Week', 'Next Week'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab 
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
            className="flex items-center gap-2 bg-[#df20af] hover:bg-[#c91d9d] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#df20af]/20"
          >
            <Plus size={18} />
            Add Workout
          </button>
        </div>

        {/* Add Workout Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl border border-[#df20af]/20 space-y-4">
            <input
              type="text"
              placeholder="Exercise Name"
              value={formData.exercise}
              onChange={(e) => setFormData({...formData, exercise: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sets"
                value={formData.sets}
                onChange={(e) => setFormData({...formData, sets: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
              />
              <input
                type="text"
                placeholder="Reps"
                value={formData.reps}
                onChange={(e) => setFormData({...formData, reps: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddWorkout}
                className="flex-1 bg-[#df20af] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#c91d9d] transition"
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

        {/* Recent Workouts List */}
        {workouts.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Workouts ({workouts.length})</h3>
            <div className="space-y-3">
              {workouts.slice(-5).map((workout) => (
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
            <div className="w-12 h-12 rounded-2xl bg-[#df20af]/10 text-[#df20af] flex items-center justify-center">
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
          
          {/* Active Card (Monday) */}
          <div className="lg:col-span-1 xl:col-span-1 row-span-2">
            <div className="bg-white p-6 rounded-[2rem] border-2 border-[#df20af] shadow-xl shadow-[#df20af]/10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-[#df20af] uppercase tracking-wider">Monday</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">Chest & Triceps</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#df20af] text-white flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>Workout Progress</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-[#df20af] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { id: '01', name: 'Bench Press (Barbell)', sets: '4 Sets', reps: '8-10 Reps', weight: '85 kg' },
                  { id: '02', name: 'Incline DB Press', sets: '3 Sets', reps: '12 Reps', weight: '28 kg' },
                  { id: '03', name: 'Cable Flyes', sets: '3 Sets', reps: '15 Reps', weight: '15 kg' },
                  { id: '04', name: 'Skullcrushers', sets: '4 Sets', reps: '10 Reps', weight: '30 kg' },
                ].map((exercise) => (
                  <div key={exercise.id} className="flex gap-4 items-center p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-[#df20af] transition-colors">{exercise.id}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{exercise.name}</p>
                      <div className="flex gap-3 text-xs text-slate-500 mt-1">
                        <span>{exercise.sets}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                        <span>{exercise.reps}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#df20af] bg-[#df20af]/5 px-2 py-1 rounded-lg">{exercise.weight}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors">
                Complete Workout
              </button>
            </div>
          </div>

          {/* Routine Cards */}
          {[
            { day: 'Tuesday', title: 'Back & Biceps', exercises: [{name:'Pull-ups', detail:'4 x MAX'}, {name:'Barbell Row', detail:'3 x 10'}, {name:'Hammer Curls', detail:'3 x 12'}] },
            { day: 'Wednesday', title: 'Active Recovery', type: 'recovery', desc: '30 min Yoga or Light Walk recommended by AI Coach.' },
            { day: 'Thursday', title: 'Shoulders & Abs', exercises: [{name:'Military Press', detail:'4 x 8'}, {name:'Lateral Raises', detail:'3 x 15'}] },
            { day: 'Friday', title: 'Leg Day (Quads)', exercises: [{name:'Barbell Squats', detail:'5 x 5'}] },
            { day: 'Saturday', title: 'Leg Day (Hams)', exercises: [{name:'Deadlift', detail:'3 x 8'}] },
            { day: 'Sunday', title: 'Full Body Pump', exercises: [{name:'Circuit 1', detail:'3 Rounds'}] },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{card.day}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-6">{card.title}</h3>

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
                      <span className="text-[#df20af] font-bold text-xs bg-[#df20af]/5 px-2 py-1 rounded">{ex.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-full mt-6 py-3 bg-[#df20af]/5 text-[#df20af] font-bold rounded-xl hover:bg-[#df20af]/10 transition-colors text-sm">
                {card.type === 'recovery' ? 'View Details' : 'View Routine'}
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* Floating AI Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#df20af] to-[#ff52d0] rounded-full shadow-2xl shadow-[#df20af]/40 flex items-center justify-center text-white hover:scale-110 transition-transform group z-50">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">auto_awesome</span>
        <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></span>
      </button>

    </Layout>
  );
};

export default Workout;