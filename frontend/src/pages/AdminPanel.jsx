import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

export default function AdminPanel({ onLogout }) {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE}/api/admin/predictions`, { headers }).then(r => r.json()),
      fetch(`${API_BASE}/api/dashboard/stats`, { headers }).then(r => r.json()),
    ]).then(([p, s]) => {
      setPredictions(p);
      setStats(s);
    }).catch(console.error);
  }, []);

  const totalPages = Math.ceil(predictions.length / perPage);
  const paginated = predictions.slice((page - 1) * perPage, page * perPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/dashboard" className="navbar-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              Fake News Detector
            </Link>
            <nav className="navbar-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/predict">Predict</Link>
              <Link to="/admin" className="active">Admin</Link>
            </nav>
          </div>
          <div className="navbar-actions">
            <div className="user-badge">
              <div className="user-avatar"><img src={`https://ui-avatars.com/api/?name=${user.username || 'U'}&background=F0EDE6&color=C96442&bold=true`} alt="avatar" /></div>
              <span>{user.username || 'User'}</span>
            </div>
            <button className="btn-nav" onClick={() => { onLogout(); navigate('/login', { replace: true }); }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container admin-page">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
            <h1 className="headline-lg">Admin Panel</h1>
          </div>
          <p className="body-md" style={{ color: 'var(--text-secondary)', maxWidth: 640 }}>
            All prediction logs — monitor system integrity, review model outputs, and track historical veracity assessments.
          </p>
        </div>

        {/* Stats Row */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Predictions</div>
            <div className="admin-stat-value">{stats?.totalPredictions ?? '—'}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Authenticity Rate</div>
            <div className="admin-stat-value" style={{ color: 'var(--success)' }}>
              {stats?.totalPredictions ? `${Math.round((stats.realCount / stats.totalPredictions) * 100)}%` : '—'}
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Avg. Confidence</div>
            <div className="admin-stat-value" style={{ color: 'var(--accent-primary)' }}>
              {stats?.accuracy ? `${stats.accuracy}%` : '—'}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Username
                    </div>
                  </th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      Format
                    </div>
                  </th>
                  <th style={{ minWidth: 300 }}>Extracted Text</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <p>No predictions yet</p>
                    </td>
                  </tr>
                ) : paginated.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.username}</td>
                    <td>
                      <span className={`badge ${p.file_format === 'PDF' ? 'badge-pdf' : 'badge-text'}`}>
                        {p.file_format || 'TEXT'}
                      </span>
                    </td>
                    <td className="truncate">
                      {p.extracted_text || p.original_text || '—'}
                    </td>
                    <td>
                      <div className="prediction-badge">
                        <span className={`prediction-dot ${p.prediction === 'REAL' ? 'real' : 'fake'}`} />
                        <span className={`prediction-text ${p.prediction === 'REAL' ? 'real' : 'fake'}`}>
                          {p.prediction}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {p.confidence_low != null
                        ? `${Math.round(p.confidence_low * 100)}–${Math.round(p.confidence_high * 100)}%`
                        : p.confidence != null ? `${Math.round(p.confidence * 100)}%` : '—'
                      }
                    </td>
                    <td style={{ color: 'var(--text-tertiary)' }}>{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="admin-pagination">
            <span className="pagination-info">Showing {paginated.length} of {predictions.length.toLocaleString()} entries</span>
            <div className="pagination-buttons">
              <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
              <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer" style={{ marginTop: 'var(--section-gap)' }}>
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-brand">Fake News Detector</span>
            <span className="footer-copy">© 2024 Fake News Detector — Powered by Machine Learning</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">API Documentation</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
