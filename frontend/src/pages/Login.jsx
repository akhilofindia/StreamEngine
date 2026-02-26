// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      {/* Animated grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', width: '100%', maxWidth: '960px',
        margin: '1rem', borderRadius: '1.5rem', overflow: 'hidden',
        boxShadow: '0 0 80px rgba(0, 229, 255, 0.1), 0 0 0 1px rgba(0,229,255,0.15)',
        animation: 'float-up 0.5s ease forwards',
      }}>
        {/* Left brand panel */}
        <div style={{
          display: 'none',
          flex: '1',
          background: 'linear-gradient(145deg, rgba(0,229,255,0.08) 0%, rgba(168,85,247,0.08) 100%)',
          borderRight: '1px solid rgba(0,229,255,0.1)',
          padding: '3rem',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '1.5rem',
        }} className="brand-panel">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.5rem 1rem',
            background: 'rgba(0,229,255,0.08)', borderRadius: '9999px',
            border: '1px solid rgba(0,229,255,0.2)',
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.7rem',
              letterSpacing: '0.15em', color: 'var(--accent-cyan)', fontWeight: 700
            }}>STREAM ENGINE</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.25rem',
            fontWeight: 900, lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff, var(--accent-cyan))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            Stream.<br />Manage.<br />Dominate.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '280px' }}>
            Enterprise-grade video streaming and management platform for modern teams.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            {['4K Ready', 'Real-time', 'Secure'].map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{
          flex: '1', background: 'rgba(10,15,30,0.95)',
          padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {/* Mobile logo */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              marginBottom: '0.75rem'
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
              fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: '0.02em'
            }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              Sign in to your account to continue
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
                  AUTHENTICATING...
                </span>
              ) : '⚡ SIGN IN'}
            </button>
          </form>

          <p style={{
            marginTop: '2rem', textAlign: 'center',
            fontSize: '0.875rem', color: 'var(--text-muted)'
          }}>
            No account?{' '}
            <Link to="/register" style={{
              color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600,
              transition: 'var(--transition)'
            }}>
              Create one →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .brand-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;