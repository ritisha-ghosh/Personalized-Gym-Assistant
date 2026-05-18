import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DarkModeContext } from '../context/DarkModeContext';
import logoImg from '../assets/logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useContext(DarkModeContext);

  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const [experience, setExperience] = useState('Beginner');
  const [exclusions, setExclusions] = useState([]);

  const toggleExclusion = (item) => {
    if (exclusions.includes(item)) {
      setExclusions(exclusions.filter(i => i !== item));
    } else {
      setExclusions([...exclusions, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setBackendError('');

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age ? Number(formData.age) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
      gender: formData.gender,
      goal: formData.fitnessGoal,
      experience: experience,
      dietType: formData.dietType,
      noOnion: exclusions.includes("No Onion"),
      noGarlic: exclusions.includes("No Garlic"),
      glutenFree: exclusions.includes("Gluten Free"),
      lactoseFree: exclusions.includes("Lactose Free"),
      nutAllergy: exclusions.includes("Nut Allergy"),
      sugarFree: exclusions.includes("Sugar Free"),
      activityLevel: formData.activityLevel,
      injury: formData.injuryStatus
    };

    try {
      const response = await api.post('/auth/signup', payload);
      if (response.data.success) {
        // Show the success popup instead of default alert
        setShowSuccessPopup(true);
      }
    } catch (err) {
      console.error(err);
      setBackendError(err.response?.data?.message || 'Registration failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const exclusionOptions = [
    "No Onion",
    "No Garlic",
    "Gluten Free",
    "Lactose Free",
    "Nut Allergy",
    "Sugar Free"
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitnessGoal: '',
    dietType: '',
    activityLevel: '',
    injuryStatus: ''
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = "";
    if (value === "") return "";

    const num = Number(value);
    if (name === "age" && (num < 10 || num > 100)) {
      error = "Age must be between 10-100";
    }
    if (name === "weight" && (num < 30 || num > 300)) {
      error = "Weight must be 30kg - 300kg";
    }
    if (name === "height" && (num < 100 || num > 250)) {
      error = "Height must be 100cm - 250cm";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark-mode bg-[#0f172a]' : 'bg-white'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Goblin+One&display=swap');
          /* Global Scrollbar Styles */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
          }
          ::-webkit-scrollbar-thumb {
            background-color: ${isDarkMode ? '#334155' : '#94a3b8'};
            border-radius: 20px;
          }
          
          /* Hide number input arrows (spinners) */
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div className={`hidden lg:flex w-1/3 p-12 flex-col justify-between relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-r border-[#334155]' : 'bg-[#e0f7f1]'}`}>
        <div>
          <Link to="/" className="flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity w-fit">
            <img src={logoImg} alt="BeFit Logo" className="w-16 h-16 object-contain" />
            <span className="text-3xl font-bold tracking-wide transition-all !bg-transparent" style={{ fontFamily: "'Goblin One', cursive" }}>
              <span className={`!bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-800 [-webkit-text-stroke:0.5px_black]'}`}>Be</span>
              <span className={`!bg-transparent ${isDarkMode ? 'text-[#00b0a7]' : 'text-[#009c8f] [-webkit-text-stroke:0.5px_black]'}`}>Fit</span>
            </span>
          </Link>

          <div className="relative z-10">
            <p className="text-[#db2777] font-bold text-xs tracking-widest uppercase mb-4">Motivation</p>
            <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
              The only bad workout is the one that <span className="text-[#db2777] italic relative">
                didn't happen.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="#db2777" strokeWidth="2" />
                </svg>
              </span>
            </h1>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className={`w-64 h-64 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-8 ${isDarkMode ? 'bg-teal-600 border-[#334155]' : 'bg-[#4fd1c5] border-white/20'}`}>
            <div className={`w-40 h-10 rounded-full flex items-center px-4 gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className="w-6 h-6 bg-pink-300 rounded-md"></div>
              <div className={`w-20 h-2 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-xs"> © 2025-{currentYear} All rights reserved.</p>

      </div>

      <div className="flex-1 flex flex-col p-8 lg:p-16 overflow-y-auto">

        {/* --- Responsive Header --- */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo - Only visible on mobile */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
              <img src={logoImg} alt="BeFit Logo" className="w-14 h-14 object-contain" />
              <span className="text-3xl font-bold tracking-wide transition-all !bg-transparent" style={{ fontFamily: "'Goblin One', cursive" }}>
                <span className={`!bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-800 [-webkit-text-stroke:0.5px_black]'}`}>Be</span>
                <span className={`!bg-transparent ${isDarkMode ? 'text-[#00b0a7]' : 'text-[#009c8f] [-webkit-text-stroke:0.5px_black]'}`}>Fit</span>
              </span>
            </Link>
          </div>
          <p className="text-sm text-slate-500 lg:w-full lg:text-right">
            Already a member? <Link to="/login" className="text-[#db2777] font-bold hover:underline ml-1">Log In</Link>
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Create Your Profile</h2>
            <p className="text-slate-400 text-sm mt-2">Join us and start your personalized fitness journey.</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>

            {backendError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold">
                {backendError}
              </div>
            )}

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 rounded-lg text-[#db2777]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">Personal Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Johnson" 
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-teal-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@example.com" 
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-teal-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••" 
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-teal-500 outline-none transition-all" 
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 rounded-lg text-[#db2777]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">Fitness Metrics</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age in Years"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.age ? "border-red-500 bg-red-50 text-red-900" : "border-slate-200 focus:border-teal-500"
                      }`}
                  />
                  {errors.age && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Weight (KG)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Weight in KG"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.weight ? "border-red-500 bg-red-50 text-red-900" : "border-slate-200 focus:border-teal-500"
                      }`}
                  />
                  {errors.weight && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.weight}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Height (CM)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Height in CM"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.height ? "border-red-500 bg-red-50 text-red-900" : "border-slate-200 focus:border-teal-500"
                      }`}
                  />
                  {errors.height && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.height}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Gender</label>
                  <div className="relative">
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-teal-500 appearance-none transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Fitness Goal</label>
                  <div className="relative">
                    <select 
                      name="fitnessGoal"
                      value={formData.fitnessGoal}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-teal-500 appearance-none transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <option value="" disabled>Select Goal</option>
                      <option value="fat loss">Fat Loss</option>
                      <option value="muscle gain">Muscle Gain</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-4">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperience(level)}
                      className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                        experience === level
                          ? "!bg-teal-500 !border-teal-500 !text-white shadow-md shadow-teal-500/20"
                          : `!bg-transparent ${
                              isDarkMode 
                                ? "!border-slate-600 !text-slate-300 hover:!border-teal-400 hover:!text-teal-400" 
                                : "!border-slate-200 !text-slate-600 hover:!border-teal-500 hover:!text-teal-500"
                            }`
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 rounded-lg text-[#db2777]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">Nutrition & Lifestyle</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Diet Type</label>
                  <div className="relative">
                    <select 
                      name="dietType"
                      value={formData.dietType}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-teal-500 appearance-none transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <option value="" disabled>Select Diet</option>
                      <option value="non-vegetarian">Non-Vegetarian (Omnivore)</option>
                      <option value="vegetarian">Vegetarian</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Daily Activity</label>
                  <div className="relative">
                    <select 
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-teal-500 appearance-none transition-all ${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <option value="" disabled>Select Activity</option>
                      <option value="sedentary">Sedentary (Office Job)</option>
                      <option value="light">Lightly Active</option>
                      <option value="moderate">Moderately Active</option>
                      <option value="active">Very Active</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3">Dietary Exclusions</label>
                <div className="flex flex-wrap gap-2">
                  {exclusionOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleExclusion(item)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all duration-200 ${
                        exclusions.includes(item)
                          ? "!bg-teal-500 !border-teal-500 !text-white shadow-md shadow-teal-500/20"
                          : `!bg-transparent ${
                              isDarkMode
                                ? "!border-slate-600 !text-slate-300 hover:!border-teal-400 hover:!text-teal-400"
                                : "!border-slate-200 !text-slate-500 hover:!border-teal-500 hover:!text-teal-500"
                            }`
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Injury / Medical Conditions</label>
                <input 
                  type="text" 
                  name="injuryStatus"
                  value={formData.injuryStatus}
                  onChange={handleInputChange}
                  placeholder="e.g. Lower Back Pain, Asthma..." 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-teal-500" 
                />
              </div>
            </section>

            <div className="pt-2">
              <button
                type="submit"
                disabled={Object.values(errors).some(err => err !== "") || !formData.age || loading}
                className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${Object.values(errors).some(err => err !== "") || !formData.age || loading
                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                    : "bg-[#00c4b4] hover:bg-[#00a89f] text-white shadow-teal-100"
                  }`}
              >
                {loading ? 'Creating Profile...' : 'Complete Registration'}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-6">
                By completing registration, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          <div className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center transform transition-all ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white'}`}>
            <div className="w-20 h-20 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Registration Successful!</h3>
            <p className={`text-sm mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Welcome to BeFit! Your account has been successfully created. Please log in to start your personalized fitness journey.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#00c4b4] hover:bg-[#00a89f] text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-transform active:scale-95"
            >
              Log In Now
            </button>
          </div>
        </div>
      )}
    </div >
  );
};

export default RegisterPage;