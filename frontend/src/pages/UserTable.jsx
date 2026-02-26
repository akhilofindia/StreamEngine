// src/pages/UserTable.jsx
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UserTable({ users, setUsers }) {
  const [editingLimit, setEditingLimit] = useState(null); // userId being edited
  const [limitInput, setLimitInput] = useState('');

  const updateRole = async (id, role) => {
    try {
      const res = await axios.patch(`/api/users/${id}/role`, { role });
      setUsers(users.map(u => (u._id === id ? res.data : u)));
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (id, email) => {
    if (!window.confirm(`Delete user ${email}? All their uploaded videos will also be deleted permanently.`)) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success(`User ${email} deleted`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const startEditLimit = (user) => {
    setEditingLimit(user._id);
    setLimitInput(String(user.storageLimitMB ?? 500));
  };

  const saveLimit = async (id) => {
    const val = Number(limitInput);
    if (!val || val < 1) { toast.error('Please enter a valid limit (≥ 1 MB)'); return; }
    try {
      await axios.patch(`/api/users/${id}/storage-limit`, { limitMB: val });
      setUsers(users.map(u => u._id === id ? { ...u, storageLimitMB: val } : u));
      toast.success(`Storage limit set to ${val} MB`);
      setEditingLimit(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update storage limit');
    }
  };

  const getRoleChipClass = (role) => {
    if (role === 'admin') return 'chip chip-admin';
    if (role === 'editor') return 'chip chip-editor';
    return 'chip chip-viewer';
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '0.8rem',
          fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0
        }}>👥 System Users</h2>
        <div className="section-header-line" />
        <span style={{
          background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)',
          border: '1px solid rgba(0,229,255,0.25)', borderRadius: '9999px',
          padding: '0.15rem 0.75rem', fontSize: '0.75rem',
          fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0
        }}>{users.length}</span>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <table className="dark-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Org</th>
              <th>Role</th>
              <th>Change Role</th>
              <th>Storage Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {u.email}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {u.organizationId || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={getRoleChipClass(u.role)}>{u.role}</span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="input-dark"
                      style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    {editingLimit === u._id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          value={limitInput}
                          onChange={e => setLimitInput(e.target.value)}
                          min={1}
                          className="input-dark"
                          style={{ width: 80, padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
                          onKeyDown={e => { if (e.key === 'Enter') saveLimit(u._id); if (e.key === 'Escape') setEditingLimit(null); }}
                          autoFocus
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MB</span>
                        <button
                          onClick={() => saveLimit(u._id)}
                          style={{
                            background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)',
                            color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)',
                            padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem',
                          }}
                        >✓</button>
                        <button
                          onClick={() => setEditingLimit(null)}
                          style={{
                            background: 'transparent', border: '1px solid var(--border)',
                            color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)',
                            padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem',
                          }}
                        >✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditLimit(u)}
                        style={{
                          background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)',
                          color: 'var(--accent-violet)', borderRadius: 'var(--radius-sm)',
                          padding: '0.3rem 0.65rem', cursor: 'pointer', fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem',
                          transition: 'var(--transition)',
                        }}
                        title="Click to change storage limit"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.08)'}
                      >
                        💾 {u.storageLimitMB ?? 500} MB
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(u._id, u.email)}
                      className="btn-danger"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      ✕ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}