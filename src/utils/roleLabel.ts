// src/utils/roleLabel.ts
//
// Single source of truth for displaying a role to humans.
// The STORED value (DB, JWT claims, frontend state) is always "LocalGuide" (no space).
// This function is the ONLY place that turns it into "Local Guide" for display.

export type Role = 'Traveler' | 'LocalGuide' | 'Admin';

export const roleLabel = (role: Role | string): string => {
  switch (role) {
    case 'LocalGuide':
      return 'Local Guide';
    default:
      return role;
  }
};