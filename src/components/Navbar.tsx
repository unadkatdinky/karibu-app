import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Derive a clean display name (first name only) and initials
  const firstName = user?.fullName?.split(' ')[0] ?? '';
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  // Normalise role label for display (DB stores "LocalGuide", display as "Local Guide")
  const roleLabel =
    user?.role === 'LocalGuide' ? 'Local Guide' : (user?.role ?? '');

  // Resolve dashboard path by role
  const dashboardPath =
    user?.role === 'Admin' ? '/admin' : '/dashboard';

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-20 transition-all duration-500 ${
        isScrolled
          ? 'bg-green-deep/95 backdrop-blur-md py-4 shadow-sm border-b border-white/5'
          : 'bg-transparent py-6'
      }`}
    >
      {/* Brand */}
     <Link to="/" className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity duration-300">
        <img 
          src="/karibu-darkbg-png.png" 
          alt="Karibu Logo" 
          className="h-12 md:h-13 w-auto object-contain" 
        />
        {/* Keep the elegant text next to it!
        <span className="font-serif text-[22px] font-semibold text-cream tracking-[0.06em]">
          Karibu
        </span> */}
      </Link>

      <div className="flex items-center gap-10">
        {/* Public nav links */}
        <div className="hidden md:flex gap-8">
          {['Destinations', 'Phrases', 'Culture'].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="text-[12px] tracking-[0.1em] uppercase text-cream/70 no-underline relative group transition-colors hover:text-cream"
            >
              {item}
              <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gold scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        {/* Auth area — don't render anything while hydrating to avoid flash */}
        {isCheckingAuth ? null : isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            {/* Account trigger pill */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-cream/20 text-cream hover:bg-cream/10 transition-all duration-300"
            >
              {/* Avatar circle with initials */}
              <div className="w-7 h-7 rounded-full bg-gold text-green-deep flex items-center justify-center font-bold text-[11px] shrink-0">
                {initials}
              </div>

              {/* Name + role stacked */}
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[13px] font-medium">{firstName}</span>
                <span className="text-[10px] text-cream/50 uppercase tracking-wider">
                  {roleLabel}
                </span>
              </div>

              <svg
                className={`w-3.5 h-3.5 text-cream/40 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden py-2 flex flex-col"
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-black/5 mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold text-green-deep flex items-center justify-center font-bold text-[12px] shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-green-deep truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                          {roleLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email (subtle) */}
                  <div className="px-4 py-1.5">
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <div className="border-t border-black/5 mt-1 mb-1" />

                  {/* Dashboard link */}
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-black/5 transition-colors no-underline"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>

                  {/* Profile settings */}
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-black/5 transition-colors no-underline"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile & settings
                  </Link>

                  <div className="border-t border-black/5 mt-1" />

                  {/* Sign out */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#C4522A] text-left hover:bg-[#C4522A]/5 transition-colors w-full"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#C4522A] text-cream px-6 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-medium hover:bg-[#A34220] shadow-[0_4px_14px_rgba(196,82,42,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Sign in
          </Link>
        )}
      </div>
    </motion.nav>
  );
}