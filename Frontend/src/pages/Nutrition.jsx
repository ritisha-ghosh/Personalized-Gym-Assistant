import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import Hook
import Layout from "../componenets/layout/Layout";
import { Droplet, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { getNutrition, addNutrition, deleteNutrition } from "../utils/storageUtils";
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Neutrations = () => {
  // 2. Search Params Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);

  const [nutrition, setNutrition] = useState([]);
  const [userDietData, setUserDietData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  // Fetch user diet preferences and nutrition data
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setLoading(true);
        const userResponse = await api.get('/users/profile');
        const userData = userResponse.data.user;
        setUserDietData({
          dietType: userData.dietType,
          noOnion: userData.noOnion,
          noGarlic: userData.noGarlic,
          goal: userData.goal,
          weight: userData.weight
        });
      } catch (error) {
        console.error("Failed to fetch diet data", error);
      }

      // Get local nutrition data
      const saved = getNutrition();
      setNutrition(saved);
      setLoading(false);
    };

    fetchNutritionData();
  }, []);

  const totalCalories = nutrition.reduce((sum, item) => sum + (parseInt(item.calories) || 0), 0);
  const totalProtein = nutrition.reduce((sum, item) => sum + (parseInt(item.protein) || 0), 0);
  const calorieTarget = 2450;

  const handleAddMeal = () => {
    if (formData.meal.trim() && formData.calories) {
      const newMeal = addNutrition(formData);
      setNutrition([...nutrition, newMeal]);
      setFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteMeal = (id) => {
    deleteNutrition(id);
    setNutrition(nutrition.filter(item => item.id !== id));
  };

  // --- 3. FILTER LOGIC ---
  
  // A. Filter User Added Meals
  const filteredUserMeals = nutrition.filter(meal => 
    meal.meal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // B. Filter Static Meal Plan
  const mealPlan = [
    { time: '08:00 AM', type: 'Breakfast', food: 'Greek Yogurt with Berries, Oats & Walnuts', cal: '450 kcal', p: '32g', c: '45g', f: '12g', status: 'done' },
    { time: '01:30 PM', type: 'Lunch', food: 'Grilled Salmon, Quinoa, Steam Broccoli', cal: '620 kcal', p: '48g', c: '38g', f: '22g', status: 'done' },
    { time: '04:30 PM', type: 'Pre-Workout', food: 'Apple with Almond Butter', cal: '210 kcal', p: '4g', c: '25g', f: '10g', status: 'pending' },
    { time: '08:00 PM', type: 'Dinner', food: 'Lean Beef Tacos with Avocado & Salsa', cal: '730 kcal', p: '52g', c: '65g', f: '28g', status: 'pending' },
  ];

  const filteredMealPlan = mealPlan.filter(meal => 
    meal.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    meal.food.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // C. Filter Micronutrients
  const micros = [
    { name: 'Iron', val: '85%', color: 'bg-red-500' },
    { name: 'Vitamin D', val: '40%', color: 'bg-purple-500' },
    { name: 'Magnesium', val: '62%', color: 'bg-emerald-500' },
  ];
  
  const filteredMicros = micros.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df20af]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Inject Fonts locally */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className="space-y-6 sm:space-y-8 font-sans text-slate-900">
        
        {/* Page Title with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
             <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Nutrition Dashboard</h1>
             {userDietData && (
               <p className="text-sm text-slate-500">
                 Diet Type: <span className="font-bold text-slate-700">{userDietData.dietType}</span> 
                 {userDietData.noOnion && ' • No Onion'} 
                 {userDietData.noGarlic && ' • No Garlic'}
               </p>
             )}
             {searchQuery && <p className="text-sm font-bold text-[#df20af]">Searching for: "{searchQuery}"</p>}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-[#df20af] hover:bg-[#c91d9d] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#df20af]/20 w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Meal</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Add Meal Form - Responsive */}
        {showAddForm && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#df20af]/20 space-y-4">
            <input
              type="text"
              placeholder="Meal Name"
              value={formData.meal}
              onChange={(e) => setFormData({...formData, meal: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <input
                type="number"
                placeholder="Calories"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={formData.protein}
                onChange={(e) => setFormData({...formData, protein: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={formData.carbs}
                onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
              />
              <input
                type="number"
                placeholder="Fats (g)"
                value={formData.fats}
                onChange={(e) => setFormData({...formData, fats: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#df20af]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddMeal}
                className="flex-1 bg-[#df20af] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#c91d9d] transition text-sm"
              >
                Save Meal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-300 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* --- Hero Section: Calories --- */}
        <div className="bg-gradient-to-r from-[#df20af] to-[#ff52d0] rounded-[2rem] p-8 text-white shadow-xl shadow-[#df20af]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 relative z-10">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase text-white/80 mb-2">Daily Calorie Target</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-7xl font-black">{calorieTarget}</h2>
                <span className="text-2xl font-medium text-white/80">kcal</span>
              </div>
              <p className="mt-4 font-medium text-white/90">
                You have <span className="font-bold border-b border-white/40">{calorieTarget - totalCalories}</span> kcal remaining for today.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl min-w-[100px] text-center border border-white/10">
                <p className="text-xs font-bold uppercase text-white/70 mb-1">Consumed</p>
                <p className="text-xl font-bold">{totalCalories}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl min-w-[100px] text-center border border-white/10">
                <p className="text-xs font-bold uppercase text-white/70 mb-1">Protein</p>
                <p className="text-xl font-bold">{totalProtein}g</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Macros Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Protein */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#0ea5e9" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="60" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[#0ea5e9]">{totalProtein > 0 ? '65' : '0'}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Protein</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{totalProtein}</span>
                <span className="text-sm text-slate-400 font-medium">/ 185g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#0ea5e9] w-[65%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#df20af" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="110" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[#df20af]">45%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Carbs</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">110</span>
                <span className="text-sm text-slate-400 font-medium">/ 245g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#df20af] w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Fats */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#eab308" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="140" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[#eab308]">30%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fats</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">24</span>
                <span className="text-sm text-slate-400 font-medium">/ 82g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#eab308] w-[30%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Today's Meals (Filtered) --- */}
        {nutrition.length > 0 && filteredUserMeals.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Added Meals ({filteredUserMeals.length})</h3>
            <div className="space-y-3">
              {filteredUserMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{meal.meal}</p>
                    <p className="text-xs text-slate-500">
                      {meal.calories} kcal | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fats: {meal.fats}g
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(meal.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Meal Plan List (Filtered) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Today's Meal Plan</h3>
                <div className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200">
                  May 17, 2024
                </div>
              </div>

              {/* Header Row */}
              <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                <div className="col-span-3">Meal</div>
                <div className="col-span-4">Food Items</div>
                <div className="col-span-2">Calories</div>
                <div className="col-span-2">Macros (P/C/F)</div>
                <div className="col-span-1 text-right">Status</div>
              </div>

              {/* Meals List */}
              <div className="space-y-4">
                {filteredMealPlan.length > 0 ? (
                  filteredMealPlan.map((meal, idx) => (
                    <div key={idx} className="grid grid-cols-12 items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-50">
                      <div className="col-span-3">
                        <p className="font-bold text-slate-900">{meal.type}</p>
                        <p className="text-xs text-slate-400 mt-1">{meal.time}</p>
                      </div>
                      <div className="col-span-4 pr-4">
                        <p className="text-sm font-medium text-slate-700 leading-snug">{meal.food}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-bold text-slate-900">{meal.cal}</p>
                      </div>
                      <div className="col-span-2 flex gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#0ea5e9] text-[10px] font-bold">{meal.p}</span>
                        <span className="px-1.5 py-0.5 rounded bg-pink-100 text-[#df20af] text-[10px] font-bold">{meal.c}</span>
                        <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-[#ca8a04] text-[10px] font-bold">{meal.f}</span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {meal.status === 'done' ? (
                          <CheckCircle2 className="text-teal-500 fill-teal-50" size={24} />
                        ) : (
                          <Circle className="text-slate-300" size={24} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center py-6 text-slate-400 text-sm">No meal plans found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sidebar Widgets */}
          <div className="space-y-6">
            
            {/* Hydration Widget */}
            <div className="bg-[#14b8a6] p-8 rounded-[2rem] text-white shadow-lg shadow-teal-200/50 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Droplet className="text-white fill-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Hydration Tip</h3>
                <p className="text-teal-100 text-sm leading-relaxed mb-6">
                  Drinking <span className="font-bold text-white">500ml of water</span> before your next meal can boost metabolic rate by 24%.
                </p>
                <button className="w-full py-3 bg-white text-[#14b8a6] font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm">
                  Log 500ml Now
                </button>
              </div>
            </div>

            {/* Micronutrients Widget (Filtered) */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Micronutrients</h3>
              <div className="space-y-6">
                {filteredMicros.length > 0 ? (
                  filteredMicros.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span>{item.name}</span>
                        <span>{item.val}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center text-slate-400 text-xs">No micronutrients found.</div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Neutrations;