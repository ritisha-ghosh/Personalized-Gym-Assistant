import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper - Pushed right by sidebar width (ml-64) */}
      <div className="ml-64 flex min-h-screen flex-col relative">
        
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;