import { Bell, Info, Search } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header
      className="
        flex items-center justify-between
        px-8 py-4
        bg-white/80 backdrop-blur-md
        border-b border-slate-200
        sticky top-0 z-30
      "
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 hover:text-slate-900 cursor-pointer">
          Home
        </span>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-900">
          Dashboard
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search analytics..."
            className="
              w-64 pl-10 pr-4 py-2
              rounded-xl
              bg-slate-50
              border border-slate-200
              text-sm
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-2 focus:ring-teal-200
              focus:border-teal-400
            "
          />
        </div>

        {/* Notifications */}
        <button
          className="
            relative p-2
            rounded-xl
            bg-slate-50
            hover:bg-teal-50
            transition-colors
          "
        >
          <span className="material-symbols-outlined text-xl text-slate-900">
            <Bell />
          </span>
          <span
            className="
              absolute -top-1 -right-1
              w-3 h-3
              bg-pink-500
              border-2 border-white
              rounded-full
            "
          />
        </button>

        {/* Help */}
        <button
          className="
            p-2 rounded-xl
            bg-slate-50
            hover:bg-teal-50
            transition-colors
          "
        >
          <span className="material-symbols-outlined text-xl text-slate-900">
            <Info />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
