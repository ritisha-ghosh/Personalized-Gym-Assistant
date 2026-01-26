import { Bell, Info, Search, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const navigate = useNavigate(); // Uncomment if you want to redirect on search

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      alert(`Searching for: ${searchQuery}`); // Visual feedback for now
      // Example navigation: navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header
      className="
        flex items-center justify-end
        px-8 py-4
        bg-white/80 backdrop-blur-md
        border-b border-slate-200
        sticky top-0 z-30
      "
    >
      {/* Actions Container */}
      <div className="flex items-center gap-6 w-full justify-end">
        
        {/* --- Proper Search Bar --- */}
        <div className="relative hidden md:block w-full max-w-md mr-auto">
          {/* Search Icon (Clickable) */}
          <button 
            onClick={handleSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#df20af] transition-colors"
          >
            <Search size={18} />
          </button>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for workouts, nutrition, anything..."
            className="
              w-full pl-10 pr-10 py-2.5
              rounded-xl
              bg-slate-50
              border border-slate-200
              text-sm font-medium text-slate-700
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-2 focus:ring-[#df20af]/20
              focus:border-[#df20af]
              transition-all
              shadow-sm
            "
          />

          {/* Clear 'X' Button (Visible only when typing) */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* --- Right Side Actions --- */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="
              relative p-2.5
              rounded-xl
              bg-slate-50
              hover:bg-[#eef7f6] hover:text-[#df20af]
              border border-transparent hover:border-[#df20af]/20
              transition-all
              group
            "
          >
            <span className="text-slate-600 group-hover:text-[#df20af]">
              <Bell size={20} />
            </span>
            <span
              className="
                absolute top-2 right-2.5
                w-2.5 h-2.5
                bg-[#df20af]
                border-2 border-white
                rounded-full
              "
            />
          </button>

          {/* Help / Info */}
          <button
            className="
              p-2.5 rounded-xl
              bg-slate-50
              hover:bg-[#eef7f6] hover:text-[#df20af]
              border border-transparent hover:border-[#df20af]/20
              transition-all
              group
            "
          >
            <span className="text-slate-600 group-hover:text-[#df20af]">
              <Info size={20} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;