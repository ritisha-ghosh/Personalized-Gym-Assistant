import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DarkModeContext } from '../context/DarkModeContext'; // Import Dark Mode Context

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isDarkMode } = useContext(DarkModeContext); // Use Dark Mode Context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data) {
        setSuccess(response.data.message);
        // Navigate to the reset password page, passing the email
        navigate('/reset-password', { state: { email: email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Updated container background for dark mode
    <div className={`flex min-h-screen items-center justify-center font-sans ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'}`}>
      <style>
        {`
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
      {/* Updated card background for dark mode */}
      <div className={`w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white'}`}>
        <div className="text-center">
          {/* Updated text colors for dark mode */}
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Forgot Password?</h2>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
            Enter your email address to receive a password reset OTP.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-bold">
              {success} Redirecting...
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-all focus:border-teal-500 ${
                isDarkMode 
                  ? 'bg-[#334155] border-[#475569] text-white' 
                  : 'bg-slate-50/50 border-slate-200 text-slate-900'
              }`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!success}
              className={`w-full font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                loading || !!success 
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                  : 'bg-[#db2777] hover:bg-[#be185d] text-white'
              }`}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        </form>
        <p className={`text-center text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
          <Link to="/login" className={`font-medium hover:underline ${isDarkMode ? 'text-white' : 'text-slate-600'}`}>
            &larr; Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;