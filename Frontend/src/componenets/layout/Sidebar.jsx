import { Apple, Dumbbell, LayoutDashboard, LineChartIcon, LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItemClass = (path) =>
    `
      block px-4 py-3 rounded-xl cursor-pointer flex gap-3 item-center
      font-medium transition-all
      ${location.pathname === path
      ? "bg-white text-pink-500 font-bold shadow-sm"
      : "text-slate-900 hover:bg-white/60"
    }
    `;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-blue-100 border-r border-slate-200 flex flex-col">

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#df20af] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#df20af]/20">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-[#0f172a]">
          PulseAI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link to="/dashboard" className={navItemClass("/dashboard")}>
          <LayoutDashboard size={18} className=" mt-1" />
          Dashboard
        </Link>

        <Link to="/workouts" className={navItemClass("/workouts")}>
          <Dumbbell size={18} className=" mt-1" />
          Workouts
        </Link>

        <Link to="/nutrition" className={navItemClass("/nutrition")}>
          <Apple size={18} className=" mt-1" />
          Nutrition
        </Link>

        <Link to="/progress" className={navItemClass("/progress")}>
          <LineChartIcon size={18} className=" mt-1" />
          Progress
        </Link>

        {/* Added Profile Link */}
        <Link to="/profile" className={navItemClass("/profile")}>
          <User size={18} className=" mt-1" />
          Profile
        </Link>

        <Link to="/settings" className={navItemClass("/settings")}>
          <Settings size={18} className=" mt-1" />
          Settings
        </Link>

        <Link to="/chat" className={navItemClass("/chat")}>
          <MessageSquare size={18} className=" mt-1" />
          Chat Bot
        </Link>
      </nav>

      {/* Logout - Linked to Landing Page */}
      <div className="p-4 border-t border-slate-200">
        <Link
          to="/"
          className="
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-xl
            bg-red-50 text-red-600
            font-bold
            hover:bg-red-100
            transition-colors
          "
        >
          <span className="material-symbols-outlined text-lg">
            <LogOut size={20} />
          </span>
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;