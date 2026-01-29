import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {

  const [experience, setExperience] = useState('Beginner');

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

        <p className="text-slate-400 text-xs">© 2026 Gym & Fitness Assistant. All rights reserved.</p>
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

          <form className="space-y-10">
            
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
                  <input type="text" placeholder="e.g. Alex Johnson" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-pink-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" placeholder="alex@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-pink-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:border-pink-500 outline-none transition-all" />
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
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Age</label>
                  <input type="number" placeholder="25" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Weight (KG)</label>
                  <input type="number" placeholder="70" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Height (CM)</label>
                  <input type="number" placeholder="175" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-pink-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Fitness Goal</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-500 appearance-none">
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Injury Status</label>
                  <input type="text" placeholder="None, Knee, Shoulder..." className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-pink-500" />
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

            {/* Submit Button */}
            <div className="pt-6">
              <button className="w-full bg-[#db2777] hover:bg-[#be185d] text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-100 flex items-center justify-center gap-2 transition-transform active:scale-95">
                Complete Registration
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-6">
                By completing registration, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;