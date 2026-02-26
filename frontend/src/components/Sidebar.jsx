// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '▦', label: 'Overview' },
  { path: '/dashboard/videos', icon: '▶', label: 'My Videos' },
  { path: '/dashboard/upload', icon: '⬆', label: 'Upload' },
  { path: '/dashboard/shared', icon: '⊕', label: 'Shared' },
];

const ADMIN_NAV_ITEMS = [
  { path: '/admin', icon: '▦', label: 'Overview' },
  { path: '/admin/users', icon: '⊛', label: 'Users' },
  { path: '/admin/videos', icon: '▶', label: 'All Videos' },
  { path: '/admin/logs', icon: '≡', label: 'Audit Logs' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  // Exact match for /dashboard (avoid /dashboard/videos matching overview)
  // Prefix match for /admin sub-routes
  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: collapsed ? '1rem 0.5rem' : '1.5rem 1rem',
      transition: 'padding 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : '0.6rem', marginBottom: '2.5rem',
        overflow: 'hidden',
      }}>
        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>⚡</span>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}>Stream Engine</span>
        )}
      </div>

      {/* User badge */}
      {!collapsed && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
          padding: '0.875rem', marginBottom: '2rem',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: '#000',
          }}>
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.2rem', wordBreak: 'break-all' }}>
            {user?.email}
          </p>
          <span className={`chip chip-${user?.role}`} style={{ fontSize: '0.6rem' }}>
            {user?.role === 'admin' ? '⚡' : user?.role === 'editor' ? '✏️' : '👁'} {user?.role}
          </span>
        </div>
      )}

      {/* Org badge */}
      {!collapsed && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.3rem 0.6rem', marginBottom: '1.5rem',
          background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: '9999px', width: 'fit-content',
        }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>ORG</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {user?.organizationId}
          </span>
        </div>
      )}

      {/* Section label */}
      {!collapsed && (
        <p style={{
          fontSize: '0.6rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em',
          color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem'
        }}>NAVIGATION</p>
      )}

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : '0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '0.75rem' : '0.7rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                transition: 'var(--transition)',
                background: active
                  ? 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(168,85,247,0.08))'
                  : 'transparent',
                border: active ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: active ? '0 0 15px rgba(0,229,255,0.08)' : 'none',
              }}
              title={collapsed ? item.label : ''}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{
                fontSize: '1rem', flexShrink: 0,
                color: active ? 'var(--accent-cyan)' : 'inherit',
              }}>{item.icon}</span>
              {!collapsed && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.72rem',
                  fontWeight: 600, letterSpacing: '0.06em',
                  color: active ? 'var(--accent-cyan)' : 'inherit',
                }}>{item.label}</span>
              )}
              {active && !collapsed && (
                <span style={{
                  marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 8px var(--accent-cyan)',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: collapse toggle + logout */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)',
            padding: '0.5rem', cursor: 'pointer', fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {collapsed ? '»' : '«'}
        </button>

        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.6rem',
            background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)',
            color: 'var(--accent-red)', borderRadius: 'var(--radius-sm)',
            padding: collapsed ? '0.6rem' : '0.6rem 0.875rem',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
            transition: 'var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,68,68,0.15)';
            e.currentTarget.style.boxShadow = 'var(--glow-red)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,68,68,0.06)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>↩</span>
          {!collapsed && <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.06em' }}>LOGOUT</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="mobile-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed', top: '1rem', left: '1rem', zIndex: 300,
          background: 'rgba(10,15,30,0.9)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem',
          color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem',
          backdropFilter: 'blur(8px)',
          display: 'none',
        }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 198, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '68px' : '220px',
        minHeight: '100vh', flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.3s ease',
        position: 'relative', zIndex: 199,
        overflow: 'hidden',
      }}
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
      >
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; align-items: center; justify-content: center; }
          .sidebar {
            position: fixed !important;
            left: ${mobileOpen ? '0' : '-220px'} !important;
            width: 220px !important;
            top: 0; bottom: 0;
            transition: left 0.3s ease !important;
            z-index: 199 !important;
          }
        }
      `}</style>
    </>
  );
}
