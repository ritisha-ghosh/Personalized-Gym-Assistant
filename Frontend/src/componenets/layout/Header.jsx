import { Bell, Info, Search, X } from "lucide-react";
import React, { useState, useEffect } from "react"; 
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 gap-4">
      {/* --- Search Bar - Hidden on mobile, shown on md+ --- */}
      <div className="relative hidden md:block w-full max-w-md">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#df20af] transition-colors">
          <Search size={18} />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={`Search in ${getPageName()}...`}
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#df20af]/20 focus:border-[#df20af] transition-all shadow-sm"
        />

        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* --- Right Side Actions --- */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <button onClick={() => setShowSearch(!showSearch)} className="md:hidden p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all">
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </button>

        <button className="relative p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-[#eef7f6] border border-transparent hover:border-[#df20af]/20 transition-all group flex-shrink-0">
          <span className="text-slate-600 group-hover:text-[#df20af]">
            <Bell size={18} />
          </span>
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2.5 w-2.5 h-2.5 bg-[#df20af] border-2 border-white rounded-full" />
        </button>

        <button className="p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-[#eef7f6] border border-transparent hover:border-[#df20af]/20 transition-all group flex-shrink-0 hidden sm:block">
          <span className="text-slate-600 group-hover:text-[#df20af]">
            <Info size={18} />
          </span>
        </button>
      </div>

      {/* Mobile Search Input */}
      {showSearch && (
        <div className="absolute top-16 left-4 right-4 md:hidden">
          <div className="relative w-full shadow-lg rounded-xl">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
             </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search..."
              autoFocus
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#df20af]/20"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
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