import { Apple, Dumbbell, LayoutDashboard, LineChartIcon, LogOut, MessageSquare, Settings, BookOpen, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { isDarkMode } = useContext(DarkModeContext);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const navItemClass = (path) =>
    `
      block px-4 py-3 rounded-xl cursor-pointer flex gap-3 items-center
      font-medium transition-all text-sm sm:text-base
      ${location.pathname === path
      ? "bg-white text-teal-500 font-bold shadow-sm"
      : "text-slate-900 hover:bg-white/60"
    }
    `;

  return (
    <aside className="h-screen w-64 bg-blue-100 border-r border-slate-200 flex flex-col overflow-hidden">

      {/* Logo */}
      <div className="p-4 sm:p-6 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 flex-shrink-0">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className={`text-lg sm:text-xl font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
          PulseAI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
        
        <Link to="/dashboard" onClick={handleLinkClick} className={navItemClass("/dashboard")}>
          <LayoutDashboard size={18} className="flex-shrink-0" />
          <span>Dashboard</span>
        </Link>

        {/* Updated Link to /tutorial */}
        <Link to="/tutorial" onClick={handleLinkClick} className={navItemClass("/tutorial")}>
          <BookOpen size={18} className="flex-shrink-0" />
          <span>Tutorial</span>
        </Link>

        <Link to="/workouts" onClick={handleLinkClick} className={navItemClass("/workouts")}>
          <Dumbbell size={18} className="flex-shrink-0" />
          <span>Workouts</span>
        </Link>

        <Link to="/nutrition" onClick={handleLinkClick} className={navItemClass("/nutrition")}>
          <Apple size={18} className="flex-shrink-0" />
          <span>Nutrition</span>
        </Link>

        <Link to="/progress" onClick={handleLinkClick} className={navItemClass("/progress")}>
          <LineChartIcon size={18} className="flex-shrink-0" />
          <span>Progress</span>
        </Link>

        <Link to="/profile" onClick={handleLinkClick} className={navItemClass("/profile")}>
          <User size={18} className="flex-shrink-0" />
          <span>Profile</span>
        </Link>

        <Link to="/settings" onClick={handleLinkClick} className={navItemClass("/settings")}>
          <Settings size={18} className="flex-shrink-0" />
          <span>Settings</span>
        </Link>

        <Link to="/chat" onClick={handleLinkClick} className={navItemClass("/chat")}>
          <MessageSquare size={18} className="flex-shrink-0" />
          <span>Chat Bot</span>
        </Link>
      </nav>

      {/* Logout - Linked to Landing Page */}
      <div className="p-3 sm:p-4 border-t border-slate-200 flex-shrink-0">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="
            w-full flex items-center justify-center gap-2
            px-3 sm:px-4 py-2 sm:py-3 rounded-xl
            bg-red-50 text-red-600
            font-bold text-sm sm:text-base
            hover:bg-red-100
            transition-colors
          "
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;