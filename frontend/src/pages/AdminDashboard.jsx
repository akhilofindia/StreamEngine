// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import Sidebar from '../components/Sidebar';
import VideoCard from './VideoCard';
import UserTable from './UserTable';
import AuditLogTable from './AuditLogTable';

const TAB_MAP = {
  '/admin': 'overview',
  '/admin/users': 'users',
  '/admin/videos': 'videos',
  '/admin/logs': 'logs',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  // Derive active tab from URL pathname
  const activeTab = TAB_MAP[location.pathname] ?? 'users';

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [userRes, videoRes, logRes] = await Promise.all([
        axios.get('/api/users/'),
        axios.get('api/videos/admin/all'),
        axios.get('/api/admin/logs'),
      ]);
      setUsers(userRes.data);
      setLogs(logRes.data);
      setVideos(Array.isArray(videoRes.data) ? videoRes.data : videoRes.data.videos || []);
    } catch (err) {
      toast.error('Failed to load administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/videos/${id}`);
      setVideos(prev => prev.filter(v => v._id !== id));
      toast.success('Video removed');
    } catch { toast.error('Failed to delete video'); }
  };

  const handleShareUpdate = (videoId, isShared) => {
    setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isShared } : v));
  };

  const totalBytes = videos.reduce((acc, v) => acc + (Number(v.size) || 0), 0);
  const stats = {
    totalUsers: users.length,
    totalVideos: videos.length,
    storageUsed: (totalBytes / (1024 * 1024)).toFixed(2),
  };

  const TABS = [
    { key: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { key: 'videos', label: 'Videos', icon: '🎬', path: '/admin/videos' },
    { key: 'logs', label: 'Audit Logs', icon: '📋', path: '/admin/logs' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Ambient glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 50% 40% at 80% 10%, rgba(168,85,247,0.06) 0%, transparent 60%),
                     radial-gradient(ellipse 40% 30% at 20% 90%, rgba(0,229,255,0.05) 0%, transparent 60%)`,
      }} />

      <Sidebar />

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          {/* Page title */}
          <div style={{ marginBottom: '2rem', animation: 'float-up 0.4s ease forwards' }}>
            <p style={{ fontSize: '0.6rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              ADMIN
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900,
                background: 'linear-gradient(135deg, var(--text-primary), var(--accent-violet))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', letterSpacing: '0.03em',
              }}>⚡ Control Panel</h1>
              <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, var(--border-accent), transparent)' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Manage users, content and system logs across the platform.
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginBottom: '2rem',
          }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', cls: 'stat-card-cyan', color: 'var(--accent-cyan)' },
              { label: 'Total Videos', value: stats.totalVideos, icon: '🎬', cls: 'stat-card-violet', color: 'var(--accent-violet)' },
              { label: 'Storage Used', value: `${stats.storageUsed} MB`, icon: '💾', cls: 'stat-card-magenta', color: 'var(--accent-magenta)' },
            ].map((stat, i) => (
              <div key={i} className={`stat-card ${stat.cls}`} style={{ animation: `float-up 0.4s ease ${i * 0.08}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{
                      color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-display)',
                      letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem'
                    }}>{stat.label}</p>
                    <p style={{
                      color: stat.color, fontSize: '2rem', fontWeight: 800,
                      fontFamily: 'var(--font-display)', lineHeight: 1,
                      textShadow: `0 0 20px ${stat.color}60`,
                    }}>{stat.value}</p>
                  </div>
                  <span style={{ fontSize: '1.75rem', opacity: 0.6 }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex', gap: '0.25rem', marginBottom: '1.5rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '0.25rem', width: 'fit-content',
          }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontSize: '0.7rem',
                  fontWeight: 700, letterSpacing: '0.08em',
                  transition: 'var(--transition)',
                  background: activeTab === tab.key
                    ? 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(168,85,247,0.15))'
                    : 'transparent',
                  color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '1.5rem',
            animation: 'fade-in 0.3s ease forwards',
          }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '1rem' }}>
                <div className="engine-spinner" />
                <span className="engine-loader-text">Syncing database...</span>
              </div>
            ) : (
              <>
                {activeTab === 'users' && <UserTable users={users} setUsers={setUsers} />}

                {activeTab === 'videos' && (
                  <section>
                    <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                        fontWeight: 700, color: 'var(--text-primary)',
                        letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0
                      }}>All Platform Videos</h2>
                      <div className="section-header-line" />
                      <span style={{
                        background: 'rgba(168,85,247,0.1)', color: 'var(--accent-violet)',
                        border: '1px solid rgba(168,85,247,0.25)', borderRadius: '9999px',
                        padding: '0.15rem 0.75rem', fontSize: '0.75rem',
                        fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0
                      }}>
                        {videos.length} total
                      </span>
                    </div>

                    {videos.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.4 }}>🎬</div>
                        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.12em' }}>
                          NO VIDEOS UPLOADED YET
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {videos.map(video => (
                          <VideoCard
                            key={video._id}
                            video={video}
                            user={user}
                            handleDelete={() => handleDeleteVideo(video._id)}
                            onShareUpdate={handleShareUpdate}
                            hideOwner={false}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {activeTab === 'logs' && <AuditLogTable logs={logs} />}

                {activeTab === 'overview' && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                      USE THE TABS ABOVE OR THE SIDEBAR TO NAVIGATE
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}