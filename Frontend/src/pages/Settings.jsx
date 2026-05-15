import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Moon, 
  Sun,
  Globe, 
  ChevronRight, 
  LogOut, 
  Trash2,
  Save,
  Mail,
  Lock
} from 'lucide-react';

const Settings = () => { // Renamed from Settings to Settings
  const navigate = useNavigate(); // Assuming this is used for navigation
  const { user, logout, setUser } = useContext(AuthContext); // Destructure setUser here
  const { isDarkMode, setDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    units: 'Metric (kg/cm)',
    language: 'English (US)',
    theme: isDarkMode ? 'Dark' : 'Light',
    emailNotifs: true,
    pushNotifs: true,
    marketingEmails: false,
    twoFactor: true,
  });

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

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'theme') {
      const isDark = value === 'Dark';
      setDarkMode(isDark);
    }
  };

  // Function to handle saving account information (name, email)
  const handleSaveAccountInfo = async () => {
    // Combine first and last name for the backend
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    setIsLoading(true);
    setSaveStatus('Saving...');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', fullName);

      const response = await api.put('/users/profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedUser = response.data.user;

      // Update AuthContext to reflect the new name and email across the app
      if (user && setUser) {
        setUser(prevUser => ({
          ...prevUser,
          name: updatedUser.name
        }));
      }

      setSaveStatus('Account information updated successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error updating account information: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    setSaveStatus('Saving preferences...');
    // In a real app, you would call an API here to save settings.
    // For now, we'll simulate a save operation.
    console.log("Saving settings:", {
      units: formData.units,
      language: formData.language,
      theme: formData.theme,
    });
    setTimeout(() => {
      setIsLoading(false);
      setSaveStatus('Preferences updated successfully!');
      // Clear the message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
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

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
    setSaveStatus('');
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) {
      setSaveStatus('Error: Password is required to delete your account.');
      return;
    }
  
    setIsLoading(true);
    setSaveStatus('Deleting account...');
    try {
      await api.delete('/users/delete-account', {
        data: { password: deletePassword }
      });
      setIsDeleteModalOpen(false);
      logout();
      navigate('/');
    } catch (error) {
      setSaveStatus('Error: ' + (error.response?.data?.message || 'Failed to delete account'));
    } finally {
      setIsLoading(false);
      setDeletePassword('');
    }
  };

  const tabs = [
    { 
      id: 'account', 
      label: 'Account', 
      icon: User, 
      keywords: ['name', 'first name', 'last name', 'email', 'profile', 'google', 'connect', 'disconnect', 'personal information'] 
    },
    { 
      id: 'preferences', 
      label: 'Preferences', 
      icon: Smartphone, 
      keywords: ['theme', 'dark mode', 'light mode', 'language', 'english', 'spanish', 'units', 'metric', 'imperial', 'appearance', 'region'] 
    },
    /* { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      keywords: ['email notifications', 'push', 'alert', 'marketing', 'promotions', 'updates', 'messages'] 
    }, */
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield, 
      keywords: ['password', 'change password', '2fa', 'two-factor', 'two factor', 'authentication', 'delete account', 'danger zone', 'login'] 
    },
  ];

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      const match = tabs.find(tab => 
        tab.label.toLowerCase().includes(lowerQuery) || 
        tab.keywords.some(keyword => keyword.includes(lowerQuery))
      );

      if (match && match.id !== activeTab) {
        setActiveTab(match.id);
      }
    }
  }, [searchQuery, activeTab]);

  return (
    <Layout>
      <style>
        {`
          
          .toggle-checkbox:checked {
            right: 0;
            border-color: #00c4b4;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #00c4b4;
          }

        `}
      </style>

      <div className={`max-w-5xl mx-auto ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>
        
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your account preferences and app settings.</p>
          
          {searchQuery && (
             <p className="text-sm font-bold text-[#00c4b4] mt-2 animate-pulse transition-all">
               Searching for "{searchQuery}"... <span className="text-slate-400 font-normal">Found in {tabs.find(t => t.id === activeTab)?.label}</span>
             </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className={`rounded-2xl shadow-sm border overflow-hidden sticky top-24 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <nav className="flex flex-col p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#00c4b4]/10 text-[#00c4b4]' 
                        : (isDarkMode ? 'text-slate-400 hover:bg-[#334155] hover:text-slate-200 active:scale-95' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 active:scale-95')
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className={`border-t p-2 mt-2 ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
                <Link to="/" className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  isDarkMode 
                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                    : 'text-red-500 hover:bg-red-50'
                }`}>
                  <LogOut size={18} />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Personal Information</h2>
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className="flex items-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#00c4b4]/20 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isEditMode ? 'Close' : 'Edit'}
                    </button>
                  </div>

                  {isEditMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">First Name</label>
                        <input 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00c4b4]/20 focus:border-[#00c4b4] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Last Name</label>
                        <input 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00c4b4]/20 focus:border-[#00c4b4] outline-none transition-all"
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
                            disabled
                            title="Email address cannot be changed"
                            className="w-full pl-11 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed outline-none transition-all"
                          />
                        </div>
                      </div>

                      {saveStatus && (
                        <div className={`md:col-span-2 p-3 rounded-lg text-sm font-bold ${saveStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {saveStatus}
                        </div>
                      )}

                      <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                        <button 
                          onClick={() => setIsEditMode(false)}
                          className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm active:scale-95"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveAccountInfo} // Use the specific function for account info
                          disabled={isLoading}
                          className="flex items-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#00c4b4]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 text-sm"
                        >
                          {isLoading ? '...' : <><Save size={16} /> Save Changes</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-xs font-bold text-slate-500 uppercase">First Name</p>
                        <p className="text-lg font-bold text-slate-900 mt-2">{formData.firstName || 'Not set'}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-xs font-bold text-slate-500 uppercase">Last Name</p>
                        <p className="text-lg font-bold text-slate-900 mt-2">{formData.lastName || 'Not set'}</p>
                      </div>
                      <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl">
                        <p className="text-xs font-bold text-slate-500 uppercase">Email Address</p>
                        <p className="text-lg font-bold text-slate-900 mt-2">{formData.email || 'Not set'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* {!isEditMode && (
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold">Connected Accounts</h2>
                    </div>
                    <p className="text-slate-500 text-sm">No connected accounts. Social login has been removed for security purposes.</p>
                  </div>
                )} */}
              </div>
            )}

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
                    {/* <option>Spanish (ES)</option> */}
                    {/* <option>French (FR)</option> */}
                  </select>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-pink-50 text-teal-500 rounded-full flex items-center justify-center">
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

                {/* <div className="flex items-center justify-between">
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
                </div> */}

              </div>
            )}

            {/* {activeTab === 'notifications' && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in space-y-8">
                
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
                      style={formData.emailNotifs ? { right: 0, borderColor: '#00c4b4' } : { right: '50%', borderColor: '#e2e8f0' }}
                    />
                    <label 
                      htmlFor="emailNotifs" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${formData.emailNotifs ? 'bg-[#00c4b4]' : 'bg-slate-200'}`}
                    ></label>
                  </div>
                </div>

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
                      style={formData.pushNotifs ? { right: 0, borderColor: '#00c4b4' } : { right: '50%', borderColor: '#e2e8f0' }}
                    />
                    <label 
                      htmlFor="pushNotifs" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${formData.pushNotifs ? 'bg-[#00c4b4]' : 'bg-slate-200'}`}
                    ></label>
                  </div>
                </div>

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
                      style={formData.marketingEmails ? { right: 0, borderColor: '#00c4b4' } : { right: '50%', borderColor: '#e2e8f0' }}
                    />
                    <label 
                      htmlFor="marketingEmails" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${formData.marketingEmails ? 'bg-[#00c4b4]' : 'bg-slate-200'}`}
                    ></label>
                  </div>
                </div>

              </div>
            )} */}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-6">Change Password</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Current Password</label>
                        <Link to="/forgot-password" className="text-xs font-bold text-[#00c4b4] hover:underline">
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00c4b4]/20 focus:border-[#00c4b4] outline-none transition-all"
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
                          className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00c4b4]/20 focus:border-[#00c4b4] outline-none transition-all"
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
                          className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#00c4b4]/20 focus:border-[#00c4b4] outline-none transition-all"
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
                      className="flex items-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#00c4b4]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
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
                    className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                  >
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'preferences' /* || activeTab === 'notifications' */) && (
              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-[#00c4b4] hover:bg-[#00a89f] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#00c4b4]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-wait"
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

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold text-red-600">Confirm Account Deletion</h2>
              <p className="text-sm text-slate-500 mt-2 mb-4">
                This action is irreversible. To confirm, please enter your password.
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
              />
              {saveStatus.includes('Error') && (
                <p className="text-red-500 text-xs mt-2 font-bold">{saveStatus}</p>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 text-sm"
                >
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Settings;