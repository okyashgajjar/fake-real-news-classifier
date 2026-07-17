import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

export default function Predict({ onLogout }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [dragover, setDragover] = useState(false);
  const indicatorRef = useRef(null);
  const textTabRef = useRef(null);
  const fileTabRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const updateIndicator = () => {
      const activeTab = tab === 'text' ? textTabRef.current : fileTabRef.current;
      if (indicatorRef.current && activeTab) {
        indicatorRef.current.style.left = activeTab.offsetLeft + 'px';
        indicatorRef.current.style.width = activeTab.offsetWidth + 'px';
      }
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [tab]);

  const handlePredict = async () => {
    const content = tab === 'text' ? text : null;
    if (tab === 'text' && !text.trim()) return;
    if (tab === 'file' && !file) return;
    setLoading(true);
    setResult(null);
    setExtractedText('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      if (tab === 'text') {
        const res = await fetch(`${API_BASE}/api/predict`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, username: user.username }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Prediction failed');
        setResult(data);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', user.username);
        const res = await fetch(`${API_BASE}/api/predict/upload`, {
          method: 'POST',
          headers,
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Prediction failed');
        setResult(data);
        setExtractedText(data.extractedText || '');
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/dashboard" className="navbar-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              Fake News Detector
            </Link>
            <div className="navbar-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/predict" className="active">Predict</Link>
              <Link to="/admin">Admin</Link>
            </div>
          </div>
          <div className="navbar-actions">
            <div className="user-badge">
              <div className="user-avatar"><img src={`https://ui-avatars.com/api/?name=${user.username || 'U'}&background=F0EDE6&color=C96442&bold=true`} alt="avatar" /></div>
              <span>{user.username || 'User'}</span>
            </div>
            <button className="btn-nav" onClick={() => { onLogout(); navigate('/login', { replace: true }); }}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="predict-page container">
        {/* Header */}
        <header className="predict-header">
          <div className="predict-header-top">
            <div className="predict-header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2v2a4 4 0 0 0 8 0v-2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/></svg>
            </div>
            <h1 className="headline-xl">Predict</h1>
          </div>
          <p className="body-lg" style={{ color: 'var(--text-secondary)', maxWidth: 640 }}>
            Analyze news content using our advanced neural linguistic models to detect potential misinformation and factual inconsistencies.
          </p>
        </header>

        {/* Prediction Card */}
        <div className="predict-card">
          {/* Tabs */}
          <div className="predict-tabs">
            <button
              ref={textTabRef}
              className={`predict-tab ${tab === 'text' ? 'active' : ''}`}
              onClick={() => setTab('text')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
              Text Input
            </button>
            <button
              ref={fileTabRef}
              className={`predict-tab ${tab === 'file' ? 'active' : ''}`}
              onClick={() => setTab('file')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
              File Upload
            </button>
            <div ref={indicatorRef} className="tab-indicator" />
          </div>

          {/* Content */}
          <div className="predict-content">
            {/* Text Pane */}
            {tab === 'text' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                  <span className="label-sm">News Content</span>
                </div>
                <textarea
                  className="predict-textarea"
                  placeholder="Paste the news article content here for deep analysis..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="predict-actions">
                  <span className="char-count">{text.length} characters</span>
                  <button className="btn-detect" onClick={handlePredict} disabled={loading || !text.trim()}>
                    {loading ? <div className="spinner" style={{ borderColor: 'transparent', borderTopColor: 'white' }} /> : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2v2a4 4 0 0 0 8 0v-2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/></svg>
                    )}
                    Detect Credibility
                  </button>
                </div>
              </div>
            )}

            {/* File Pane */}
            {tab === 'file' && (
              <div>
                {!file ? (
                  <div
                    className={`upload-dropzone ${dragover ? 'dragover' : ''}`}
                    onClick={() => document.getElementById('file-input').click()}
                    onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                    onDragLeave={() => setDragover(false)}
                    onDrop={handleDrop}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.docx,.pptx,.txt"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <div className="upload-icon-wrap">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                    </div>
                    <h3>Drop document here</h3>
                    <p>Or click to browse your computer<br /><span style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6, display: 'block' }}>Supported formats: PDF, DOCX, PPTX, TXT (Max 10MB)</span></p>
                    <div className="upload-formats">
                      <span className="upload-format">PDF</span>
                      <span className="upload-format">DOCX</span>
                      <span className="upload-format">TXT</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="file-preview">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      <span className="file-preview-name">{file.name}</span>
                      <button className="btn-icon" onClick={() => setFile(null)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                    <div className="predict-actions">
                      <div />
                      <button className="btn-detect" onClick={handlePredict} disabled={loading}>
                        {loading ? <div className="spinner" style={{ borderColor: 'transparent', borderTopColor: 'white' }} /> : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2v2a4 4 0 0 0 8 0v-2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/></svg>
                        )}
                        Detect Credibility
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Results */}
            {result && !result.error && (
              <>
                <div className={`result-box ${result.prediction === 'REAL' ? 'real' : 'fake'}`}>
                  {result.prediction === 'REAL' ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  )}
                  This article is {result.prediction === 'REAL' ? 'Likely Real' : 'Likely Fake'}
                </div>

                {/* Confidence Interval */}
                <div className="confidence-interval" style={{ marginTop: 16 }}>
                  <span className="confidence-label">
                    {result.confidence_low != null ? `${Math.round(result.confidence_low * 100)}–${Math.round(result.confidence_high * 100)}%` : `${Math.round(result.confidence * 100)}%`}
                  </span>
                  <div className="confidence-bar">
                    <div
                      className={`confidence-fill ${result.prediction === 'REAL' ? 'real' : 'fake'}`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="confidence-label">Confidence</span>
                </div>

                {extractedText && (
                  <div className="extracted-section">
                    <div className="extracted-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      Extracted Text
                    </div>
                    <div className="extracted-text">{extractedText}</div>
                  </div>
                )}
              </>
            )}

            {result?.error && (
              <div className="result-box fake" style={{ marginTop: 16 }}>{result.error}</div>
            )}
          </div>
        </div>

        {/* Guidance */}
        <div className="guidance-grid">
          <div className="guidance-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m11 8-2 2 4 2"/></svg>
            <h4>Linguistic Analysis</h4>
            <p>Analyzes sentence structure, emotional bias, and hyperbolic language common in fake news.</p>
          </div>
          <div className="guidance-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
            <h4>Fact Cross-Check</h4>
            <p>Cross-references key statements against a verified global knowledge base of trusted reporting.</p>
          </div>
          <div className="guidance-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <h4>Privacy First</h4>
            <p>Your content is processed securely and never stored. All analysis happens in a transient sandbox.</p>
          </div>
        </div>
      </main>

      <footer className="footer" style={{ marginTop: 'auto' }}>
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
