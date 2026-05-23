import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "../componenets/layout/Layout";
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import api from '../utils/api';

const rawDiseases = ["High BP", "Low BP", "Diabetes", "Pre Diabetes", "High Cholesterol", "Heart Disease", "Obesity", "Asthma", "Arthritis", "Thyroid", "PCOS", "Fatty Liver", "Kidney Disease", "Depression", "Anxiety", "Migraine", "Cervical Pain", "Sciatica", "Spondylitis", "Insomnia", "Anemia", "Vitamin D Deficiency", "Vitamin B12 Deficiency", "IBS", "Acidity", "Ulcer", "COPD", "Sleep Apnea", "Epilepsy", "Vertigo", "Hyperthyroidism", "Hypothyroidism", "Osteoporosis", "Joint Pain", "Frozen Shoulder", "Tennis Elbow", "Carpal Tunnel", "GERD", "Piles", "Constipation", "Sinusitis", "Allergy", "Bronchitis", "Stress", "PCOD", "Menopause", "Post Pregnancy Weakness", "Weak Immunity", "Muscle Weakness", "Liver Disorder", "Heart Blockage", "High Triglycerides", "Low Stamina", "Underweight", "Overweight"];
const diseasesList = ["Regular", ...rawDiseases.sort()];

const rawInjuries = ["Hand Fracture", "Arm Fracture", "Leg Fracture", "Foot Fracture", "Shoulder Injury", "Elbow Injury", "Wrist Injury", "Knee Pain", "Back Pain", "Neck Injury", "Ankle Injury", "Hip Injury", "Muscle Tear", "ACL Injury", "Hamstring Injury", "Finger Fracture", "Toe Fracture", "Chest Injury", "Spinal Injury", "Ligament Tear", "Meniscus Tear", "Heel Pain", "Calf Injury", "Bicep Tear", "Tricep Injury", "Rotator Cuff Injury", "Groin Injury", "Pelvic Injury", "Tailbone Pain", "Shin Splints", "Dislocated Shoulder", "Dislocated Knee", "Nerve Injury", "Sciatic Injury", "Whiplash", "Jaw Injury", "Rib Fracture", "Skull Injury", "Eye Injury", "Burn Injury", "Sprained Wrist", "Sprained Ankle", "Pulled Muscle", "Tendon Injury", "Lower Back Strain", "Upper Back Strain", "Patella Injury", "Quad Injury", "Achilles Injury", "Fractured Collarbone", "Frozen Joint", "Hip Flexor Injury", "IT Band Syndrome", "Stress Fracture"];
const injuriesList = ["Regular", ...rawInjuries.sort()];

const UserProfile = () => {
  const { user, login, updateUser } = useContext(AuthContext); 
  const { isDarkMode } = useContext(DarkModeContext);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [pageError, setPageError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    experience: '',
    goal: '',
    dietType: '',
    activityLevel: '',
    bio: '',
    noOnion: false,
    noGarlic: false,
    glutenFree: false,
    lactoseFree: false,
    nutAllergy: false,
    sugarFree: false
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [selectedDiseases, setSelectedDiseases] = useState(['Regular']);
  const [selectedInjuries, setSelectedInjuries] = useState(['Regular']);
  const [diseaseDropdownOpen, setDiseaseDropdownOpen] = useState(false);
  const [injuryDropdownOpen, setInjuryDropdownOpen] = useState(false);

  const diseaseRef = useRef(null);
  const injuryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (diseaseRef.current && !diseaseRef.current.contains(event.target)) {
        setDiseaseDropdownOpen(false);
      }
      if (injuryRef.current && !injuryRef.current.contains(event.target)) {
        setInjuryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (item, selectedList, setList) => {
    if (item === "Regular") {
      setList(["Regular"]);
    } else {
      let newList = selectedList.filter(i => i !== "Regular");
      if (newList.includes(item)) {
        newList = newList.filter(i => i !== item);
      } else {
        newList.push(item);
      }
      if (newList.length === 0) newList = ["Regular"];
      setList(newList);
    }
  };

  // State for image cropping
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = React.useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(newCrop);
  }

  function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0, 
      0, 
      canvas.width, 
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }

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
          activityLevel: data.activityLevel || '',
          bio: data.bio || '',
          noOnion: data.noOnion === true || data.noOnion === 'true',
          noGarlic: data.noGarlic === true || data.noGarlic === 'true',
          glutenFree: data.glutenFree === true || data.glutenFree === 'true',
          lactoseFree: data.lactoseFree === true || data.lactoseFree === 'true',
          nutAllergy: data.nutAllergy === true || data.nutAllergy === 'true',
          sugarFree: data.sugarFree === true || data.sugarFree === 'true'
        });

        const medicalConditions = data.medicalConditions?.length > 0 ? data.medicalConditions : ['Regular'];
        const injuries = data.injuries?.length > 0 ? data.injuries : ['Regular'];
        
        setSelectedDiseases(medicalConditions);
        setSelectedInjuries(injuries);
        setProfileImage(data.profileImage || null);
      } catch (err) {
        console.error("Failed to load profile", err);
        setPageError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaveStatus('Saving...');
    setPageError('');
    
    try {
      const formDataToSend = new FormData();
      
      const height = parseInt(formData.height, 10);
      if (!isNaN(height)) formDataToSend.append('height', height);

      const weight = parseInt(formData.weight, 10);
      if (!isNaN(weight)) formDataToSend.append('weight', weight);

      const age = parseInt(formData.age, 10);
      if (!isNaN(age)) formDataToSend.append('age', age);

      if (formData.gender) formDataToSend.append('gender', formData.gender);
      if (formData.experience) formDataToSend.append('experience', formData.experience);
      if (formData.goal) formDataToSend.append('goal', formData.goal);
      if (formData.dietType) formDataToSend.append('dietType', formData.dietType);
      if (formData.activityLevel) formDataToSend.append('activityLevel', formData.activityLevel);
      formDataToSend.append('noOnion', formData.noOnion);
      formDataToSend.append('noGarlic', formData.noGarlic);
      formDataToSend.append('glutenFree', formData.glutenFree);
      formDataToSend.append('lactoseFree', formData.lactoseFree);
      formDataToSend.append('nutAllergy', formData.nutAllergy);
      formDataToSend.append('sugarFree', formData.sugarFree);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      
      selectedDiseases.forEach(item => formDataToSend.append('medicalConditions', item));
      selectedInjuries.forEach(item => formDataToSend.append('injuries', item));
      
      if (profileImageFile) {
        formDataToSend.append('profileImage', profileImageFile, `profile-${user.id || 'user'}.jpg`);
      }

      const updateResponse = await api.put('/users/profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = updateResponse.data.user;
      setProfileImage(updatedUser.profileImage || null);

      updateUser({
        experience: updatedUser.experience,
        goal: updatedUser.goal,
        activityLevel: updatedUser.activityLevel,
        age: updatedUser.age,
        weight: updatedUser.weight,
        height: updatedUser.height,
        gender: updatedUser.gender,
        bio: updatedUser.bio,
        medicalConditions: updatedUser.medicalConditions,
        injuries: updatedUser.injuries,
        dietType: updatedUser.dietType,
        noOnion: updatedUser.noOnion,
        noGarlic: updatedUser.noGarlic,
        glutenFree: updatedUser.glutenFree,
        lactoseFree: updatedUser.lactoseFree,
        nutAllergy: updatedUser.nutAllergy,
        sugarFree: updatedUser.sugarFree,
        profileImage: updatedUser.profileImage
      });

      login(updatedUser, { 
        accessToken: localStorage.getItem('accessToken'), 
        refreshToken: localStorage.getItem('refreshToken') 
      });

      setSaveStatus('✓ Profile updated successfully !');
      setIsEditMode(false);
      setProfileImageFile(null);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus('✕ Error saving profile: ' + (err.response?.data?.message || 'Please try again'));
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCrop(undefined); 
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setShowGalleryModal(true); 
      });
      reader.readAsDataURL(file);
      e.target.value = ''; 
    }
  };

  const handleCropSave = async () => {
    if (!completedCrop || !imgRef.current) {
      setUploadError('Could not crop image. Please try again.');
      return;
    }

    const croppedImageBlob = await getCroppedImg(
      imgRef.current,
      completedCrop,
      'profile.jpeg'
    );
    setProfileImageFile(croppedImageBlob);
    setProfileImage(URL.createObjectURL(croppedImageBlob));
    setShowGalleryModal(false);
  };

  const handleDeleteImage = async () => {
    if (window.confirm('Are you sure you want to delete your profile picture?')) {
      setSaveStatus('Deleting image...');
      try {
        await api.delete('/users/delete-profile-image');
        setProfileImage(null);
        setProfileImageFile(null);

        const updatedUser = { ...user, profileImage: '' };
        login(updatedUser, { 
          accessToken: localStorage.getItem('accessToken'), 
          refreshToken: localStorage.getItem('refreshToken') 
        });

        setSaveStatus('✓ Image deleted successfully!');
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (err) {
        console.error("Error deleting image:", err);
        setSaveStatus('✕ Error deleting image: ' + (err.response?.data?.message || 'Please try again'));
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=00c4b4&color=fff&size=200`;

  const inputStyles = `w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold ${
    isDarkMode 
      ? 'bg-[#0f172a] border border-[#334155] text-white focus:bg-[#1e293b]' 
      : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white'
  }`;

  return (
    <Layout>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          
          .font-jakarta { font-family: 'Libre Baskerville', serif; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-size: 20px; }
          .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          @keyframes modalSlideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .modal-content { animation: modalSlideIn 0.3s ease-out; }
          
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div className={`max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Libre Baskerville', serif" }}>

        {/* --- HEADER SECTION --- */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div className={`w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full border-4 sm:border-[5px] shadow-xl overflow-hidden flex-shrink-0 bg-teal-500 ${isDarkMode ? 'border-[#0f172a]' : 'border-white'}`}>
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = fallbackImage;
                    }}
                  />
                ) : (
                  <img 
                    src={fallbackImage} 
                    alt="Default Avatar" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                onChange={handleUploadImage}
                accept="image/*"
              />
              {isEditMode && (
                <button
                  onClick={() => document.getElementById('profile-image-upload').click()}
                  className={`absolute bottom-0 right-0 bg-teal-500 w-9 h-9 rounded-full border-4 flex items-center justify-center text-white shadow-md hover:scale-110 active:scale-100 transition-transform ${isDarkMode ? 'border-[#0f172a]' : 'border-white'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
              )}
              {isEditMode && profileImage && (
                <button
                  onClick={handleDeleteImage}
                  title="Delete profile picture"
                  className={`absolute top-0 right-0 bg-red-600 w-9 h-9 rounded-full border-4 flex items-center justify-center text-white shadow-md hover:scale-110 active:scale-100 transition-transform ${isDarkMode ? 'border-[#0f172a]' : 'border-white'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              )}
            </div>
            <div>
              <h2 className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {user?.name || "User"}
              </h2>
              <p className={`font-medium text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {user?.email || "Member"}
              </p>
              {formData.dietType && (
                <div className={`font-medium text-xs mt-2 flex flex-wrap items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <span><span className="text-teal-500 font-bold">Diet :</span> {formData.dietType.charAt(0).toUpperCase() + formData.dietType.slice(1)}</span>
                  {(() => {
                    const activeExclusions = [
                      { key: 'noOnion', label: 'No Onion' },
                      { key: 'noGarlic', label: 'No Garlic' },
                      { key: 'glutenFree', label: 'Gluten Free' },
                      { key: 'lactoseFree', label: 'Lactose Free' },
                      { key: 'nutAllergy', label: 'Nut Allergy' },
                      { key: 'sugarFree', label: 'Sugar Free' }
                    ].filter(ex => formData[ex.key]);
                    
                    return activeExclusions.map(ex => (
                      <span key={ex.key} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                        {ex.label}
                      </span>
                    ));
                  })()}
                </div>
              )}
              {formData.goal && (
                <p className={`font-medium text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <span className="text-teal-500 font-bold">Goal :</span> {formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)}
                </p>
              )}
              {selectedDiseases && selectedDiseases.length > 0 && (
                <p className={`font-medium text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <span className="text-orange-500 font-bold">Medical Status :</span> {selectedDiseases.join(", ")}
                </p>
              )}
              {selectedInjuries && selectedInjuries.length > 0 && (
                <p className={`font-medium text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <span className="text-red-500 font-bold">Injury Status :</span> {selectedInjuries.join(", ")}
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

        {/* --- PROMINENT STATUS MESSAGES --- */}
        {(pageError || saveStatus) && (
          <div className={`mb-8 px-6 py-4 rounded-xl font-bold text-sm border shadow-sm flex items-center gap-3 transition-all ${
            (saveStatus.includes('✓') || saveStatus.includes('successfully'))
              ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
              : (saveStatus.includes('✕') || pageError || saveStatus.toLowerCase().includes('error'))
                ? (isDarkMode ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700')
                : (isDarkMode ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700') // For "Saving..." state
          }`}>
            <span className="material-symbols-outlined text-[22px]">
              {(saveStatus.includes('✓') || saveStatus.includes('successfully')) 
                ? 'check_circle' 
                : (saveStatus.includes('Saving') || saveStatus.includes('Deleting')) ? 'hourglass_empty' : 'error'}
            </span>
            {pageError || saveStatus}
          </div>
        )}

        {/* Edit Mode Content */}
        {isEditMode && (
          <div className="grid grid-cols-1 gap-8">

            {/* Physical Metrics */}
            <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">straighten</span>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Physical Metrics</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Height (cm)</label>
                  <input
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    type="number"
                    className={inputStyles}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weight (kg)</label>
                  <input
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    type="number"
                    className={inputStyles}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Age</label>
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    type="number"
                    className={inputStyles}
                  />
                </div>
              </div>
            </section>

            {/* Fitness Profile */}
            <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">person</span>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fitness Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={inputStyles}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Experience Level</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={inputStyles}
                  >
                    <option value="" disabled>Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Daily Activity</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    className={inputStyles}
                  >
                    <option value="" disabled>Select Activity</option>
                    <option value="sedentary">Sedentary (Office Job)</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="active">Very Active</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Goals & Diet */}
            <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">target</span>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Goals & Diet</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fitness Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className={inputStyles}
                  >
                    <option value="" disabled>Select Goal</option>
                    <option value="muscle gain">Muscle Gain</option>
                    <option value="fat loss">Fat Loss</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Diet Type</label>
                  <select
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleInputChange}
                    className={inputStyles}
                  >
                    <option value="" disabled>Select Diet Type</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Dietary Exclusions</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                    {[
                      { name: 'noOnion', label: 'No Onion' },
                      { name: 'noGarlic', label: 'No Garlic' },
                      { name: 'glutenFree', label: 'Gluten Free' },
                      { name: 'lactoseFree', label: 'Lactose Free' },
                      { name: 'nutAllergy', label: 'Nut Allergy' },
                      { name: 'sugarFree', label: 'Sugar Free' }
                    ].map(exclusion => (
                      <label key={exclusion.name} className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={exclusion.name}
                          checked={formData[exclusion.name]}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isDarkMode ? 'bg-slate-600 peer-checked:bg-teal-500' : 'bg-slate-200 peer-checked:bg-teal-500'}`}></div>
                        <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{exclusion.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Medical & Injury Status */}
            <section className={`p-8 rounded-2xl shadow-sm border relative z-50 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">medical_services</span>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Medical & Injury Status</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Fixed Medical Dropdown */}
                <div ref={diseaseRef} className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Medical Conditions / Diseases</label>
                  <div className="relative">
                    <div 
                      className={`custom-select w-full px-4 py-3 border rounded-xl outline-none transition-all cursor-pointer flex justify-between items-center font-bold ${isDarkMode ? `border-[#334155] text-white ${diseaseDropdownOpen ? 'ring-2 ring-teal-500/20 border-teal-500' : ''}` : `border-slate-200 text-slate-900 hover:bg-slate-50 ${diseaseDropdownOpen ? 'bg-white ring-2 ring-teal-500/20 border-teal-500' : 'bg-slate-50'}`}`}
                      onClick={() => setDiseaseDropdownOpen(!diseaseDropdownOpen)}
                    >
                      <span className="truncate pr-4">
                        {selectedDiseases.join(", ")}
                      </span>
                      <span className={`material-symbols-outlined transition-transform ${diseaseDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    
                    {diseaseDropdownOpen && (
                      <div className={`custom-dropdown-menu absolute z-20 w-full mt-2 max-h-60 overflow-y-auto rounded-xl shadow-xl border ${isDarkMode ? 'border-[#334155]' : 'bg-white border-slate-200'}`}>
                        {diseasesList.map(disease => (
                          <label key={disease} className={`flex items-center px-4 py-3 cursor-pointer transition-colors font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-50'}`}>
                            <input 
                              type="checkbox" 
                              checked={selectedDiseases.includes(disease)}
                              onChange={() => toggleSelection(disease, selectedDiseases, setSelectedDiseases)}
                              className="mr-3 w-4 h-4 text-teal-500 rounded border-slate-400 focus:ring-0"
                            />
                            {disease}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fixed Injury Dropdown */}
                <div ref={injuryRef} className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Injury Statuses</label>
                  <div className="relative">
                    <div 
                      className={`custom-select w-full px-4 py-3 border rounded-xl outline-none transition-all cursor-pointer flex justify-between items-center font-bold ${isDarkMode ? `border-[#334155] text-white ${injuryDropdownOpen ? 'ring-2 ring-teal-500/20 border-teal-500' : ''}` : `border-slate-200 text-slate-900 hover:bg-slate-50 ${injuryDropdownOpen ? 'bg-white ring-2 ring-teal-500/20 border-teal-500' : 'bg-slate-50'}`}`}
                      onClick={() => setInjuryDropdownOpen(!injuryDropdownOpen)}
                    >
                      <span className="truncate pr-4">
                        {selectedInjuries.join(", ")}
                      </span>
                      <span className={`material-symbols-outlined transition-transform ${injuryDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    
                    {injuryDropdownOpen && (
                      <div className={`custom-dropdown-menu absolute z-20 w-full mt-2 max-h-60 overflow-y-auto rounded-xl shadow-xl border ${isDarkMode ? 'border-[#334155]' : 'bg-white border-slate-200'}`}>
                        {injuriesList.map(injury => (
                          <label key={injury} className={`flex items-center px-4 py-3 cursor-pointer transition-colors font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-50'}`}>
                            <input 
                              type="checkbox" 
                              checked={selectedInjuries.includes(injury)}
                              onChange={() => toggleSelection(injury, selectedInjuries, setSelectedInjuries)}
                              className="mr-3 w-4 h-4 text-teal-500 rounded border-slate-400 focus:ring-0"
                            />
                            {injury}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Bio / Motivation */}
            <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-teal-500">description</span>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bio / Motivation</h3>
              </div>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your fitness journey..."
                className={`w-full px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-medium leading-relaxed resize-none ${
                  isDarkMode 
                    ? 'bg-[#0f172a] border border-[#334155] text-white focus:bg-[#1e293b]' 
                    : 'bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white'
                }`}
                rows="4"
              ></textarea>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsEditMode(false)}
                className={`px-8 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                  isDarkMode ? 'text-slate-400 hover:bg-[#334155]' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'Saving...'}
                className="bg-[#df20af] text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-[#df20af]/20 hover:shadow-xl hover:shadow-[#df20af]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* View Mode Content */}
        {!isEditMode && (
          <div className="grid grid-cols-1 gap-8">

            {/* Physical Metrics */}
            {(formData.height || formData.weight || formData.age) && (
              <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">straighten</span>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Physical Metrics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.height && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Height</p>
                      <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.height} cm</p>
                    </div>
                  )}
                  {formData.weight && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weight</p>
                      <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.weight} kg</p>
                    </div>
                  )}
                  {formData.age && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Age</p>
                      <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.age} yrs</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Fitness Profile */}
            {(formData.gender || formData.experience) && (
              <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">person</span>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fitness Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.gender && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gender</p>
                      <p className={`text-lg font-bold mt-2 capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.gender}</p>
                    </div>
                  )}
                  {formData.experience && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Experience</p>
                      <p className={`text-lg font-bold mt-2 capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.experience}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Goals & Diet */}
            {(formData.goal || formData.dietType) && (
              <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">target</span>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Goals & Diet</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.goal && (
                    <div className="bg-gradient-to-br from-[#df20af]/5 to-[#df20af]/10 p-4 rounded-xl border border-[#df20af]/20">
                      <p className="text-xs font-bold text-teal-500 uppercase">Fitness Goal</p>
                      <p className={`text-lg font-bold mt-2 capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.goal}</p>
                    </div>
                  )}
                  {formData.dietType && (
                    <div className="bg-gradient-to-br from-[#10b981]/5 to-[#10b981]/10 p-4 rounded-xl border border-[#10b981]/20">
                      <p className="text-xs font-bold text-[#10b981] uppercase">Diet Type</p>
                      <p className={`text-lg font-bold mt-2 capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.dietType}</p>
                      {(() => {
                        const activeExclusions = [
                          { key: 'noOnion', label: 'No Onion' },
                          { key: 'noGarlic', label: 'No Garlic' },
                          { key: 'glutenFree', label: 'Gluten Free' },
                          { key: 'lactoseFree', label: 'Lactose Free' },
                          { key: 'nutAllergy', label: 'Nut Allergy' },
                          { key: 'sugarFree', label: 'Sugar Free' }
                        ].filter(ex => formData[ex.key]);
                        
                        return activeExclusions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {activeExclusions.map(ex => (
                              <span key={ex.key} className={`px-2 py-1 text-[10px] font-bold rounded-md ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>{ex.label}</span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Medical & Injury Status View */}
            {(selectedDiseases.length > 0 || selectedInjuries.length > 0) && (
              <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">medical_services</span>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Medical & Injury Status</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDiseases.length > 0 && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Medical Status</p>
                      <p className={`text-lg font-bold mt-2 capitalize leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedDiseases.join(', ')}</p>
                    </div>
                  )}
                  {selectedInjuries.length > 0 && (
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
                      <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Injury Status</p>
                      <p className={`text-lg font-bold mt-2 capitalize leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedInjuries.join(', ')}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Bio / Motivation */}
            {formData.bio && (
              <section className={`p-8 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-teal-500">description</span>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bio / Motivation</h3>
                </div>
                <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{formData.bio}</p>
              </section>
            )}

            {!formData.height && !formData.weight && !formData.bio && !formData.goal && (
              <div className="text-center py-20">
                <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>No profile information yet</p>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-[#df20af] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[#df20af]/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`modal-content rounded-3xl shadow-2xl max-w-md w-full overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white'}`}>
            <div className={`border-b p-6 flex items-center justify-between ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Crop Your Photo</h2>
              <button
                onClick={() => setShowGalleryModal(false)}
                className={`hover:opacity-70 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className={`p-8 flex justify-center items-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
              {imgSrc ? (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    style={{ maxHeight: '60vh' }}
                  />
                </ReactCrop>
              ) : (
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Loading image...</p>
              )}
            </div>
            <div className={`p-6 flex justify-end gap-4 ${isDarkMode ? 'bg-[#1e293b]' : 'bg-slate-50'}`}>
              <button
                onClick={() => setShowGalleryModal(false)}
                className={`px-6 py-2 rounded-xl font-bold transition-all active:scale-95 ${isDarkMode ? 'text-slate-400 hover:bg-[#334155]' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="bg-teal-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Save Photo
              </button>
              {uploadError && (
                <p className="text-red-600 text-sm mt-4 absolute">{uploadError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;