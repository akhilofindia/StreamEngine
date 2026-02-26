// src/pages/DashboardHeader.jsx
export default function DashboardHeader({ user, handleLogout }) {
  const roleChipClass =
    user?.role === 'admin' ? 'chip chip-admin' :
    user?.role === 'editor' ? 'chip chip-editor' :
    'chip chip-viewer';

  const roleIcon =
    user?.role === 'admin' ? '⚡' :
    user?.role === 'editor' ? '✏️' : '👁';

  return (
    <nav className="topnav" style={{ marginBottom: '2rem' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
        <span style={{ fontSize: '1.3rem' }}>⚡</span>
        <span className="topnav-logo">Stream Engine</span>
      </div>

      {/* Center: org info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'rgba(255,255,255,0.04)', borderRadius: '9999px',
        padding: '0.35rem 1rem', border: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>ORG</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {user?.organizationId || '—'}
        </span>
      </div>

      {/* Right: user + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {user?.email}
          </span>
          <span className={roleChipClass} style={{ marginTop: '0.2rem' }}>
            {roleIcon} {user?.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)',
            color: 'var(--accent-red)', borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
            fontSize: '0.85rem', fontWeight: 500, transition: 'var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,68,68,0.18)';
            e.currentTarget.style.boxShadow = 'var(--glow-red)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,68,68,0.08)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>↩</span> Logout
        </button>
      </div>
    </nav>
  );
}