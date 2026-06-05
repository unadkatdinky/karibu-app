import { useAuthStore } from '../store/useAuthStore';

export function useHasRole(requiredRoles: string[]) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return false;
  return requiredRoles.includes(user.role);
}