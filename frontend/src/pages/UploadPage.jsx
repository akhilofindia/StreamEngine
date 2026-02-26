// src/pages/UploadPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getSocket } from '../utils/socket';
import UploadForm from './UploadForm';

export default function UploadPage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [storage, setStorage] = useState({ usedMB: 0, limitMB: 500, usedPercentage: 0 });

  const fetchStorage = () => {
    axios.get('/api/videos/storage-info')
      .then(res => setStorage(res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchStorage(); }, []);

  // Refresh storage after upload completes via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.id) return;
    const handler = (data) => { if (data.status === 'ready') fetchStorage(); };
    socket.on('videoStatusUpdate', handler);
    return () => socket.off('videoStatusUpdate', handler);
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
      await axios.post('/api/videos/upload', formData);
      toast.success('Upload successful! Processing started...');
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      fetchStorage(); // refresh bar immediately
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setUploadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const isNearLimit = storage.usedPercentage > 80;
  const isAtLimit = storage.usedPercentage >= 100;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem', animation: 'float-up 0.4s ease forwards' }}>
        <p style={{ fontSize: '0.6rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          DASHBOARD
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900,
          background: 'linear-gradient(135deg, var(--text-primary), var(--accent-cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          ⬆ Upload Video
        </h1>
      </div>

      {/* Storage bar */}
      <div style={{
        background: 'var(--surface)',
        border: `1px solid ${isAtLimit ? 'rgba(255,68,68,0.4)' : isNearLimit ? 'rgba(255,165,0,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        marginBottom: '1.5rem', animation: 'float-up 0.4s ease 0.05s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>💾</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Storage Usage
            </span>
            {isAtLimit && (
              <span style={{ background: 'rgba(255,68,68,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '9999px', padding: '0.1rem 0.5rem', fontSize: '0.58rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                LIMIT REACHED — UPLOADS BLOCKED
              </span>
            )}
            {isNearLimit && !isAtLimit && (
              <span style={{ background: 'rgba(255,165,0,0.15)', color: '#ffab40', border: '1px solid rgba(255,165,0,0.3)', borderRadius: '9999px', padding: '0.1rem 0.5rem', fontSize: '0.58rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                ALMOST FULL
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
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
        <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {storage.usedPercentage.toFixed(1)}% used
          {isAtLimit && <span style={{ color: '#ff6b6b', marginLeft: '0.5rem' }}>— contact your admin to increase your storage limit.</span>}
        </div>
      </div>

      {/* Upload form (disabled if at limit) */}
      {isAtLimit ? (
        <div style={{
          background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.25)',
          borderRadius: 'var(--radius-lg)', padding: '3rem 2rem',
          textAlign: 'center', animation: 'float-up 0.4s ease 0.1s both',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: '#ff6b6b', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Storage Limit Reached
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            You&apos;ve used {storage.usedMB.toFixed(2)} MB of your {storage.limitMB} MB limit.
            Delete some videos or ask your admin to increase your limit.
          </p>
        </div>
      ) : (
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
    </div>
  );
}
