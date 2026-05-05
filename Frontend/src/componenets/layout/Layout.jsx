import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu, X } from "lucide-react";
import { DarkModeContext } from "../../context/DarkModeContext";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen text-slate-900 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg shadow-md transition ${isDarkMode ? 'bg-[#1e293b] hover:bg-[#334155]' : 'bg-white hover:bg-slate-100'}`}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Fixed Sidebar - Hidden on mobile, shown on lg+ */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper - Responsive margin */}
      <div className="lg:ml-64 flex min-h-screen flex-col relative">
        
        {/* Header */}
        <Header />

        {/* Page Content - Responsive padding */}
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:py-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;