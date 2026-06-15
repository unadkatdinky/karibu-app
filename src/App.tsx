import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import { useAuthStore } from './store/useAuthStore';

// Eagerly load public pages
import Home from './pages/public/Home'; 
import NotFound from './pages/public/NotFound';
import ResetPassword from './pages/public/auth/ResetPassword';
import ForgotPassword from './pages/public/auth/ForgotPassword';
import OTPVerification from './pages/public/auth/OTPVerification';

// Lazy load auth pages
const Login = lazy(() => import('./pages/public/auth/Login'));
const Register = lazy(() => import('./pages/public/auth/Register'));

// Lazy load protected pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#faf8f4]">
    <div className="w-6 h-6 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  // 1. HOOKS MUST LIVE INSIDE THE COMPONENT
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. SHOW LOADER WHILE WAITING FOR GO BACKEND
  // This prevents the Navbar from flashing "Sign In" before it realizes you have a cookie
  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <div className="hidden md:block"><CustomCursor /></div>
      <Navbar />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          
          {/* Protected Route Group - Admins Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Protected Route Group - All Authenticated Users */}
          <Route element={<ProtectedRoute allowedRoles={['Traveler', 'LocalGuide', 'Admin']} />}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;