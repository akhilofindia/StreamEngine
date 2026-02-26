export default function AuditLogTable({ logs }) {
  const getActionColor = (action = '') => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('remove')) return { color: 'var(--accent-red)', bg: 'rgba(255,68,68,0.08)' };
    if (a.includes('login') || a.includes('auth')) return { color: 'var(--accent-cyan)', bg: 'rgba(0,229,255,0.08)' };
    if (a.includes('upload') || a.includes('create')) return { color: 'var(--accent-green)', bg: 'rgba(0,255,157,0.08)' };
    if (a.includes('update') || a.includes('edit') || a.includes('role')) return { color: 'var(--accent-amber)', bg: 'rgba(255,184,0,0.08)' };
    return { color: 'var(--text-secondary)', bg: 'transparent' };
  };

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '0.8rem',
          fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0
        }}>📋 Audit Logs</h2>
        <div className="section-header-line" />
        <span style={{
          background: 'rgba(255,184,0,0.1)', color: 'var(--accent-amber)',
          border: '1px solid rgba(255,184,0,0.25)', borderRadius: '9999px',
          padding: '0.15rem 0.75rem', fontSize: '0.75rem',
          fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0
        }}>{logs.length} entries</span>
      </div>

      <div style={{
        maxHeight: '360px', overflowY: 'auto',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
      }}>
        <table className="dark-table" style={{ fontFamily: 'var(--font-mono)' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
            <tr>
              <th>Action</th>
              <th>Details</th>
              <th>Performed By</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No log entries yet
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const { color, bg } = getActionColor(log.action);
                return (
                  <tr key={log._id}>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)', background: bg,
                        color, fontSize: '0.75rem', fontWeight: 700,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        border: `1px solid ${color}30`,
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.details}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {log.performedBy?.email || 'System'}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}