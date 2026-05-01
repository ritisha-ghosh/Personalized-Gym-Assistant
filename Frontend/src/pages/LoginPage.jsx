import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api'; // Ensure this points to your axios instance

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access global login function

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

      // 2. Save the Token and User Info
      // Assuming backend sends { token: "...", refreshToken: "...", user: { name: "..." } }
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('refreshToken', response.data.refreshToken); // Save refresh token if available
      // localStorage.setItem('userProfile', JSON.stringify(response.data.user));
      
      // Pass the user object and the tokens as defined in backend
      login(response.data.user, { 
        accessToken: response.data.accessToken, 
        refreshToken: response.data.refreshToken 
      });

      // 3. Redirect to Dashboard
      navigate('/dashboard'); 
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Invalid Credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">

      {/* Background Decorative Glow (Top Left) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100/50 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- NAVBAR START --- */}
      <header className="w-full flex items-center justify-between px-8 py-5 z-10">
        {/* Linked Logo to Home */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* Logo Icon */}
          <div className="w-8 h-8 bg-[#db2777] rounded-md flex items-center justify-center rotate-45">
            <div className="w-3 h-3 bg-white rounded-sm -rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Gym & Fitness Assistant</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-slate-500">New to here?</span>
          {/* Linked Sign Up Button */}
          <Link to="/register" className="bg-[#db2777] hover:bg-[#be185d] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-pink-100">
            Sign Up
          </Link>
        </div>
      </header>
      {/* --- NAVBAR END --- */}

      {/* --- LOGIN FORM SECTION --- */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-50">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Access your personalized fitness insights.</p>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button type="button" className="text-xs font-bold text-pink-500 hover:text-pink-600">Forgot Password?</button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-pink-500 border-slate-300 rounded focus:ring-pink-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-500 font-medium">Keep me logged in</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons (UI Only for now) */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm">
              {/* Google Icon */}
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm">
              {/* Apple Icon - Updated with a more reliable direct SVG link */}
              <img src="https://purepng.com/public/uploads/large/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl.png" className="w-5 h-5" alt="Apple" />
              Apple
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-slate-400">
            Don't have an account? <Link to="/register" className="text-pink-500 font-bold hover:underline ml-1">Sign up now</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;