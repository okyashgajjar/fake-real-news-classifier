import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="navbar">
        <div className="landing-nav">
          <div className="navbar-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            Fake News Detector
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero hero-gradient">
        <div className="hero-content fade-in">
          <span className="hero-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Integrity through Technology
          </span>
          <h1>
            Detect Fake News with <span>AI Precision</span>
          </h1>
          <p>
            Upload any document or paste text — our ML model analyzes content in real-time
            to determine authenticity with high accuracy and intellectual rigor.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link to="/login" className="btn-secondary">Already have an account?</Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2>Advanced Analysis Features</h2>
          <div className="features-divider"></div>

          <div className="features-grid">
            {/* ML Detection */}
            <div className="feature-card glass-card feature-card-lg">
              <div className="feature-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2v2a4 4 0 0 0 8 0v-2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/></svg>
              </div>
              <h3>ML-Powered Detection</h3>
              <p>Advanced Ridge Classifier model trained on hundreds of thousands of verified articles to identify subtle linguistic patterns indicative of misinformation.</p>
              <div style={{ width: '100%', height: 160, background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(139,92,246,0.08) 100%)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginTop: 20 }}>
                <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 30% 50%, rgba(6,182,212,0.15) 0%, transparent 60%)' }} />
              </div>
            </div>

            {/* Multi-Format */}
            <div className="feature-card glass-card">
              <div>
                <div className="feature-icon tertiary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                </div>
                <h3>Multi-Format Support</h3>
                <p>Upload PDF, DOCX, PPTX, or raw text files. Our engine extracts and cleans the text automatically for analysis.</p>
              </div>
              <div className="format-badges">
                <span className="format-badge">PDF</span>
                <span className="format-badge">DOCX</span>
                <span className="format-badge">TEXT</span>
              </div>
            </div>

            {/* Real-Time Dashboard */}
            <div className="feature-card glass-card">
              <div>
                <div className="feature-icon secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3>Real-Time Dashboard</h3>
                <p>Track predictions, accuracy trends, and usage statistics with beautiful, interactive charts and clean data exports.</p>
              </div>
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '33%' }} />
                <div className="chart-bar" style={{ height: '67%', opacity: 0.7 }} />
                <div className="chart-bar" style={{ height: '100%', opacity: 0.9 }} />
                <div className="chart-bar" style={{ height: '50%', opacity: 0.5 }} />
                <div className="chart-bar" style={{ height: '83%', opacity: 0.8 }} />
              </div>
            </div>

            {/* Instant Results */}
            <div className="feature-card glass-card feature-card-wide">
              <div>
                <div className="feature-icon error">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3>Instant Results</h3>
                <p>Get prediction results with confidence scores in seconds, not minutes. Our infrastructure is optimized for enterprise-grade speed and reliability, ensuring your research is never delayed by technical bottlenecks.</p>
              </div>
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="veracity-card">
                  <div className="veracity-header">
                    <span className="label-sm" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Veracity Score</span>
                    <span style={{ fontWeight: 700 }}>98.4% Likelihood</span>
                  </div>
                  <div className="veracity-bar">
                    <div className="veracity-fill" style={{ width: '98%' }} />
                  </div>
                  <div className="veracity-status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    Trusted Source Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
              </div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Articles Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div className="stat-number">94.2%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
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
