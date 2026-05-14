import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../componenets/layout/Layout'; 
import { Play, Clock, BarChart2, Filter } from 'lucide-react';
import { DarkModeContext } from '../context/DarkModeContext';

const Tutorial = () => {
  const [activeTab, setActiveTab] = useState('All Tutorials');
  const { isDarkMode } = useContext(DarkModeContext);
  
  // 1. Get search query from URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // --- Categories Configuration ---
  const categories = [
    "All Tutorials", 
    "Chest", 
    "Legs", 
    "Cardio", 
    "Yoga", 
    "Back", 
    "Arms"
  ];

  // --- Mock Data for Tutorials ---
  const tutorials = [
    {
      id: 1,
      title: "Perfect Form: Bench Press",
      category: "Chest",
      level: "Advanced",
      duration: "12 min",
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true
    },
    {
      id: 2,
      title: "Squat Depth Essentials",
      category: "Legs",
      level: "Beginner",
      duration: "8 min",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false
    },
    {
      id: 3,
      title: "Post-Workout Yoga Flow",
      category: "Yoga",
      level: "Intermediate",
      duration: "25 min",
      thumbnail: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
      isAiTip: true
    },
    {
      id: 4,
      title: "Deadlift Technique",
      category: "Back",
      level: "Advanced",
      duration: "15 min",
      thumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false
    },
    {
      id: 5,
      title: "High-Intensity Rowing",
      category: "Cardio",
      level: "Intermediate",
      duration: "10 min",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      isAiTip: false
    },
    {
      id: 6,
      title: "Stretching for Desk Workers",
      category: "Yoga",
      level: "Beginner",
      duration: "5 min",
      thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop",
      isAiTip: true
    },
    {
      id: 7,
      title: "Bicep Curl Variations",
      category: "Arms",
      level: "Beginner",
      duration: "8 min",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
      isAiTip: false
    },
  ];

  // --- 2. Smart Auto-Switch Logic ---
  // If search matches a Category OR a Video in a specific category, switch tabs automatically.
  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      // A. Check if query matches a Category Name directly (e.g. "Yoga")
      const matchedCategory = categories.find(cat => 
        cat.toLowerCase().includes(lowerQuery) || lowerQuery.includes(cat.toLowerCase())
      );

      if (matchedCategory && matchedCategory !== 'All Tutorials') {
        if (activeTab !== matchedCategory) setActiveTab(matchedCategory);
        return; 
      }

      // B. Check if query matches a Video Title (e.g. "Bench") -> Switch to "Chest"
      const matchedVideo = tutorials.find(t => 
        t.title.toLowerCase().includes(lowerQuery)
      );

      if (matchedVideo) {
        if (activeTab !== matchedVideo.category) setActiveTab(matchedVideo.category);
      }
    }
  }, [searchQuery, activeTab]); // Dependencies ensure this runs when search changes

  // --- 3. Filter Logic ---
  const filteredTutorials = tutorials.filter(t => {
    // 1. Category Check: Must match active tab (unless 'All Tutorials')
    const matchesCategory = activeTab === 'All Tutorials' || t.category === activeTab;
    
    // 2. Search Check: Search in Title OR Category
    // This allows "Yoga" search to show videos even if title doesn't say "Yoga" (but category does)
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Inject Fonts locally */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Libre Baskerville', serif; }
        `}
      </style>

      <div className="text-slate-900 max-w-7xl mx-auto space-y-8 pb-10" style={{ fontFamily: "'Libre Baskerville', serif" }}>
        
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Master Your Form</h1>
          <p className="text-slate-500 font-medium">High-quality guides designed to help you reach your peak potential.</p>
          
          {/* Smart Search Feedback */}
          {searchQuery && (
             <p className="text-sm font-bold text-[#df20af] mt-2 animate-pulse transition-all">
               Searching for "{searchQuery}"... <span className="text-slate-400 font-normal">Found in {activeTab}</span>
             </p>
          )}
        </div>

        {/* --- Filter Tabs (Scrollable) --- */}
        <div className="flex gap-3 overflow-x-auto py-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
                activeTab === cat
                  ? 'bg-[#df20af] text-white shadow-lg shadow-[#df20af]/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Video Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((video) => (
            <div 
              key={video.id} 
              className="group bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay & Play Button */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                    <Play className="fill-white text-white" size={24} />
                  </div>
                </div>

                

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="px-2 pb-2 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-[#df20af] transition-colors line-clamp-2">
                  {video.title}
                </h3>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Clock size={14} className="text-[#df20af]" />
                    {video.duration}
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <BarChart2 size={14} className={`
                      ${video.level === 'Beginner' ? 'text-teal-400' : ''}
                      ${video.level === 'Intermediate' ? 'text-orange-400' : ''}
                      ${video.level === 'Advanced' ? 'text-red-400' : ''}
                    `} />
                    {video.level}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Empty State --- */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tutorials found</h3>
            <p className="text-slate-500 mt-2">
              {searchQuery 
                ? `No results for "${searchQuery}" in ${activeTab}`
                : "Try selecting a different category."}
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Tutorial;