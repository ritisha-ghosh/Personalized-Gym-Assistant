import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom'; // 1. Import Hook
import Layout from "../componenets/layout/Layout";
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Moon, 
  Globe, 
  ChevronRight, 
  LogOut, 
  Trash2,
  Save,
  Mail,
  Lock
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // 2. Search Params Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // --- State for Dynamic Settings ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    units: 'Metric (kg/cm)',
    language: 'English (US)',
    theme: 'Light',
    emailNotifs: true,
    pushNotifs: true,
    marketingEmails: false,
    twoFactor: true,
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile');
        const userData = response.data.user;
        const [firstName, lastName] = userData.name?.split(' ') || ['', ''];
        
        setFormData(prev => ({
          ...prev,
          firstName: firstName || '',
          lastName: lastName || '',
          email: userData.email || ''
        }));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  // --- Handlers ---
  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveStatus('Saving...');
    try {
      await api.put('/users/update-settings', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        units: formData.units,
        language: formData.language,
        theme: formData.theme,
        emailNotifs: formData.emailNotifs,
        pushNotifs: formData.pushNotifs,
        marketingEmails: formData.marketingEmails,
        twoFactor: formData.twoFactor
      });
      setSaveStatus('Settings updated successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving settings: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setSaveStatus('Please fill in all password fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveStatus('New passwords do not match');
      return;
    }

    setIsLoading(true);
    setSaveStatus('Updating password...');
    try {
      await api.put('/users/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSaveStatus('Password changed successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error: ' + (error.response?.data?.message || 'Failed to change password'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    setIsLoading(true);
    setSaveStatus('Deleting account...');
    try {
      await api.delete('/users/delete-account', {
        data: { password }
      });
      logout();
      navigate('/');
      setSaveStatus('Account deleted successfully');
    } catch (error) {
      setSaveStatus('Error: ' + (error.response?.data?.message || 'Failed to delete account'));
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. SMART NAVIGATION CONFIGURATION ---
  // Define keywords for each tab. If a search matches a keyword, we switch to that tab.
  const tabs = [
    { 
      id: 'account', 
      label: 'Account', 
      icon: User, 
      // Keywords that should trigger the 'Account' tab
      keywords: ['name', 'first name', 'last name', 'email', 'profile', 'google', 'connect', 'disconnect', 'personal information'] 
    },
    { 
      id: 'preferences', 
      label: 'Preferences', 
      icon: Smartphone, 
      // Keywords that should trigger the 'Preferences' tab
      keywords: ['theme', 'dark mode', 'light mode', 'language', 'english', 'spanish', 'units', 'metric', 'imperial', 'appearance', 'region'] 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      // Keywords that should trigger the 'Notifications' tab
      keywords: ['email notifications', 'push', 'alert', 'marketing', 'promotions', 'updates', 'messages'] 
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield, 
      // Keywords that should trigger the 'Security' tab
      keywords: ['password', 'change password', '2fa', 'two-factor', 'two factor', 'authentication', 'delete account', 'danger zone', 'login'] 
    },
  ];

  // --- 4. AUTO-SWITCH LOGIC ---
  // This effect runs every time the search query changes
  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      // Find the tab where the Label OR any Keyword matches the search query
      const match = tabs.find(tab => 
        tab.label.toLowerCase().includes(lowerQuery) || 
        tab.keywords.some(keyword => keyword.includes(lowerQuery))
      );

      // If a matching tab is found and it's not the current one, switch to it
      if (match && match.id !== activeTab) {
        setActiveTab(match.id);
      }
    }
  }, [searchQuery, activeTab]);

  return (
    <Layout>
      {/* Inject Fonts locally */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          
          /* Custom Toggle Switch */
          .toggle-checkbox:checked {
            right: 0;
            border-color: #df20af;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #df20af;
          }
        `}
      </style>

      <div className="font-sans text-slate-900 max-w-5xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account preferences and app settings.</p>
          
          {/* Smart Search Feedback Message */}
          {searchQuery && (
             <p className="text-sm font-bold text-[#df20af] mt-2 animate-pulse transition-all">
               Searching for "{searchQuery}"... <span className="text-slate-400 font-normal">Found in {tabs.find(t => t.id === activeTab)?.label}</span>
             </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Sidebar Navigation --- */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <nav className="flex flex-col p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#df20af]/10 text-[#df20af]' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="border-t border-slate-100 p-2 mt-2">
                <Link to="/" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={18} />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>

          {/* --- Main Content Area --- */}
          <div className="flex-1 space-y-6">
            
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">First Name</label>
                      <input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Last Name</label>
                      <input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-11 bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Connected Accounts</h2>
                    <button className="text-[#df20af] text-sm font-bold hover:underline">Add Account</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Google</p>
                          <p className="text-xs text-slate-500">Connected as {formData.email}</p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-red-500 font-bold text-xs transition-colors">Disconnect</button>
                    </div>
                  </div>

                  {/* Save Account Settings Button */}
                  {saveStatus && (
                    <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${saveStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {saveStatus}
                    </div>
                  )}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-[#df20af] hover:bg-[#c91d9d] text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70"
                    >
                      {isLoading ? '...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in space-y-8">
                
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Language & Region</h3>
                      <p className="text-xs text-slate-500">Customize your language preference</p>
                    </div>
                  </div>
                  <select 
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="bg-slate-50 border-none text-sm font-bold rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer"
                  >
                    <option>English (US)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center">
                      <Moon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Appearance</h3>
                      <p className="text-xs text-slate-500">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <select 
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="bg-slate-50 border-none text-sm font-bold rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer"
                  >
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                      <ChevronRight size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Units of Measurement</h3>
                      <p className="text-xs text-slate-500">Set your preferred weight/distance units</p>
                    </div>
                  </div>
                  <select 
                    name="units"
                    value={formData.units}
                    onChange={handleChange}
                    className="bg-slate-50 border-none text-sm font-bold rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer"
                  >
                    <option>Metric (kg/cm)</option>
                    <option>Imperial (lbs/in)</option>
                  </select>
                </div>

              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in space-y-8">
                
                {/* Toggle Item */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Email Notifications</h3>
                    <p className="text-xs text-slate-500 mt-1">Receive weekly summaries and alerts</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="emailNotifs" 
                      id="emailNotifs" 
                      checked={formData.emailNotifs}
                      onChange={() => handleToggle('emailNotifs')}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                      style={formData.emailNotifs ? { right: 0, borderColor: '#df20af' } : { right: '50%', borderColor: '#e2e8f0' }}
                    />
                    <label 
                      htmlFor="emailNotifs" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${formData.emailNotifs ? 'bg-[#df20af]' : 'bg-slate-200'}`}
                    ></label>
                  </div>
                </div>

                {/* Toggle Item */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Push Notifications</h3>
                    <p className="text-xs text-slate-500 mt-1">Get instant updates on your workout progress</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="pushNotifs" 
                      id="pushNotifs" 
                      checked={formData.pushNotifs}
                      onChange={() => handleToggle('pushNotifs')}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                      style={formData.pushNotifs ? { right: 0, borderColor: '#df20af' } : { right: '50%', borderColor: '#e2e8f0' }}
                    />
                    <label 
                      htmlFor="pushNotifs" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${formData.pushNotifs ? 'bg-[#df20af]' : 'bg-slate-200'}`}
                    ></label>
                  </div>
                </div>

                 {/* Toggle Item */}
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Marketing Emails</h3>
                    <p className="text-xs text-slate-500 mt-1">Receive offers and partner promotions</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="marketingEmails" 
                      id="marketingEmails" 
                      checked={formData.marketingEmails}
                      onChange={() => handleToggle('marketingEmails')}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                      style={formData.marketingEmails ? { right: 0, borderColor: '#df20af' } : { right: '50%', borderColor: '#e2e8f0' }}
                    />
                    <label 
                      htmlFor="marketingEmails" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${formData.marketingEmails ? 'bg-[#df20af]' : 'bg-slate-200'}`}
                    ></label>
                  </div>
                </div>

              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-6">Change Password</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {saveStatus && (
                    <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${saveStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {saveStatus}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                    <button 
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-[#df20af] hover:bg-[#c91d9d] text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70"
                    >
                      {isLoading ? '...' : 'Update Password'}
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
                  <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-sm text-red-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                  
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-70"
                  >
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Save Button (Global for Preferences/Notifications) */}
            {(activeTab === 'preferences' || activeTab === 'notifications') && (
              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-[#df20af] hover:bg-[#c91d9d] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#df20af]/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Save size={18} />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;