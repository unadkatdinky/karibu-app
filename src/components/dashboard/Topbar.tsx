import { useLocation } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../../store/useAuthStore';
import { ROLE_CONFIG } from './roleConfig';
import { IconMenu, IconBell, IconSearch } from './icons';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  const role = (user?.role ?? 'Traveler') as UserRole;
  const config = ROLE_CONFIG[role];
  const { accent, navLinks, displayName } = config;

  // Derive the current page name from the active nav link — no hardcoding needed
  const activePage = navLinks.find(l => location.pathname === l.path)
    ?? navLinks.find(l => location.pathname.startsWith(l.path));

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? 'K';

  return (
    <header className="h-16 bg-[#faf8f4] border-b border-black/5 flex items-center justify-between px-5 shrink-0">
      {/* Hamburger (mobile only — desktop uses sidebar chevron) */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-[#1C3A2E]/40 hover:text-[#1C3A2E] p-2 -ml-2 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <IconMenu />
      </button>

      {/* Page breadcrumb */}
      <p className="hidden md:block text-[12px] font-semibold text-[#1C3A2E]/30 uppercase tracking-widest">
        {activePage?.name ?? displayName}
      </p>

      {/* Right side: notification bell + avatar */}
     
       {/* Right side: search + notification bell + avatar */}
<div className="ml-auto flex items-center gap-3">
  <div className="hidden md:flex items-center gap-2 bg-[#faf8f4] border border-[#1C3A2E]/[0.08] rounded-[10px] px-3.5 py-2 w-60">
    <span className="text-[#1C3A2E]/30"><IconSearch /></span>
    <input
      type="text"
      placeholder="Search destinations, guides..."
      className="bg-transparent outline-none text-[13px] text-[#1C3A2E] placeholder:text-[#1C3A2E]/35 w-full"
    />
  </div>

  <button
    className="relative w-[38px] h-[38px] flex items-center justify-center text-[#1C3A2E]/50 hover:text-[#1C3A2E] transition-colors rounded-[10px] border border-[#1C3A2E]/[0.08] bg-white"
    aria-label="Notifications"
  >
    <IconBell />
    <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-[#C4522A] border-[1.5px] border-white" />
  </button>

        <div className="h-6 w-px bg-black/8 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-medium text-[#1C3A2E] leading-tight">{user?.fullName}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#1C3A2E]/35">{displayName}</p>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 ${accent.dot}`}>
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}