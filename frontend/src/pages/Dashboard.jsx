// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getSocket } from '../utils/socket';

import DashboardHeader from './DashboardHeader';
import UploadForm from './UploadForm';
import VideoCard from './VideoCard';

const Dashboard = () => {
  const { user, logout: contextLogout } = useAuth();
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loadingVideos, setLoadingVideos] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin');
  }, [user, navigate]);

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      let url = user?.role === 'viewer' ? '/api/videos/shared-videos' : '/api/videos/my-videos';
      const res = await axios.get(url);
      setVideos(res.data);
    } catch (err) {
      setUploadError('Failed to load videos');
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (user) fetchVideos();
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.id) return;
    const handleStatusUpdate = (data) => {
      if (data.status === 'ready') fetchVideos();
    };
    socket.on('videoStatusUpdate', handleStatusUpdate);
    return () => socket.off('videoStatusUpdate', handleStatusUpdate);
  }, [user?.id]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { toast.error('Please select a video file'); return; }
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('title', title || selectedFile.name);
    formData.append('description', description);
    try {
      const res = await axios.post('/api/videos/upload', formData);
      const newVideo = { _id: res.data.video.id, title: title || selectedFile.name, originalName: selectedFile.name, status: 'pending' };
      setVideos((prev) => [newVideo, ...prev]);
      setProgress((prev) => ({ ...prev, [newVideo._id]: 0 }));
      toast.success('Upload successful! Processing started...');
      setSelectedFile(null); setTitle(''); setDescription('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setUploadError(errorMsg); toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`/api/videos/${videoId}`);
      setVideos(prev => prev.filter(v => v._id !== videoId));
      toast.success('Video deleted');
    } catch {
      toast.error('Failed to delete video');
    }
  };

  const handleShareUpdate = (videoId, isShared) => {
    setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isShared } : v));
  };

  const handleLogout = () => contextLogout();

  const MAX_STORAGE_MB = 500;
  const usedBytes = videos.reduce((acc, v) => acc + (parseFloat(v.size) || 0), 0);
  const usedStorageMB = (usedBytes / (1024 * 1024)).toFixed(2);
  const usedPercentage = Math.min((usedStorageMB / MAX_STORAGE_MB) * 100, 100);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 60% 40% at 10% 20%, rgba(0,229,255,0.05) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 50% at 90% 80%, rgba(168,85,247,0.05) 0%, transparent 60%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <DashboardHeader user={user} handleLogout={handleLogout} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>

          {/* Storage Card */}
          {user?.role !== 'viewer' && (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              marginBottom: '2rem', animation: 'float-up 0.4s ease forwards',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>💾</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.7rem',
                    letterSpacing: '0.12em', color: 'var(--text-secondary)',
                    textTransform: 'uppercase', fontWeight: 600
                  }}>Storage Usage</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: usedPercentage > 90 ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>
                    {usedStorageMB} MB
                  </span>
                  {' / '}{MAX_STORAGE_MB} MB
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${usedPercentage}%`,
                    background: usedPercentage > 90
                      ? 'linear-gradient(90deg, #ff4444, #ff8844)'
                      : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
                    boxShadow: usedPercentage > 90
                      ? 'var(--glow-red)' : '0 0 10px rgba(0, 229, 255, 0.5)',
                  }}
                />
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {usedPercentage.toFixed(1)}% used
              </div>
            </div>
          )}

          {/* Upload Form */}
          {user?.role !== 'viewer' && (
            <UploadForm
              uploading={uploading}
              uploadError={uploadError}
              handleFileChange={handleFileChange}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              handleUpload={handleUpload}
            />
          )}

          {/* Videos Section */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '2rem',
            animation: 'float-up 0.4s ease 0.1s both',
          }}>
            {/* Section header */}
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem',
                fontWeight: 700, color: 'var(--text-primary)',
                letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0
              }}>
                {user?.role === 'viewer' ? '📺 Shared Library' : '🎬 My Videos'}
              </h2>
              <div className="section-header-line" />
              <span style={{
                background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)',
                border: '1px solid rgba(0,229,255,0.25)', borderRadius: '9999px',
                padding: '0.15rem 0.75rem', fontSize: '0.75rem',
                fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0
              }}>
                {videos.length}
              </span>
            </div>

            {loadingVideos ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '1rem' }}>
                <div className="engine-spinner" />
                <span className="engine-loader-text">Loading streams...</span>
              </div>
            ) : videos.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem 0',
                border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎬</div>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  NO VIDEOS FOUND
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {user?.role === 'viewer' ? 'No shared videos yet.' : 'Upload your first video above.'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.25rem'
              }}>
                {videos.map((video, i) => (
                  <div key={video._id} style={{ animationDelay: `${i * 0.05}s`, animation: 'float-up 0.4s ease both' }}>
                    <VideoCard
                      video={video}
                      user={user}
                      onShareUpdate={handleShareUpdate}
                      handleDelete={() => handleDelete(video._id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;