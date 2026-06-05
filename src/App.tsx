import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';

// 1. Eagerly load public pages (for SEO and instant first paint)
import Home from './pages/public/Home'; 

// 2. Lazy load heavier authenticated routes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// A sleek fallback to show while the JS chunk is downloading
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
      
      {/* Suspense catches the lazy-loaded components while they fetch */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<><Navbar /><Register /></>} />

          {/* Protected Route Group - Only Admins */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Protected Route Group - Travelers and Guides */}
          <Route element={<ProtectedRoute allowedRoles={['Traveler', 'Local Guide', 'Admin']} />}>
            {/* <Route path="/profile" element={<Profile />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;