// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import OverviewPage from './pages/OverviewPage';
import MyVideos from './pages/MyVideos';
import SharedVideos from './pages/SharedVideos';
import UploadPage from './pages/UploadPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem',
    }}>
      <div className="engine-spinner" />
      <span className="engine-loader-text">Initializing Stream Engine...</span>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      {/* User dashboard — nested routes with sidebar layout */}
      <Route
        path="/dashboard"
        element={
          user
            ? (user.role === 'admin' ? <Navigate to="/admin" /> : <DashboardLayout />)
            : <Navigate to="/login" />
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="videos" element={<MyVideos />} />
        <Route
          path="upload"
          element={
            <ProtectedRoute allowedRoles={['editor', 'admin']}>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="shared" element={<SharedVideos />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;