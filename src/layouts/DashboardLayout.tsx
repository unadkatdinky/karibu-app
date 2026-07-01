// DashboardLayout: the chrome that wraps every protected page.
// It contains ONLY structural concerns — sidebar, topbar, scroll container.
// All role-specific content lives in the pages themselves.

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#faf8f4] overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />

        {/* Page scroll container — each page controls its own max-width and padding */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}