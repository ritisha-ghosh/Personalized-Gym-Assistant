import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    experience: '',
    goal: '',
    dietType: '',
    bio: '',
    injury: 'none'
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isInjuryActive, setIsInjuryActive] = useState(false);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/profile');
        const data = response.data.user;

        setFormData({
          height: data.height || '',
          weight: data.weight || '',
          age: data.age || '',
          gender: data.gender || '',
          experience: data.experience || '',
          goal: data.goal || '',
          dietType: data.dietType || '',
          bio: data.bio || '',
          injury: data.injury || 'none'
        });

        setProfileImage(data.profileImage || null);
        setIsInjuryActive(data.injury && data.injury !== 'none');
      } catch (err) {
        console.error("Failed to load profile", err);
        setSaveStatus('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save profile to backend
  const handleSave = async () => {
    setSaveStatus('Saving...');
    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      if (formData.height) formDataToSend.append('height', parseInt(formData.height));
      if (formData.weight) formDataToSend.append('weight', parseInt(formData.weight));
      if (formData.age) formDataToSend.append('age', parseInt(formData.age));
      if (formData.gender) formDataToSend.append('gender', formData.gender);
      if (formData.experience) formDataToSend.append('experience', formData.experience);
      if (formData.goal) formDataToSend.append('goal', formData.goal);
      if (formData.dietType) formDataToSend.append('dietType', formData.dietType);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      formDataToSend.append('injury', isInjuryActive ? formData.injury : 'none');
      
      // Add profile image file if new file was selected
      if (profileImageFile) {
        formDataToSend.append('profileImage', profileImageFile);
      }

      await api.put('/users/update-profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Re-fetch profile to get updated image from backend
      const response = await api.get('/users/profile');
      const data = response.data.user;
      setProfileImage(data.profileImage || null);

      setSaveStatus('✓ Profile updated successfully!');
      setIsEditMode(false);
      setProfileImageFile(null);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus('✕ Error saving profile: ' + (err.response?.data?.message || 'Please try again'));
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Handle file upload
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target.result);
          setShowGalleryModal(false);
          setUploadError('');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setUploadError('Failed to upload image');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-size: 20px; }
          .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          @keyframes modalSlideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .modal-content { animation: modalSlideIn 0.3s ease-out; }
        `}
      </style>

      <div className="font-jakarta max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-10">

        {/* --- HEADER SECTION --- */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div
                className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full border-4 sm:border-[5px] border-white shadow-xl bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: profileImage ? `url('${profileImage}')` : 'linear-gradient(135deg, #00c4b4, #00a89f)',
                  backgroundColor: !profileImage ? '#00c4b4' : 'transparent'
                }}
              ></div>
              {isEditMode && (
                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="absolute bottom-0 right-0 bg-teal-500 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">
                {user?.name || "User"}
              </h2>
              <p className="text-slate-500 font-medium text-sm">
                {user?.email || "Member"}
              </p>
              {formData.dietType && (
                <p className="text-slate-400 font-medium text-xs mt-2">
                  <span className="text-teal-500 font-bold">Diet:</span> {formData.dietType.charAt(0).toUpperCase() + formData.dietType.slice(1)}
                </p>
              )}
              {formData.goal && (
                <p className="text-slate-400 font-medium text-xs">
                  <span className="text-teal-500 font-bold">Goal:</span> {formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditMode ? 'close' : 'edit'}
            </span>
            {isEditMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Status Messages */}
        {saveStatus && (
          <div className={`mb-6 px-6 py-3 rounded-xl font-bold text-sm ${
            saveStatus.includes('✓') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveStatus}
          </div>
        )}

        {/* Edit Mode Content */}
        {isEditMode && (
          <div className="grid grid-cols-1 gap-8">

            {/* Physical Metrics */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">straighten</span>
                <h3 className="text-lg font-bold text-slate-900">Physical Metrics</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Height (cm)</label>
                  <input
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-900 font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Weight (kg)</label>
                  <input
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-900 font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Age</label>
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-900 font-bold transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Fitness Profile */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">person</span>
                <h3 className="text-lg font-bold text-slate-900">Fitness Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-bold"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Experience Level</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-bold"
                  >
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Goals & Diet */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">target</span>
                <h3 className="text-lg font-bold text-slate-900">Goals & Diet</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fitness Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-bold"
                  >
                    <option value="">Select Goal</option>
                    <option value="muscle gain">Muscle Gain</option>
                    <option value="fat loss">Fat Loss</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Diet Type</label>
                  <select
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-bold"
                  >
                    <option value="">Select Diet Type</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Bio */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">description</span>
                <h3 className="text-lg font-bold text-slate-900">Bio / Motivation</h3>
              </div>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your fitness journey..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-700 font-medium resize-none transition-all leading-relaxed"
                rows="4"
              ></textarea>
            </section>

            {/* Injury Status */}
            <section className="bg-[#fdf8e6] p-8 rounded-2xl border border-[#f3eac5]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#856404]">medical_services</span>
                  <h3 className="text-lg font-bold text-[#856404]">Injury Status</h3>
                </div>
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

              {isInjuryActive && (
                <input
                  name="injury"
                  value={formData.injury}
                  onChange={handleInputChange}
                  placeholder="Describe your injury"
                  className="w-full bg-white border border-[#f3eac5] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#856404]/20 text-slate-900 font-medium"
                />
              )}
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditMode(false)}
                className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#df20af] text-white px-10 py-3 rounded-xl font-bold shadow-xl shadow-[#df20af]/30 hover:shadow-[#df20af]/40 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* View Mode Content */}
        {!isEditMode && (
          <div className="grid grid-cols-1 gap-8">

            {/* Physical Metrics */}
            {(formData.height || formData.weight || formData.age) && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">straighten</span>
                  <h3 className="text-lg font-bold text-slate-900">Physical Metrics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.height && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500 uppercase">Height</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">{formData.height} cm</p>
                    </div>
                  )}
                  {formData.weight && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500 uppercase">Weight</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">{formData.weight} kg</p>
                    </div>
                  )}
                  {formData.age && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500 uppercase">Age</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">{formData.age} yrs</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Fitness Profile */}
            {(formData.gender || formData.experience) && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">person</span>
                  <h3 className="text-lg font-bold text-slate-900">Fitness Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.gender && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500 uppercase">Gender</p>
                      <p className="text-lg font-bold text-slate-900 mt-2 capitalize">{formData.gender}</p>
                    </div>
                  )}
                  {formData.experience && (
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500 uppercase">Experience</p>
                      <p className="text-lg font-bold text-slate-900 mt-2 capitalize">{formData.experience}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Goals & Diet */}
            {(formData.goal || formData.dietType) && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">target</span>
                  <h3 className="text-lg font-bold text-slate-900">Goals & Diet</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.goal && (
                    <div className="bg-gradient-to-br from-[#df20af]/5 to-[#df20af]/10 p-4 rounded-xl border border-[#df20af]/20">
                      <p className="text-xs font-bold text-teal-500 uppercase">Fitness Goal</p>
                      <p className="text-lg font-bold text-slate-900 mt-2 capitalize">{formData.goal}</p>
                    </div>
                  )}
                  {formData.dietType && (
                    <div className="bg-gradient-to-br from-[#10b981]/5 to-[#10b981]/10 p-4 rounded-xl border border-[#10b981]/20">
                      <p className="text-xs font-bold text-[#10b981] uppercase">Diet Type</p>
                      <p className="text-lg font-bold text-slate-900 mt-2 capitalize">{formData.dietType}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Bio */}
            {formData.bio && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">description</span>
                  <h3 className="text-lg font-bold text-slate-900">Bio</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{formData.bio}</p>
              </section>
            )}

            {/* Injury Status */}
            {isInjuryActive && formData.injury && formData.injury !== 'none' && (
              <section className="bg-[#fdf8e6] p-8 rounded-2xl border border-[#f3eac5]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#856404]">medical_services</span>
                  <h3 className="text-lg font-bold text-[#856404]">Injury Status</h3>
                </div>
                <p className="text-[#856404] font-medium">{formData.injury}</p>
              </section>
            )}

            {!formData.height && !formData.weight && !formData.bio && !formData.goal && (
              <div className="text-center py-20">
                <p className="text-slate-400 mb-4">No profile information yet</p>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-[#df20af] text-white px-6 py-2.5 rounded-xl font-bold"
                >
                  Add Profile Information
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Gallery Modal --- */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Upload Photo</h2>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <div>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleUploadImage}
                  accept="image/*"
                  className="sr-only"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-[#df20af]/30 rounded-2xl cursor-pointer hover:border-[#df20af]/60 hover:bg-[#df20af]/5 transition-all"
                >
                  <span className="material-symbols-outlined text-4xl text-teal-500">cloud_upload</span>
                  <div className="text-center">
                    <p className="font-bold text-slate-900">Click to upload</p>
                    <p className="text-xs text-slate-500">or drag and drop</p>
                  </div>
                </label>
              </div>
              {uploadError && (
                <p className="text-red-600 text-sm mt-4">{uploadError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;

