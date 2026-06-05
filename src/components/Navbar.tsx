import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, user, logout } = useAuthStore();
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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-20 transition-all duration-500 ${
        isScrolled ? 'bg-green-deep/95 backdrop-blur-md py-4 shadow-sm border-b border-white/5' : 'bg-transparent py-6'
      }`}
    >
      <Link to="/" className="font-serif text-[26px] font-semibold text-cream tracking-[0.06em] no-underline">
        Karibu 🇹🇿
      </Link>

      <div className="flex items-center gap-10">
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

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-cream/20 text-cream text-[12px] uppercase tracking-wider font-medium hover:bg-cream/10 transition-all duration-300"
            >
              <div className="w-5 h-5 rounded-full bg-gold text-green-deep flex items-center justify-center font-bold text-[10px]">
                {user?.name.charAt(0)}
              </div>
              <span>Account</span>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden py-2 flex flex-col"
                >
                  <div className="px-5 py-3 border-b border-black/5 mb-2">
                    <p className="text-[14px] font-medium text-green-deep truncate">{user?.name}</p>
                    <p className="text-[11px] text-text-mid uppercase tracking-wider">{user?.role}</p>
                  </div>
                  <Link onClick={() => setIsDropdownOpen(false)} to={user?.role === 'Admin' ? '/admin' : '/dashboard'} className="px-5 py-2.5 text-[13px] text-text hover:bg-black/5 transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-5 py-2.5 text-[13px] text-[#C4522A] text-left hover:bg-[#C4522A]/5 transition-colors">
                    Sign Out
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
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
}