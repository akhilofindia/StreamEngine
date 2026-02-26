// src/components/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Ambient glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 60% 40% at 10% 20%, rgba(0,229,255,0.05) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 50% at 90% 80%, rgba(168,85,247,0.05) 0%, transparent 60%)`,
      }} />

      <Sidebar />

      {/* Main content area */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
