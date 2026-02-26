// src/pages/SharedVideos.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import VideoCard from './VideoCard';

export default function SharedVideos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/videos/shared-videos')
      .then(res => setVideos(res.data))
      .catch(() => toast.error('Failed to load shared videos'))
      .finally(() => setLoading(false));
  }, []);

  const handleShareUpdate = (videoId, isShared) => {
    setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isShared } : v));
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem', animation: 'float-up 0.4s ease forwards' }}>
        <p style={{ fontSize: '0.6rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          DASHBOARD
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900,
          background: 'linear-gradient(135deg, var(--text-primary), var(--accent-violet))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          📺 Shared Library
        </h1>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '2rem',
        animation: 'float-up 0.4s ease 0.05s both',
      }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700,
            color: 'var(--text-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0
          }}>
            Videos Shared With You
          </h2>
          <div className="section-header-line" />
          <span style={{
            background: 'rgba(168,85,247,0.1)', color: 'var(--accent-violet)',
            border: '1px solid rgba(168,85,247,0.25)', borderRadius: '9999px',
            padding: '0.15rem 0.75rem', fontSize: '0.75rem',
            fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0
          }}>
            {videos.length}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '1rem' }}>
            <div className="engine-spinner" />
            <span className="engine-loader-text">Loading shared streams...</span>
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📺</div>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              NO SHARED VIDEOS YET
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Videos shared with you or publicly will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {videos.map((video, i) => (
              <div key={video._id} style={{ animationDelay: `${i * 0.05}s`, animation: 'float-up 0.4s ease both' }}>
                <VideoCard
                  video={video}
                  user={user}
                  onShareUpdate={handleShareUpdate}
                  handleDelete={null}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
