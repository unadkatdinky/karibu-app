// src/layouts/DashboardLayout.tsx
import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dynamically set navigation links based on user role
  let navLinks: { name: string; path: string }[] = [];

  if (user?.role === 'Admin') {
    navLinks = [
      { name: 'System Overview', path: '/admin' },
      { name: 'User Management', path: '/admin/users' },
      { name: 'Content Approvals', path: '/admin/content' },
    ];
  } else if (user?.role === 'Volunteer') {
    navLinks = [
      { name: 'Volunteer Portal', path: '/volunteer' },
      { name: 'Available Tasks', path: '/volunteer/tasks' },
      { name: 'Community Guidelines', path: '/volunteer/guidelines' },
    ];
  } else {
    // Default to Traveler
    navLinks = [
      { name: 'My Journey', path: '/traveler' },
      { name: 'Saved Places', path: '/traveler/saved' },
      { name: 'Travel Notes', path: '/traveler/notes' },
    ];
  }

  return (
    <div className="flex h-screen bg-[#faf8f4] overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="h-full bg-green-deep text-cream flex flex-col border-r border-black/10 shrink-0 transition-all duration-300 z-20"
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 text-gold hover:text-cream transition-colors overflow-hidden whitespace-nowrap">
            {/* Placeholder for your custom logo */}
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center shrink-0 font-serif font-bold text-[14px]">
              K
            </div>
            {isSidebarOpen && <span className="font-serif text-[20px] font-medium tracking-wide">Karibu <span className="font-sans text-[14px]">🇹🇿</span></span>}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'bg-gold/20 text-gold font-medium' 
                    : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                }`}
                title={!isSidebarOpen ? link.name : undefined}
              >
                {/* Generic icon placeholder - you can swap these for real SVG icons later */}
                <div className="w-5 h-5 rounded border border-current opacity-50 mr-3 shrink-0 flex items-center justify-center text-[10px]" />
                {isSidebarOpen && <span className="text-[13px] tracking-wide">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-[#C4522A] hover:bg-[#C4522A]/10 rounded-xl transition-colors whitespace-nowrap"
            title={!isSidebarOpen ? "Sign Out" : undefined}
          >
            <div className="w-5 h-5 rounded border border-current opacity-50 mr-3 shrink-0" />
            {isSidebarOpen && <span className="text-[13px] font-medium tracking-wide">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-20 bg-[#faf8f4]/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-8 shrink-0 z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-text-mid hover:text-green-deep transition-colors p-2 -ml-2 rounded-lg hover:bg-black/5"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-medium text-green-deep">{user?.name}</p>
              <p className="text-[11px] uppercase tracking-wider text-text-mid">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C4522A] text-white flex items-center justify-center font-serif text-[18px] shadow-sm">
              {user?.name.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Injection */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}