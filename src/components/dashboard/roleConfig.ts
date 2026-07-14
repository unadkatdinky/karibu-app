// Single source of truth for everything that differs between roles.
// DashboardLayout, Sidebar, and Topbar all read from here — zero drift.

import type { UserRole } from '../../store/useAuthStore';
// import type { ReactNode } from 'react';

export interface NavLink {
  name: string;
  path: string;
  icon: string; // key into the icon map in Sidebar.tsx
}

export interface RoleConfig {
  navLinks: NavLink[];
  // Human-readable context label shown under the logo in the sidebar
  label: string;
  // The colour that makes each role instantly recognisable at a glance:
  // Admin → rust, Guide → gold, Traveler → sage
  accent: {
    dot: string;        // Tailwind bg class for the coloured dot / avatar bg
    activeBg: string;   // Tailwind bg class for active nav item bg
    activeText: string; // Tailwind text class for active nav item text + icon
  };
  // Display name for this role shown in the topbar / sidebar user row
  displayName: string;
  // Where to redirect after login — should match the first navLink path
  homeRoute: string;
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  Admin: {
    homeRoute: '/admin',
    displayName: 'Admin',
    label: 'Admin console',
    accent: {
      dot:        'bg-[#C4522A]',
      activeBg:   'bg-[#C4522A]/10',
      activeText: 'text-[#C4522A]',
    },
   navLinks: [
      { name: 'Overview',     path: '/admin',              icon: 'overview' },
      { name: 'Users',        path: '/admin/users',        icon: 'users'    },
      { name: 'Destinations', path: '/admin/destinations', icon: 'map'      },
    ],
  },
  LocalGuide: {
    homeRoute: '/guide',
    displayName: 'Local Guide',
    label: 'Guide portal',
    accent: {
      dot:        'bg-[#D4A853]',
      activeBg:   'bg-[#D4A853]/10',
      activeText: 'text-[#D4A853]',
    },
    navLinks: [
      { name: 'My portal', path: '/guide',       icon: 'guide' },
      { name: 'My tours',  path: '/guide/tours', icon: 'map'   },
      { name: 'Tasks',     path: '/guide/tasks', icon: 'tasks' },
    ],
  },
  Traveler: {
    homeRoute: '/traveler',
    displayName: 'Traveler',
    label: 'Traveler space',
    accent: {
      dot:        'bg-[#2D5A3D]',
      activeBg:   'bg-[#9FD4B8]/15',
      activeText: 'text-[#9FD4B8]',
    },
    navLinks: [
      { name: 'My journey',   path: '/traveler',        icon: 'map'      },
      { name: 'Explore',      path: '/traveler/explore', icon: 'compass' },
      { name: 'Saved places', path: '/traveler/saved',  icon: 'bookmark' },
      { name: 'Travel notes', path: '/traveler/notes',  icon: 'scroll'   },
    ],
  },
};