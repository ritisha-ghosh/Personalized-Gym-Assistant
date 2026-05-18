import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Access global login function
import api from '../services/api'; // Corrected import path for consistency
import { DarkModeContext } from '../context/DarkModeContext'; // Imported context
import logoImg from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access global login function
  const { isDarkMode } = useContext(DarkModeContext); // Use context for dark mode

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // Pass the user object and the tokens as defined in backend
      login(response.data.user, { 
        accessToken: response.data.accessToken, 
        refreshToken: response.data.refreshToken 
      });

      // Redirect to Dashboard
      navigate('/dashboard'); 
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Invalid Credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${isDarkMode ? 'dark-mode bg-[#0f172a]' : 'bg-slate-50'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
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
        `}
      </style>

      {/* Background Decorative Glow (Top Left) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/50 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- NAVBAR START --- */}
      <header className="w-full flex items-center justify-between px-8 py-5 z-10">
        {/* LOGO AS PICTURE */}
        <Link to="/" className="flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity w-fit">
          <img src={logoImg} alt="BeFit Logo" className="w-16 h-16 object-contain" />
          <span className="text-3xl font-bold tracking-wide transition-all !bg-transparent" style={{ fontFamily: "'Goblin One', cursive" }}>
            <span className={`!bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-800 [-webkit-text-stroke:0.5px_black]'}`}>Be</span>
            <span className={`!bg-transparent ${isDarkMode ? 'text-[#00b0a7]' : 'text-[#009c8f] [-webkit-text-stroke:0.5px_black]'}`}>Fit</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className={`hidden sm:block text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>New to here?</span>
          {/* Linked Sign Up Button */}
          <Link to="/register" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-teal-100">
            Sign Up
          </Link>
        </div>
      </header>
      {/* --- NAVBAR END --- */}

      {/* --- LOGIN FORM SECTION --- */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className={`w-full max-w-[440px] rounded-[24px] shadow-2xl p-10 border ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-slate-900/50' : 'bg-white border-slate-50 shadow-slate-200/50'}`}>

          <div className="text-center mb-10">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Welcome Back</h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Access your personalized fitness insights.</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative">
                {/* Added z-10 and adjusted text color for dark mode visibility */}
                <span className={`absolute inset-y-0 left-4 flex items-center z-10 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-slate-400 ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-slate-50/50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Password</label>
                <span className="text-xs font-bold text-pink-500 hover:text-pink-600 cursor-pointer" onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                {/* Added z-10 and adjusted text color for dark mode visibility */}
                <span className={`absolute inset-y-0 left-4 flex items-center z-10 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  required
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-slate-400 ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-slate-50/50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-pink-500 border-slate-300 rounded focus:ring-pink-500" />
              <label htmlFor="remember" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Keep me logged in</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${isDarkMode ? 'shadow-teal-900/20' : 'shadow-teal-200'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className={`text-center mt-10 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
            Don't have an account? <Link to="/register" className="text-pink-500 font-bold hover:underline ml-1">Sign up now</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;