import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './state/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import AddProperty from './pages/AddProperty';
import AdminDashboard from './pages/AdminDashboard';

// Guard: redirect to /login if not authenticated
function RequireAuth({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

// Guard: redirect owner away from customer routes and vice versa
function RequireOwner({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'owner') return <Navigate to="/" replace />;
  return children;
}

// Guard: admin only
function RequireAdmin({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <>
      {/* Only show Navbar for non-login pages */}
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to={
          user.role === 'owner' ? '/owner-dashboard' : 
          user.role === 'admin' ? '/admin-dashboard' : 
          '/'
        } replace /> : <Login />} />

        {/* Customer routes */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/listings" element={<RequireAuth><Listings /></RequireAuth>} />
        <Route path="/property/:id" element={<RequireAuth><PropertyDetail /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

        {/* Owner routes */}
        <Route path="/owner-dashboard" element={<RequireOwner><OwnerDashboard /></RequireOwner>} />
        <Route path="/add-property" element={<RequireOwner><AddProperty /></RequireOwner>} />

        {/* Admin routes */}
        <Route path="/admin-dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

        <Route path="*" element={<Navigate to={user ? (
          user.role === 'owner' ? '/owner-dashboard' : 
          user.role === 'admin' ? '/admin-dashboard' : 
          '/'
        ) : '/login'} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
