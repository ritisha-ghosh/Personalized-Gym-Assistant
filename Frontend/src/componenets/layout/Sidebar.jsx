import { Apple, Dumbbell, LayoutDashboard, LineChartIcon, LogOut, MessageSquare, Settings } from "lucide-react";
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
      <div className="p-4 flex items-center gap-3">
        {/* Logo Image */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
          <img
            src="https://marketplace.canva.com/EAFxdcos7WU/1/0/1600w/canva-dark-blue-and-brown-illustrative-fitness-gym-logo-oqe3ybeEcQQ.jpg"
            alt="VirtuGym Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Name */}
        <span className="text-xl font-bold tracking-tight text-slate-900">
          VIRTUGYM
        </span>
      </div>


      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link to="/" className={navItemClass("/")}>
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

        <Link to="/settings" className={navItemClass("/settings")}>
          <Settings size={18} className=" mt-1" />
          Settings
        </Link>

        <Link to="/chat" className={navItemClass("/chat")}>
          <MessageSquare size={18} className=" mt-1" />
          Chat Bot
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
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
            <LogOut />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
