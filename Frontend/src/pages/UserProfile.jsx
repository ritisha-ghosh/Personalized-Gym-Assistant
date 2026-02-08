import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import Hook
import Layout from "../componenets/layout/Layout";
import { uploadImageToLocalStorage, validateImageFile } from "../utils/fileUploadUtils";
import { updateMyProfile } from '../../api';

const UserProfile = () => {
  // 2. Search Params Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // --- State for Dynamic Functionality ---
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bio: 'Training for my first marathon. Looking to increase strength while maintaining aerobic capacity.',
  });

  const [user, setUser] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isInjuryActive, setIsInjuryActive] = useState(false);
  const [injuryText, setInjuryText] = useState('');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const loadProfile = () => {
      // Load user profile from storage on component mount
      const profile = JSON.parse(localStorage.getItem('userProfile'));
      if (profile) {
        setUser(profile);
        setFormData({
          height: profile.height || '',
          weight: profile.weight || '',
          bio: profile.bio || 'Training for my first marathon...',
        });
        setSelectedGoal(profile.goal || 'Muscle Gain');
        setIsInjuryActive(!!profile.injury);
        setInjuryText(profile.injury || '');
      }
    };
    loadProfile();
  }, []);

  // --- Profile Image Gallery ---
  const profileImageGallery = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530268729831-4be0efed20da?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2000&auto=format&fit=crop',
  ];

  // --- Badges & Stats Data ---
  const badges = [
    "Early Bird", "Consistency King", "Heavy Lifter", "Yogi Master", "Marathon Runner", "Nutrition Pro"
  ];

  const stats = [
    { label: "Workouts", value: 142 },
    { label: "Hours Trained", value: 85 },
    { label: "Active Streak", value: "12 Days" },
    { label: "Weight Goal", value: "60 kg" }
  ];

  // 3. Filter Logic
  const filteredBadges = badges.filter(badge => 
    badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStats = stats.filter(stat => 
    !searchQuery || stat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaveStatus('Saving...');
    const payload = {
      height: parseInt(formData.height) || undefined,
      weight: parseInt(formData.weight) || undefined,
      bio: formData.bio,
      goal: selectedGoal,
      injury: isInjuryActive ? injuryText : "",
    };

    try {
      const { data: updatedUser } = await updateMyProfile(payload);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveStatus('Profile saved successfully!');
    } catch (error) {
      setSaveStatus('Failed to save profile.');
      console.error(error);
    } finally {
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSelectProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
    setShowGalleryModal(false);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.errors[0]);
        return;
      }

      try {
        const result = await uploadImageToLocalStorage(file, 'profile_image');
        if (result.success) {
          setProfileImage(result.url);
          setUploadError('');
          setShowGalleryModal(false);
        } else {
          setUploadError(result.error);
        }
      } catch (error) {
        setUploadError('Failed to upload image');
      }
    }
  };

  return (
    <Layout>
      {/* --- Styles for Fonts & Icons (Scoped) --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
          }
          .icon-filled {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }

          /* Modal Animations */
          @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .modal-content {
            animation: modalSlideIn 0.3s ease-out;
          }
        `}
      </style>

      {/* --- Main Content Area (Wrapped in Layout) --- */}
      <div className="font-jakarta max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-10">
        
        {/* Header Section - Responsive */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div 
                className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full border-4 sm:border-[5px] border-white shadow-xl bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url('${profileImage}')` }}
              ></div>
              <button 
                onClick={() => setShowGalleryModal(true)}
                className="absolute bottom-0 right-0 bg-[#df20af] w-9 h-9 rounded-full border-4 border-white flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{user?.name || 'User'}</h2>
              <p className="text-slate-500 font-medium text-sm">Elite Member since Jan 2023</p>
              
              {/* Filtered Badges Row */}
              <div className="mt-3 flex flex-wrap gap-2">
                {filteredBadges.length > 0 ? filteredBadges.slice(0, 3).map((badge, i) => (
                  <span key={i} className="px-3 py-1 bg-[#eef7f6] text-[#2d5a56] text-[11px] font-extrabold rounded-full uppercase tracking-wider border border-[#dceceb]">
                    🏆 {badge}
                  </span>
                )) : (
                   searchQuery && <span className="text-xs text-slate-400">No badges match "{searchQuery}"</span>
                )}
              </div>
            </div>
          </div>
          
          <button className="bg-[#df20af] hover:bg-[#c91d9d] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#df20af]/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </div>

        {/* Stats Grid (Filtered) */}
        {filteredStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {filteredStats.map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl text-center border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase">{stat.label}</p>
                <p className="text-xl font-extrabold text-slate-800">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          
          {/* 1. Physical Metrics Card */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#df20af]">straighten</span>
              <h3 className="text-lg font-bold text-slate-900">Physical Metrics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Current Height</label>
                <div className="relative group">
                  <input 
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#df20af]/20 focus:bg-white text-slate-900 font-bold transition-all text-lg group-hover:bg-slate-100/50" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Target Weight</label>
                <div className="relative group">
                  <input 
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#df20af]/20 focus:bg-white text-slate-900 font-bold transition-all text-lg group-hover:bg-slate-100/50" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. Fitness Goals Card */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#df20af]">target</span>
              <h3 className="text-lg font-bold text-slate-900">Fitness Goals</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'Muscle Gain', icon: 'fitness_center' },
                  { id: 'Endurance', icon: 'directions_run' },
                  { id: 'Weight Loss', icon: 'self_care' }
                ].map((goal) => (
                  <div 
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-5 border-2 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-200 ${
                      selectedGoal === goal.id 
                        ? 'border-[#df20af] bg-[#df20af]/5 text-[#142E5C]' 
                        : 'border-slate-100 hover:border-[#df20af]/30 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span className={`material-symbols-outlined mb-2 text-2xl ${selectedGoal === goal.id ? 'text-[#df20af] icon-filled' : 'text-slate-400'}`}>
                      {goal.icon}
                    </span>
                    <span className={`font-bold text-sm ${selectedGoal === goal.id ? 'text-slate-900' : 'text-slate-500'}`}>
                      {goal.id}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Bio / Motivation</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#df20af]/20 focus:bg-white text-slate-700 font-medium resize-none transition-all leading-relaxed hover:bg-slate-100/50" 
                  rows="3"
                ></textarea>
              </div>
            </div>
          </section>

          {/* 3. Injury Status Card (Gold Theme) */}
          <section className="bg-[#fdf8e6] p-8 rounded-2xl border border-[#f3eac5] flex flex-col md:flex-row items-start gap-6 relative overflow-hidden transition-all">
            <div className="bg-[#f3eac5] p-3 rounded-xl text-[#856404] shrink-0">
              <span className="material-symbols-outlined icon-filled">medical_services</span>
            </div>
            
            <div className="flex-1 w-full relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#856404]">Injury Status</h3>
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isInjuryActive} 
                    onChange={() => setIsInjuryActive(!isInjuryActive)} 
                  />
                  <div className="w-12 h-7 bg-[#dcdcdc] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#856404]"></div>
                </label>
              </div>

              {isInjuryActive ? (
                <div className="mt-2 transition-all duration-300 ease-in-out">
                  <p className="text-[#967614] font-bold text-sm mb-4">Current Active Injury:</p>
                  <input
                    type="text"
                    value={injuryText}
                    onChange={(e) => setInjuryText(e.target.value)}
                    placeholder="Describe your injury..."
                    className="w-full bg-white/60 p-4 rounded-xl border border-white/50 backdrop-blur-sm text-sm text-[#856404] leading-relaxed italic font-medium focus:ring-1 focus:ring-yellow-600 outline-none"
                  />
                  <div className="bg-white/60 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                    <p className="text-sm text-[#856404] leading-relaxed italic font-medium">
                      "PulseAI will optimize your routines based on this information."
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[#967614]/70 font-medium text-sm mt-1">No active injuries reported. You are clear for full-intensity workouts.</p>
              )}
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="space-y-4 pt-4 pb-12">
            {saveStatus && (
              <div className="px-6 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-sm">
                ✓ {saveStatus}
              </div>
            )}
            {uploadError && (
              <div className="px-6 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm">
                ✕ {uploadError}
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors text-sm"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#df20af] text-white px-10 py-3 rounded-xl font-bold shadow-xl shadow-[#df20af]/30 hover:shadow-[#df20af]/40 hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                Save Profile
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- Gallery Modal (Portaled or overlay) --- */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-jakarta">
          <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-900">Change Profile Picture</h2>
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              
              {/* Upload Section */}
              <div>
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 block">Upload Custom Photo</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="file-upload"
                    onChange={handleUploadImage}
                    accept="image/*"
                    className="sr-only"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-3 px-6 py-6 border-2 border-dashed border-[#df20af]/30 rounded-2xl cursor-pointer hover:border-[#df20af]/60 hover:bg-[#df20af]/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-3xl text-[#df20af]">cloud_upload</span>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">Click to upload</p>
                      <p className="text-xs text-slate-500">or drag and drop</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Gallery Grid */}
              <div>
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 block">Select from Gallery</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {profileImageGallery.map((imageUrl, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSelectProfileImage(imageUrl)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all transform hover:scale-105 ${
                        profileImage === imageUrl ? 'ring-4 ring-[#df20af] shadow-lg' : 'hover:shadow-md'
                      }`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-40 object-cover group-hover:brightness-75 transition-all"
                      />
                      {profileImage === imageUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#df20af]/20 backdrop-blur-sm">
                          <span className="material-symbols-outlined text-4xl text-white icon-filled">check_circle</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex justify-end gap-4">
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="bg-[#df20af] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#c91d9d] transition-all shadow-lg shadow-[#df20af]/20 text-sm"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;