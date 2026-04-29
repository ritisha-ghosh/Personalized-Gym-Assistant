import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api'; // Ensure this path matches your file structure

const RegisterPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // --- States ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');

    // Construct the payload matching the Backend User Schema
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age || undefined,
      weight: formData.weight || undefined,
      height: formData.height || undefined,
      gender: formData.gender,
      goal: formData.fitnessGoal,
      experience: experience,
      dietType: formData.dietType,
      noOnion: exclusions.includes("No Garlic / Onion"),
      noGarlic: exclusions.includes("No Garlic / Onion"),
      activityLevel: formData.activityLevel,
      injury: formData.injuryStatus
    };

    try {
      // Send data to Backend
      const response = await api.post('/auth/signup', payload);

      if (response.data) {
        alert("Registration Successful! Please Log In.");
        navigate('/login'); // Redirect to Login on success
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const exclusionOptions = [
    "No Garlic / Onion",
    "Gluten Free",
    "Lactose Free",
    "Nut Allergy",
    "Sugar Free"
  ];

  // ADD FORM DATA AND HANDLES ERRORS 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitnessGoal: 'Weight Loss',
    dietType: 'standard',
    activityLevel: 'moderate',
    injuryStatus: ''
  });

  const [errors, setErrors] = useState({});

  // Real-time validation function
  const validate = (name, value) => {
    let error = "";
    if (name === "age") {
      if (value < 10 || value > 100) error = "Age must be between 10-100";
    }
    if (name === "weight") {
      if (value < 30 || value > 250) error = "Weight must be 30kg - 250kg";
    }
    if (name === "height") {
      if (value < 100 || value > 250) error = "Height must be 100cm - 250cm";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate on the fly
    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">

      {/* LEFT SIDE: MOTIVATIONAL PANEL (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/3 bg-[#e0f7f1] p-12 flex-col justify-between relative overflow-hidden">
        <div>
          {/* Linked Logo */}
          <Link to="/" className="flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity w-fit">
            <div className="w-8 h-8 bg-[#db2777] rounded-md flex items-center justify-center rotate-45">
              <div className="w-3 h-3 bg-white rounded-sm -rotate-45"></div>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Gym & Fitness Assistant</span>
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

        {/* Floating Image Placeholder */}
        <div className="relative flex justify-center">
          <div className="w-64 h-64 bg-[#4fd1c5] rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/20">
            <div className="w-40 h-10 bg-slate-200 rounded-full flex items-center px-4 gap-2">
              <div className="w-6 h-6 bg-pink-300 rounded-md"></div>
              <div className="w-20 h-2 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-xs"> © {currentYear} All rights reserved.</p>

      </div>

      {/* RIGHT SIDE: REGISTRATION FORM */}
      <div className="flex-1 flex flex-col p-8 lg:p-16 overflow-y-auto">

        {/* Top Link */}
        <div className="text-right mb-8">
          <p className="text-sm text-slate-500">
            Already a member? <Link to="/login" className="text-[#db2777] font-bold hover:underline">Log In</Link>
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Create Your Profile</h2>
            <p className="text-slate-400 text-sm mt-2">Join us and start your personalized fitness journey.</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>

            {/* SECTION 1: Personal Details */}
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-pink-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-pink-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-pink-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: Fitness Metrics */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 rounded-lg text-[#db2777]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">Fitness Metrics</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* AGE INPUT VALIDATION CHECK */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Age</label>
                  <input
                    type="number"
                    name="age" // Add name attribute
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.age ? "border-red-500 bg-red-50" : "border-slate-200 focus:border-pink-500"
                      }`}
                  />
                  {errors.age && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.age}</p>}
                </div>
                {/* WEIGHT INPUT VALIDATION CHECK */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Weight (KG)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.weight ? "border-red-500 bg-red-50 text-red-900" : "border-slate-200 focus:border-pink-500"
                      }`}
                  />
                  {errors.weight && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.weight}</p>}
                </div>
                {/* HEIGHT INPUT VALIDATION CHECK */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Height (CM)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="175"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.height ? "border-red-500 bg-red-50 text-red-900" : "border-slate-200 focus:border-pink-500"
                      }`}
                  />
                  {errors.height && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.height}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-500 appearance-none text-slate-700"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Fitness Goal</label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-500 appearance-none text-slate-700"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Endurance">Endurance</option>
                  </select>
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
                      className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${experience === level
                        ? "border-[#db2777] bg-[#db2777] text-white shadow-md shadow-pink-100"
                        : "border-slate-100 text-slate-700 hover:border-slate-200 bg-transparent"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: Nutrition & Lifestyle (New) */}
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
                  <select
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-500 appearance-none text-slate-700"
                  >
                    <option value="" disabled>Select Diet</option>
                    <option value="standard">Standard (Omnivore)</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="pescatarian">Pescatarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Daily Activity</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-500 appearance-none text-slate-700"
                  >
                    <option value="sedentary">Sedentary (Office Job)</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="active">Very Active</option>
                  </select>
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
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${exclusions.includes(item)
                        ? "bg-pink-100 text-[#db2777] border-[#db2777]"
                        : "bg-white text-slate-500 border-slate-200 hover:border-pink-300"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-pink-500" />
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-2">
              {/* UPDATE SUBMIT BUTTON AS VALIDATION CHECK */}
              <button
              type="submit"
                disabled={
                  Object.values(errors).some(err => err !== "") ||
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.age ||
                  !formData.gender
                }
                className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                  Object.values(errors).some(err => err !== "") || !formData.name || !formData.email || !formData.password || !formData.age || !formData.gender
                  ? "bg-slate-300 cursor-not-allowed text-slate-500"
                  : "bg-[#db2777] hover:bg-[#be185d] text-white shadow-pink-100"
                  }`}
              >
                Complete Registration
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-6">
                By completing registration, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
};

export default RegisterPage;