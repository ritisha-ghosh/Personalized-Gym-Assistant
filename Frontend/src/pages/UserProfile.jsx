import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  // --- State for Dynamic Functionality ---
  const [formData, setFormData] = useState({
    height: '178 cm',
    weight: '75 kg',
    bio: 'Training for my first marathon in November. Looking to increase strength while maintaining aerobic capacity.',
  });

  const [selectedGoal, setSelectedGoal] = useState('Muscle Gain');
  const [isInjuryActive, setIsInjuryActive] = useState(true);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop');
  const [showGalleryModal, setShowGalleryModal] = useState(false);

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

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving data...", { ...formData, selectedGoal, isInjuryActive, profileImage });
    alert("Profile Saved!");
  };

  const handleSelectProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
    setShowGalleryModal(false);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        setShowGalleryModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* --- Styles for Fonts & Icons --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
          }
          .icon-filled {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          
          /* Custom Sidebar Active State */
          .sidebar-active {
            background-color: white;
            color: #df20af;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          /* Modal Animations */
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .modal-content {
            animation: modalSlideIn 0.3s ease-out;
          }
        `}
      </style>

      <div className="flex min-h-screen bg-[#fcfcfc] text-slate-800 font-sans">
        
        {/* --- Sidebar (Mint Green Theme) --- */}
        <aside className="w-72 bg-[#eef7f6] border-r border-slate-100 flex flex-col h-screen sticky top-0 hidden lg:flex">
          <div className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#df20af] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#df20af]/20">
                <span className="material-symbols-outlined text-2xl font-bold">bolt</span>
              </div>
              <div>
                <h1 className="text-slate-900 font-bold text-lg leading-none tracking-tight">PulseAI</h1>
                <p className="text-slate-500 text-xs mt-1 font-medium">Gym Assistant</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {['Dashboard', 'Workouts', 'Nutrition'].map((item) => (
                <a key={item} href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/60 hover:text-[#df20af] rounded-xl transition-all group">
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                    {item === 'Dashboard' ? 'grid_view' : item === 'Workouts' ? 'fitness_center' : 'restaurant'}
                  </span>
                  <span className="text-sm font-semibold">{item}</span>
                </a>
              ))}
              
              {/* Active Profile Link */}
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 sidebar-active rounded-xl transition-all">
                <span className="material-symbols-outlined icon-filled">person</span>
                <span className="text-sm font-bold">Profile</span>
              </Link>

              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/60 hover:text-[#df20af] rounded-xl transition-all group">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">settings</span>
                <span className="text-sm font-semibold">Settings</span>
              </a>
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-slate-200/50">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors group">
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">logout</span>
              <span className="text-sm font-bold">Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1 max-w-5xl mx-auto px-8 py-12 lg:px-12">
          
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-full border-[5px] border-white shadow-xl bg-cover bg-center"
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
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Alex Rivera</h2>
                <p className="text-slate-500 font-medium text-sm">Elite Member since Jan 2023</p>
                <div className="mt-3">
                  <span className="px-3 py-1 bg-[#eef7f6] text-[#2d5a56] text-[11px] font-extrabold rounded-full uppercase tracking-wider border border-[#dceceb]">
                    Lvl 42 Athlete
                  </span>
                </div>
              </div>
            </div>
            
            <button className="bg-[#df20af] hover:bg-[#c91d9d] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#df20af]/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </button>
          </div>

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
                    <p className="text-[#967614] font-bold text-sm mb-4">Current Active Injury: Left Knee (Patellar Tendonitis)</p>
                    <div className="bg-white/60 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                      <p className="text-sm text-[#856404] leading-relaxed italic font-medium">
                        "PulseAI is currently optimizing your lower body routines to avoid high-impact jumping and heavy squats. Focusing on glute isolation and eccentric movements."
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#967614]/70 font-medium text-sm mt-1">No active injuries reported. You are clear for full-intensity workouts.</p>
                )}
              </div>
            </section>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 pt-4 pb-12">
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
        </main>
      </div>

      {/* --- Gallery Modal --- */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
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
    </>
  );
};

export default UserProfile;