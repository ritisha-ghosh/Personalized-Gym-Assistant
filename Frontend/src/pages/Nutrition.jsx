import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import Hook
import Layout from "../componenets/layout/Layout";
import { Droplet, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { getNutrition, addNutrition, deleteNutrition } from "../utils/storageUtils";
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext'; // Added DarkModeContext

const Neutrations = () => {
  // 2. Search Params Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext); // Extract isDarkMode

  const [nutrition, setNutrition] = useState([]);
  const [userDietData, setUserDietData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for the Hydration Popup
  const [showHydrationPopup, setShowHydrationPopup] = useState(false);

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

      // Get local nutrition data - USER-SPECIFIC
      if (user?.id) {
        const saved = getNutrition(user.id);  // 👈 Pass userId
        setNutrition(saved);
        console.log(`📥 Loaded ${saved.length} meals for user ${user.id}`);
      }
      setLoading(false);
    };

    fetchNutritionData();
  }, [user?.id]);  // 👈 Re-fetch when user changes

  const totalCalories = nutrition.reduce((sum, item) => sum + (parseInt(item.calories) || 0), 0);
  const totalProtein = nutrition.reduce((sum, item) => sum + (parseInt(item.protein) || 0), 0);
  const calorieTarget = 2450;

  const handleAddMeal = () => {
    if (formData.meal.trim() && formData.calories && user?.id) {
      const newMeal = addNutrition(user.id, formData);  // 👈 Pass userId
      setNutrition([...nutrition, newMeal]);
      setFormData({ meal: '', calories: '', protein: '', carbs: '', fats: '' });
      setShowAddForm(false);
      console.log(`✅ Meal added for user ${user.id}`);
    }
  };

  const handleDeleteMeal = (id) => {
    if (user?.id) {
      deleteNutrition(user.id, id);  // 👈 Pass userId
      setNutrition(nutrition.filter(item => item.id !== id));
      console.log(`✅ Meal deleted for user ${user.id}`);
    }
  };

  // Handler for logging water
  const handleLogHydration = () => {
    setShowHydrationPopup(true);
    // Auto hide popup after 2.5 seconds
    setTimeout(() => {
      setShowHydrationPopup(false);
    }, 2500);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c4b4]"></div>
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
          
          .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className={`space-y-6 sm:space-y-8 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        
        {/* Page Title with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
             <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Nutrition Dashboard</h1>
             {userDietData && (
               <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                 Diet Type: <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{userDietData.dietType}</span> 
                 {userDietData.noOnion && ' • No Onion'} 
                 {userDietData.noGarlic && ' • No Garlic'}
               </p>
             )}
             {searchQuery && <p className="text-sm font-bold text-[#00c4b4]">Searching for: "{searchQuery}"</p>}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#00c4b4]/20 w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Meal</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Add Meal Form - Responsive */}
        {showAddForm && (
          <div className={`p-4 sm:p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#00c4b4]/20'}`}>
            <input
              type="text"
              placeholder="Meal Name"
              value={formData.meal}
              onChange={(e) => setFormData({...formData, meal: e.target.value})}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/50 border ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <input
                type="number"
                placeholder="Calories"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/50 border ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={formData.protein}
                onChange={(e) => setFormData({...formData, protein: e.target.value})}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/50 border ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={formData.carbs}
                onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/50 border ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
              <input
                type="number"
                placeholder="Fats (g)"
                value={formData.fats}
                onChange={(e) => setFormData({...formData, fats: e.target.value})}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/50 border ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddMeal}
                className="flex-1 bg-[#00c4b4] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#00a89f] transition text-sm"
              >
                Save Meal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition text-sm ${isDarkMode ? 'bg-[#334155] text-white hover:bg-[#475569]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* --- Hero Section: Calories --- */}
        <div className="bg-gradient-to-r from-[#00c4b4] to-[#ff52d0] rounded-[2rem] p-8 text-white shadow-xl shadow-[#00c4b4]/20 relative overflow-hidden">
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
          <div className={`p-6 rounded-[2rem] border shadow-sm flex items-center gap-6 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke={isDarkMode ? "#334155" : "#f1f5f9"} strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#0ea5e9" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="60" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[#0ea5e9]">{totalProtein > 0 ? '65' : '0'}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Protein</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalProtein}</span>
                <span className="text-sm text-slate-400 font-medium">/ 185g</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-slate-100'}`}>
                <div className="h-full bg-[#0ea5e9] w-[65%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className={`p-6 rounded-[2rem] border shadow-sm flex items-center gap-6 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke={isDarkMode ? "#334155" : "#f1f5f9"} strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#00c4b4" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="110" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[#00c4b4]">45%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Carbs</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>110</span>
                <span className="text-sm text-slate-400 font-medium">/ 245g</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-slate-100'}`}>
                <div className="h-full bg-[#00c4b4] w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Fats */}
          <div className={`p-6 rounded-[2rem] border shadow-sm flex items-center gap-6 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke={isDarkMode ? "#334155" : "#f1f5f9"} strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#eab308" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="140" strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[#eab308]">30%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fats</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>24</span>
                <span className="text-sm text-slate-400 font-medium">/ 82g</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-3 overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-slate-100'}`}>
                <div className="h-full bg-[#eab308] w-[30%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Today's Meals (Filtered) --- */}
        {nutrition.length > 0 && filteredUserMeals.length > 0 && (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Added Meals ({filteredUserMeals.length})</h3>
            <div className="space-y-3">
              {filteredUserMeals.map((meal) => (
                <div key={meal.id} className={`flex items-center justify-between p-4 rounded-lg transition ${isDarkMode ? 'bg-[#0f172a] hover:bg-[#334155]' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className="flex-1">
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{meal.meal}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
            <div className={`p-6 rounded-[2rem] border shadow-sm ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Today's Meal Plan</h3>
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${isDarkMode ? 'bg-[#0f172a] text-slate-300 border-[#334155]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
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
                    <div key={idx} className={`grid grid-cols-12 items-center p-4 rounded-2xl transition-colors border ${isDarkMode ? 'hover:bg-[#0f172a] border-transparent' : 'hover:bg-slate-50 border-slate-50'}`}>
                      <div className="col-span-3">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{meal.type}</p>
                        <p className="text-xs text-slate-400 mt-1">{meal.time}</p>
                      </div>
                      <div className="col-span-4 pr-4">
                        <p className={`text-sm font-medium leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{meal.food}</p>
                      </div>
                      <div className="col-span-2">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{meal.cal}</p>
                      </div>
                      <div className="col-span-2 flex flex-wrap gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100/10 text-[#0ea5e9] text-[10px] font-bold">{meal.p}</span>
                        <span className="px-1.5 py-0.5 rounded bg-pink-100/10 text-[#00c4b4] text-[10px] font-bold">{meal.c}</span>
                        <span className="px-1.5 py-0.5 rounded bg-yellow-100/10 text-[#ca8a04] text-[10px] font-bold">{meal.f}</span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {meal.status === 'done' ? (
                          <CheckCircle2 className="text-teal-500 fill-teal-500/20" size={24} />
                        ) : (
                          <Circle className="text-slate-400" size={24} />
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
            {/*    <button 
                  onClick={handleLogHydration}
                  className="w-full py-3 bg-white text-[#14b8a6] font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm"
                >
                  Log 500ml Now
                </button>   */} 
              </div>
            </div>

            {/* Micronutrients Widget (Filtered) COMMENTED OUT */}
            {/* <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
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
            */}

          </div>
        </div>

        {/* --- Hydration Popup Modal --- */}
        {showHydrationPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
            <div className={`flex flex-col items-center p-8 rounded-3xl shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white'}`}>
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-teal-500/40">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Done!</h3>
              <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>500ml logged successfully.</p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Neutrations;