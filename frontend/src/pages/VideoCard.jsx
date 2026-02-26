import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { socket } from '../utils/socket';

export default function VideoCard({ video, user, onShareUpdate, handleDelete, hideOwner = true }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title || '');
  const [editDesc, setEditDesc] = useState(video.description || '');
  const [assignEmail, setAssignEmail] = useState('');

  const [status, setStatus] = useState(video.status);
  const [percentage, setPercentage] = useState(0);

  const uploaderId = video.uploadedBy?._id || video.uploadedBy;
  const isOwner = uploaderId?.toString() === user?.id?.toString();
  const isAdmin = user?.role === 'admin';
  const canManage = user?.role !== 'viewer' && (isOwner || isAdmin);
  const isReady = status === 'ready' || status === 'processed';

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      if (String(data.videoId) === String(video._id)) {
        setStatus(data.status);
        if (data.percent !== undefined) setPercentage(Math.min(Math.max(data.percent, 0), 100));
      }
    };
    socket.on('videoStatusUpdate', handleUpdate);
    return () => socket.off('videoStatusUpdate', handleUpdate);
  }, [video._id]);

  const toggleShare = async (e) => {
    const newShared = e.target.checked;
    try {
      await axios.patch(`/api/videos/${video._id}/share`, { isShared: newShared });
      onShareUpdate(video._id, newShared);
      toast.success(newShared ? 'Video shared publicly' : 'Video is now private');
    } catch { toast.error('Failed to update share status'); }
  };

  const handleAssign = async () => {
    try {
      await axios.patch(`/api/videos/${video._id}/assign`, { email: assignEmail });
      toast.success(`Video assigned to ${assignEmail}`);
      setAssignEmail('');
    } catch { toast.error('Error assigning user'); }
  };

  const saveEdit = async () => {
    try {
      await axios.patch(`/api/videos/${video._id}`, { title: editTitle, description: editDesc });
      toast.success('Video updated');
      setIsEditing(false);
      window.location.reload();
    } catch { toast.error('Failed to update'); }
  };

  const getStatusChip = () => {
    const s = status?.toLowerCase();
    if (s === 'ready' || s === 'processed') return <span className="chip chip-ready">● READY</span>;
    if (s === 'processing') return <span className="chip chip-processing">⟳ PROCESSING</span>;
    if (s === 'analyzing') return <span className="chip chip-processing">⦾ ANALYZING</span>;
    if (s === 'error' || s === 'failed') return <span className="chip chip-error">✕ ERROR</span>;
    return <span className="chip chip-pending">○ {(status || 'PENDING').toUpperCase()}</span>;
  };

  return (
    <div className="video-card">
      <div style={{ padding: '1.25rem', flex: 1 }}>

        {/* Uploader badge (admin view) */}
        {!hideOwner && video.uploadedBy?.email && (
          <div style={{
            marginBottom: '1rem', padding: '0.5rem 0.75rem',
            background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>BY</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {video.uploadedBy.email}
            </span>
          </div>
        )}

        {/* Title & Status */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
            marginBottom: '0.5rem', lineHeight: 1.4,
            fontFamily: 'var(--font-body)',
          }}>{video.title}</h3>
          {getStatusChip()}
        </div>

        {/* Progress bar */}
        {(status === 'processing' || status === 'analyzing') && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                color: 'var(--accent-cyan)', letterSpacing: '0.1em'
              }}>
                {status === 'analyzing' ? 'ANALYZING' : 'PROCESSING'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {percentage}%
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        )}

        {/* Video Player */}
        {isReady && (
          <div style={{ marginTop: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
            <video controls width="100%" style={{ display: 'block' }}>
              <source src={video.path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Management */}
        {canManage && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            {/* Share toggle */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              marginBottom: '1rem', cursor: 'pointer',
            }}>
              <div style={{
                width: 36, height: 20, borderRadius: 10,
                background: video.isShared ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'var(--transition)', flexShrink: 0,
                boxShadow: video.isShared ? '0 0 10px rgba(0,229,255,0.4)' : 'none',
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', background: 'white',
                  position: 'absolute', top: 3,
                  left: video.isShared ? 19 : 3,
                  transition: 'var(--transition)',
                }} />
                <input type="checkbox" checked={video.isShared} onChange={toggleShare} style={{ display: 'none' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {video.isShared ? 'Publicly shared' : 'Private'}
              </span>
            </label>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  flex: 1, padding: '0.5rem',
                  background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
                  color: 'var(--accent-violet)', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                  fontFamily: 'var(--font-body)', transition: 'var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
              >✏ Edit</button>
              <button
                onClick={handleDelete}
                className="btn-danger"
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}
              >✕ Delete</button>
            </div>
          </div>
        )}

        {/* Assign section */}
        {user.role !== 'viewer' && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Assign to viewer email..."
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
              className="input-dark"
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
            />
            <button
              onClick={handleAssign}
              style={{
                background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)',
                color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.875rem', cursor: 'pointer', fontWeight: 600,
                fontSize: '0.8rem', transition: 'var(--transition)', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,229,255,0.1)'}
            >Assign</button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}>
          <div className="modal-box">
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-primary)', letterSpacing: '0.05em'
              }}>Edit Video</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                Update title and description
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--text-secondary)', textTransform: 'uppercase',
                  fontFamily: 'var(--font-display)'
                }}>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-dark"
                  placeholder="Video title"
                />
              </div>
              <div>
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--text-secondary)', textTransform: 'uppercase',
                  fontFamily: 'var(--font-display)'
                }}>Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Describe this video..."
                  rows={4}
                  className="input-dark"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-ghost"
              >Cancel</button>
              <button
                onClick={saveEdit}
                className="btn-neon"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}
              >Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}