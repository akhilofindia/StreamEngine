// src/pages/Register.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
  { value: 'viewer', label: 'Viewer', icon: '👁', desc: 'Watch shared content' },
  { value: 'editor', label: 'Editor', icon: '✏️', desc: 'Upload & manage videos' },
  { value: 'admin', label: 'Admin', icon: '⚡', desc: 'Full system access' },
];

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [orgId, setOrgId] = useState('org_main');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, role, orgId);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '520px', margin: '1.5rem 1rem',
        background: 'rgba(10,15,30,0.95)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        boxShadow: '0 0 80px rgba(168,85,247,0.1), 0 0 0 1px rgba(168,85,247,0.15)',
        animation: 'float-up 0.5s ease forwards',
        padding: '2.5rem',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '0.05em'
            }}>Stream Engine</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700,
            color: 'var(--text-primary)',
          }}>Create your account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Join the platform and start streaming
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)',
            color: '#ff6b6b', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Organization Code</label>
            <input
              type="text"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              className="input-dark"
              placeholder="org_main"
            />
          </div>

          {/* Role Selector Cards */}
          <div>
            <label style={{
              display: 'block', marginBottom: '0.75rem',
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {ROLES.map(r => (
                <label key={r.value} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                  padding: '0.875rem 0.5rem',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  border: `1px solid ${role === r.value
                    ? r.value === 'admin' ? 'rgba(0,229,255,0.5)'
                      : r.value === 'editor' ? 'rgba(168,85,247,0.5)'
                      : 'rgba(255,255,255,0.2)'
                    : 'var(--border)'}`,
                  background: role === r.value
                    ? r.value === 'admin' ? 'rgba(0,229,255,0.08)'
                      : r.value === 'editor' ? 'rgba(168,85,247,0.08)'
                      : 'rgba(255,255,255,0.05)'
                    : 'transparent',
                  transition: 'var(--transition)',
                  boxShadow: role === r.value && r.value === 'admin' ? '0 0 15px rgba(0,229,255,0.15)' : 'none',
                }}>
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: role === r.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}>{r.label}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {r.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon"
            style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.1em' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: 16, height: 16, display: 'inline-block',
                  border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000',
                  borderRadius: '50%', animation: 'spin-engine 0.7s linear infinite'
                }} />
                CREATING ACCOUNT...
              </span>
            ) : '⚡ CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{
          marginTop: '2rem', textAlign: 'center',
          fontSize: '0.875rem', color: 'var(--text-muted)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: 600,
          }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;