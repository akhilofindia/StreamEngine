// src/pages/OverviewPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function OverviewPage() {
  const { user } = useAuth();
  const [storage, setStorage] = useState({ usedMB: 0, limitMB: 500, usedPercentage: 0 });
  const [videoCount, setVideoCount] = useState(null);

  useEffect(() => {
    if (user?.role === 'viewer') return;
    axios.get('/api/videos/storage-info')
      .then(res => setStorage(res.data))
      .catch(() => {});
    axios.get('/api/videos/my-videos')
      .then(res => setVideoCount(res.data.length))
      .catch(() => {});
  }, [user]);

  const isNearLimit = storage.usedPercentage > 80;
  const isAtLimit = storage.usedPercentage >= 100;

  const quickLinks = user?.role === 'viewer'
    ? [{ to: '/dashboard/shared', icon: '📺', label: 'Shared Library', sub: 'Videos shared with you' }]
    : [
        { to: '/dashboard/videos', icon: '🎬', label: 'My Videos', sub: `${videoCount ?? '...'} videos uploaded` },
        { to: '/dashboard/upload', icon: '⬆', label: 'Upload Video', sub: 'Add a new video' },
        { to: '/dashboard/shared', icon: '📺', label: 'Shared Library', sub: 'Videos shared with you' },
      ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '2.5rem', animation: 'float-up 0.4s ease forwards' }}>
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          WELCOME BACK
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900,
          background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-cyan) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '0.02em', marginBottom: '0.25rem',
        }}>
          {user?.email?.split('@')[0]}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span className={`chip chip-${user?.role}`} style={{ fontSize: '0.65rem', marginRight: '0.5rem' }}>
            {user?.role}
          </span>
          {user?.organizationId}
        </p>
      </div>

      {/* Storage bar (editors/admins only) */}
      {user?.role !== 'viewer' && (
        <div style={{
          background: 'var(--surface)', border: `1px solid ${isAtLimit ? 'rgba(255,68,68,0.4)' : isNearLimit ? 'rgba(255,165,0,0.3)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)', padding: '1.5rem',
          marginBottom: '2rem', animation: 'float-up 0.4s ease 0.05s both',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💾</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Storage
              </span>
              {isAtLimit && (
                <span style={{ background: 'rgba(255,68,68,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '9999px', padding: '0.1rem 0.6rem', fontSize: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  LIMIT REACHED
                </span>
              )}
              {isNearLimit && !isAtLimit && (
                <span style={{ background: 'rgba(255,165,0,0.15)', color: '#ffab40', border: '1px solid rgba(255,165,0,0.3)', borderRadius: '9999px', padding: '0.1rem 0.6rem', fontSize: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  ALMOST FULL
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: isAtLimit ? 'var(--accent-red)' : isNearLimit ? '#ffab40' : 'var(--accent-cyan)' }}>
                {storage.usedMB.toFixed(2)} MB
              </span>
              {' / '}{storage.limitMB} MB
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${storage.usedPercentage}%`,
                background: isAtLimit
                  ? 'linear-gradient(90deg, #ff4444, #ff8844)'
                  : isNearLimit
                    ? 'linear-gradient(90deg, #ffab40, #ff8844)'
                    : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
                boxShadow: isAtLimit ? 'var(--glow-red)' : '0 0 10px rgba(0,229,255,0.5)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {storage.usedPercentage.toFixed(1)}% used
            {isAtLimit && <span style={{ color: '#ff6b6b', marginLeft: '0.5rem' }}>— delete videos or ask your admin to increase your limit.</span>}
          </div>
        </div>
      )}

      {/* Quick navigation cards */}
      <p style={{ fontSize: '0.6rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        QUICK ACCESS
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {quickLinks.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              textDecoration: 'none',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              display: 'block', animation: `float-up 0.4s ease ${(i + 1) * 0.07}s both`,
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{link.icon}</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
              {link.label}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{link.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
