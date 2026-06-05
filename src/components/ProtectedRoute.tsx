import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // If they aren't logged in, send them to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires specific roles and the user doesn't have it, deny access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or route to an /unauthorized page
  }

  // If they pass the checks, render the child route
  return <Outlet />;
}