import { Apple, Dumbbell, LayoutDashboard, LineChartIcon, LogOut, MessageSquare, Settings, BookOpen, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import logoImg from "../../assets/logo.png";

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
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Goblin+One&display=swap');
        `}
      </style>

      {/* Logo */}
      <div className="p-4 sm:p-6 flex items-center gap-3 flex-shrink-0">
        <img src={logoImg} alt="BeFit Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0" />
        <span className="text-3xl font-bold tracking-wide truncate transition-all !bg-transparent" style={{ fontFamily: "'Goblin One', cursive" }}>
          <span className={`!bg-transparent ${isDarkMode ? 'text-white' : 'text-[#142E5C] [-webkit-text-stroke:0.5px_black]'}`}>Be</span>
          <span className={`!bg-transparent ${isDarkMode ? 'text-[#00b0a7]' : 'text-[#009c8f] [-webkit-text-stroke:0.5px_black]'}`}>Fit</span>
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