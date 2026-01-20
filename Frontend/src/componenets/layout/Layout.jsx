import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen  bg-yellow-50 text-charcoal">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex min-h-screen flex-col">
        
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
