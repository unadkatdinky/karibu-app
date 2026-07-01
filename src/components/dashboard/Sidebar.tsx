import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, type UserRole } from '../../store/useAuthStore';
import { ROLE_CONFIG } from './roleConfig';
import {
  IconOverview, IconUsers, IconShield, IconMap,
  IconBookmark, IconScroll, IconTasks, IconGuide,
  IconLogout, IconChevronLeft,
} from './icons';

// Map icon key strings (from roleConfig) to actual React components.
// Adding a new icon: put it in icons.tsx, add it here, reference it in roleConfig.ts.
const ICON_MAP: Record<string, React.ReactNode> = {
  overview: <IconOverview />,
  users:    <IconUsers />,
  shield:   <IconShield />,
  map:      <IconMap />,
  bookmark: <IconBookmark />,
  scroll:   <IconScroll />,
  tasks:    <IconTasks />,
  guide:    <IconGuide />,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const role = (user?.role ?? 'Traveler') as UserRole;
  const config = ROLE_CONFIG[role];
  const { accent, navLinks, label } = config;

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? 'K';

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="h-full bg-[#1C3A2E] flex flex-col shrink-0 z-20 overflow-hidden"
    >
      {/* ── Logo row ─────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden" title="Back to home">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4A853] flex items-center justify-center shrink-0 font-serif font-bold text-[14px] text-[#D4A853]">
            K
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-serif text-[19px] text-[#F5EDD8] whitespace-nowrap"
              >
                Karibu
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={onToggle}
          className="text-[#F5EDD8]/30 hover:text-[#F5EDD8] transition-colors p-1 rounded-lg hover:bg-white/5 shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.22 }} className="block">
            <IconChevronLeft />
          </motion.span>
        </button>
      </div>

      {/* ── Role badge ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-4 pt-5 pb-1"
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot}`} />
              <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#F5EDD8]/35">
                {label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav links ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? `${accent.activeBg} ${accent.activeText}`
                  : 'text-[#F5EDD8]/45 hover:text-[#F5EDD8] hover:bg-white/5'
              }`}
            >
              <span className={isActive ? accent.activeText : ''}>{ICON_MAP[link.icon]}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[13px] font-medium tracking-wide whitespace-nowrap"
                  >
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ── User row + logout ─────────────────────────────────────────────── */}
      <div className="p-2 border-t border-white/5 space-y-0.5 shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-2"
            >
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold text-white ${accent.dot}`}>
                {initial}
              </div>
              <div className="overflow-hidden">
                <p className="text-[12px] font-medium text-[#F5EDD8] truncate leading-tight">{user?.fullName}</p>
                <p className="text-[10px] text-[#F5EDD8]/35 uppercase tracking-wide">{config.displayName}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={async () => { await logout(); window.location.href = '/login'; }}
          title={collapsed ? 'Sign out' : undefined}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#C4522A]/60 hover:text-[#C4522A] hover:bg-[#C4522A]/10 transition-all duration-150"
        >
          <IconLogout />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[13px] font-medium whitespace-nowrap">
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}