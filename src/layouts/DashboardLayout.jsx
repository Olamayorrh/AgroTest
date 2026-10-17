import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardSwitcher from '../components/layout/DashboardSwitcher';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Sidebar navigation"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <div className="relative z-10">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-100 shadow-xs">
          <div className="flex items-center min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 mr-2 flex-shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-bold text-primary-700 text-sm hidden sm:inline">AgroShare</span>
            </div>
          </div>

          {/* Compact Switcher for Mobile */}
          <div className="flex items-center flex-shrink-0">
            <DashboardSwitcher compact />
          </div>
        </div>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
