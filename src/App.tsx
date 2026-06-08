import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';

// Eagerly load public pages
import Home from './pages/public/Home'; 
import NotFound from './pages/public/NotFound';

// Lazy load auth pages (they're heavier with validation)
const Login = lazy(() => import('./pages/public/auth/Login'));
const Register = lazy(() => import('./pages/public/auth/Register'));

// Lazy load protected pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
// const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#faf8f4]">
    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
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

          {/* Protected Route Group - Admins Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Protected Route Group - All Authenticated Users */}
          <Route element={<ProtectedRoute allowedRoles={['Traveler', 'Local Guide', 'Admin']} />}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/profile" element={<Profile />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/guides" element={<LocalGuides />} /> */}
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;