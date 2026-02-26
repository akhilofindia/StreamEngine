// src/pages/UploadForm.jsx
import { useState, useRef } from 'react';

export default function UploadForm({
  uploading,
  uploadError,
  handleFileChange,
  title,
  setTitle,
  description,
  setDescription,
  handleUpload,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files[0]) setFileName(e.target.files[0].name);
    handleFileChange(e);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1.75rem',
      marginBottom: '1.5rem', animation: 'float-up 0.4s ease forwards',
    }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '0.8rem',
          fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0
        }}>
          📤 Upload New Video
        </h2>
        <div className="section-header-line" />
      </div>

      {uploadError && (
        <div style={{
          background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)',
          color: '#ff6b6b', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <span>⚠</span> {uploadError}
        </div>
      )}

      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Drag-drop zone */}
        <div
          className="upload-zone"
          style={{
            borderColor: dragOver ? 'var(--accent-cyan)' : fileName ? 'rgba(0,229,255,0.4)' : undefined,
            background: dragOver ? 'rgba(0,229,255,0.05)' : undefined,
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={onFileChange}
            required
            style={{ display: 'none' }}
          />
          {fileName ? (
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: '0.75rem',
                color: 'var(--accent-cyan)', letterSpacing: '0.05em', marginBottom: '0.25rem'
              }}>FILE SELECTED</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{fileName}</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.6 }}>📁</div>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: '0.75rem',
                color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '0.4rem'
              }}>DROP VIDEO HERE</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                or click to browse · MP4, MOV, AVI, MKV supported
              </p>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-dark"
              placeholder="My awesome video..."
            />
          </div>
          <div>
            <label style={{
              display: 'block', marginBottom: '0.5rem',
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-dark"
              placeholder="Brief description..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-neon"
          style={{ width: '100%', padding: '0.875rem', fontSize: '0.8rem', letterSpacing: '0.1em' }}
        >
          {uploading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <span style={{
                width: 16, height: 16, display: 'inline-block',
                border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000',
                borderRadius: '50%', animation: 'spin-engine 0.7s linear infinite'
              }} />
              UPLOADING...
            </span>
          ) : '⬆ UPLOAD VIDEO'}
        </button>
      </form>
    </div>
  );
}