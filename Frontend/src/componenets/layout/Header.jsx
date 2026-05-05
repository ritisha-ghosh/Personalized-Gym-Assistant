import { Bell, Info, Search, X, Moon, Sun } from "lucide-react";
import React, { useState, useEffect, useContext } from "react"; 
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  // --- Live Search Logic (Debounced) ---
  useEffect(() => {
    // Create a timeout to wait 300ms after the user stops typing
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        setSearchParams({ q: searchQuery });
      } else {
        // If input is empty, clear the query param, but only if one exists
        // (prevents clearing URL on initial load if query is empty)
        if (searchParams.get('q')) {
          setSearchParams({});
        }
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setSearchParams, searchParams]);

  // Handle Input Change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({}); 
  };

  // Helper to format current page name for placeholder
  const getPageName = () => {
    const path = location.pathname.replace('/', '');
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Home';
  };

  return (
    <header className={`flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 backdrop-blur-md border-b sticky top-0 z-30 gap-4 ${isDarkMode ? 'bg-[#0f172a]/80 border-[#334155]' : 'bg-white/80 border-slate-200'}`}>
      {/* --- Search Bar - Hidden on mobile, shown on md+ --- */}
      <div className="relative hidden md:block w-full max-w-md">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-[#94a3b8] hover:text-[#00c4b4]' : 'text-slate-400 hover:text-teal-500'}`}>
          <Search size={18} />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={`Search in ${getPageName()}...`}
          className={`w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl text-sm border transition-all shadow-sm focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-[#f1f5f9] placeholder:text-[#94a3b8] focus:ring-[#00c4b4]/20 focus:border-[#00c4b4]' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:ring-teal-500/20 focus:border-teal-500'}`}
        />

        {searchQuery && (
          <button
            onClick={clearSearch}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-all ${isDarkMode ? 'text-[#94a3b8] hover:text-[#cbd5e1]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* --- Right Side Actions --- */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <button onClick={() => setShowSearch(!showSearch)} className={`md:hidden p-2 rounded-lg transition-all ${isDarkMode ? 'bg-[#1e293b] hover:bg-[#334155]' : 'bg-slate-50 hover:bg-slate-100'}`}>
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </button>

        <button 
          onClick={toggleDarkMode}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all group flex-shrink-0 ${isDarkMode ? 'bg-[#1e293b] hover:bg-[#00c4b4]/10 border-transparent hover:border-[#00c4b4]/20' : 'bg-slate-50 hover:bg-teal-50 border-transparent hover:border-teal-500/20'}`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className={`${isDarkMode ? 'text-[#00c4b4] group-hover:text-[#00f5ff]' : 'text-slate-600 group-hover:text-teal-500'}`}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>

        <button className={`relative p-2 sm:p-2.5 rounded-xl border transition-all group flex-shrink-0 ${isDarkMode ? 'bg-[#1e293b] hover:bg-[#334155] border-transparent hover:border-[#00c4b4]/20' : 'bg-slate-50 hover:bg-teal-50 border-transparent hover:border-teal-500/20'}`}>
          <span className={isDarkMode ? 'text-[#cbd5e1] group-hover:text-[#00c4b4]' : 'text-slate-600 group-hover:text-teal-500'}>
            <Bell size={18} />
          </span>
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2.5 w-2.5 h-2.5 bg-teal-500 border-2 border-white rounded-full" />
        </button>

        <button className={`p-2 sm:p-2.5 rounded-xl border transition-all group flex-shrink-0 hidden sm:block ${isDarkMode ? 'bg-[#1e293b] hover:bg-[#334155] border-transparent hover:border-[#00c4b4]/20' : 'bg-slate-50 hover:bg-teal-50 border-transparent hover:border-teal-500/20'}`}>
          <span className={isDarkMode ? 'text-[#cbd5e1] group-hover:text-[#00c4b4]' : 'text-slate-600 group-hover:text-teal-500'}>
            <Info size={18} />
          </span>
        </button>
      </div>

      {/* Mobile Search Input */}
      {showSearch && (
        <div className="absolute top-16 left-4 right-4 md:hidden">
          <div className="relative w-full shadow-lg rounded-xl">
             <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#94a3b8]' : 'text-slate-400'}`}>
                <Search size={18} />
             </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search..."
              autoFocus
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-[#f1f5f9] placeholder:text-[#94a3b8] focus:ring-[#00c4b4]/20' : 'bg-white border-slate-200 placeholder:text-slate-400 focus:ring-teal-500/20'}`}
            />
            {searchQuery && (
              <button onClick={clearSearch} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${isDarkMode ? 'text-[#94a3b8] hover:text-[#cbd5e1]' : 'text-slate-400 hover:text-slate-600'}`}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;