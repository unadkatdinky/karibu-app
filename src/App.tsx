import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import { useAuthStore } from './store/useAuthStore';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// ── Public (eager) ────────────────────────────────────────────────────────────
import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';
import ForgotPassword from './pages/public/auth/ForgotPassword';
import ResetPassword from './pages/public/auth/ResetPassword';
import OTPVerification from './pages/public/auth/OTPVerification';

// ── Auth (lazy — visited once per session) ────────────────────────────────────
const Login    = lazy(() => import('./pages/public/auth/Login'));
const Register = lazy(() => import('./pages/public/auth/Register'));

// ── Dashboard pages (lazy — only load when logged in) ─────────────────────────
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers       = lazy(() => import('./pages/admin/ManageUsers'));
const TravelerDashboard = lazy(() => import('./pages/traveler/TravelerDashboard'));
const SavedPlaces       = lazy(() => import('./pages/traveler/SavedPlaces'));
const ExploreDestinations = lazy(() => import('./pages/traveler/ExploreDestinations'));
const DestinationDetail   = lazy(() => import('./pages/traveler/DestinationDetail'));
const GuideDashboard    = lazy(() => import('./pages/guide/GuideDashboard'));
const CommunityTasks    = lazy(() => import('./pages/guide/CommunityTasks'));

// ── Shared ─────────────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#faf8f4]">
    <div className="w-6 h-6 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
  </div>
);

// Only show the landing Navbar on "/"
function LandingNavbar() {
  const { pathname } = useLocation();
  return pathname === '/' ? <Navbar /> : null;
}

// Logged-in users who hit "/" go straight to their role's home
function RoleRedirect() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Home />;
  if (user.role === 'Admin')      return <Navigate to="/admin"    replace />;
  if (user.role === 'LocalGuide') return <Navigate to="/guide"    replace />;
  return                                 <Navigate to="/traveler" replace />;
}

export default function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => { checkAuth(); }, [checkAuth]);
  if (isCheckingAuth) return <PageLoader />;

  return (
    <BrowserRouter>
      <div className="hidden md:block"><CustomCursor /></div>
      <LandingNavbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ──────────────────────────────────────────────────── */}
          <Route path="/"                element={<RoleRedirect />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/verify-otp"      element={<OTPVerification />} />

          {/* ── Admin ───────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin"          element={<AdminDashboard />} />
              <Route path="/admin/users"    element={<ManageUsers />} />
            </Route>
          </Route>

          {/* ── Local Guide ─────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={['LocalGuide']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/guide"          element={<GuideDashboard />} />
              <Route path="/guide/tasks"    element={<CommunityTasks />} />
            </Route>
          </Route>

          {/* ── Traveler ────────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={['Traveler', 'Admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/traveler"       element={<TravelerDashboard />} />
              <Route path="/traveler/explore"          element={<ExploreDestinations />} />
              <Route path="/traveler/explore/:slug"    element={<DestinationDetail />} />
              <Route path="/traveler/saved" element={<SavedPlaces />} />
            </Route>
          </Route>

          {/* ── 404 ─────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}