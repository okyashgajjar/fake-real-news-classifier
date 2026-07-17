import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_BASE } from '../config';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

    fetch(`${API_BASE}/api/dashboard/stats`, { headers })
      .then(r => r.json())
      .then(d => setStats({
        totalPredictions: d.totalPredictions,
        realCount: d.realCount,
        fakeCount: d.fakeCount,
        totalUsers: d.totalUsers,
        accuracy: d.accuracy,
      })).catch(() => {});

    fetch(`${API_BASE}/api/dashboard/logins`, { headers })
      .then(r => r.json())
      .then(d => setDailyTrends(d)).catch(() => {});

    fetch(`${API_BASE}/api/dashboard/distribution`, { headers })
      .then(r => r.json())
      .then(d => setModelPerformance(d)).catch(() => {});

    fetch(`${API_BASE}/api/dashboard/model-usage`, { headers })
      .then(r => r.json())
      .then(d => setUserGrowth(d)).catch(() => {});
  }, []);

  const [stats, setStats] = useState({
    totalPredictions: 0,
    realCount: 0,
    fakeCount: 0,
    totalUsers: 0,
    accuracy: 0,
  });

  const [dailyTrends, setDailyTrends] = useState([]);
  const [modelPerformance, setModelPerformance] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);

  const chartColors = {
    primary: '#C96442',
    green: '#2D8659',
    red: '#C4453E',
    secondary: '#9A6B4C',
    gridStroke: 'rgba(0,0,0,0.06)',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 10,
          padding: '12px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
          <p style={{ color: '#1A1A1A', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color, fontSize: 13 }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/dashboard" className="navbar-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              Fake News Detector
            </Link>
            <div className="navbar-links">
              <Link to="/dashboard" className="active">Dashboard</Link>
              <Link to="/predict">Predict</Link>
              <Link to="/admin">Admin</Link>
            </div>
          </div>
          <div className="navbar-actions">
            <div className="user-badge">
              <div className="user-avatar"><img src={`https://ui-avatars.com/api/?name=${user.username || 'U'}&background=F0EDE6&color=C96442&bold=true`} alt="avatar" /></div>
              <span>{user.username || 'User'}</span>
            </div>
            <button className="btn-nav" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="container section-gap">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="headline-xl">Dashboard</h1>
          <p>Overview of Fake News Detector usage and performance metrics for the current period.</p>
        </header>

        {/* Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
            </div>
            <div className="metric-label">Total Predictions</div>
            <div className="metric-value">{stats?.totalPredictions ?? '—'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
              </div>
            </div>
            <div className="metric-label">Real News Detected</div>
            <div className="metric-value">{stats?.realCount ?? '—'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
            </div>
            <div className="metric-label">Fake News Detected</div>
            <div className="metric-value">{stats?.fakeCount ?? '—'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div className="metric-label">Total Users</div>
            <div className="metric-value">{stats?.totalUsers ?? '—'}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-bento">
          <div className="chart-card span-6">
            <h2 className="headline-sm">Activity by Day</h2>
            <p>Number of predictions made each day of the week.</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyTrends} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8A8A8A' }} axisLine={{ stroke: 'rgba(0,0,0,0.06)' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201, 100, 66, 0.04)' }} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C96442" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#9A6B4C" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="logins" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card span-6">
            <h2 className="headline-sm">Prediction Distribution</h2>
            <p>Proportion of real vs. fake news predictions.</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modelPerformance}
                    cx="50%" cy="45%"
                    innerRadius={75} outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={0}
                  >
                    {modelPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? chartColors.green : chartColors.red} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="700" fill="#1A1A1A">{stats?.totalPredictions ?? '—'}</text>
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#8A8A8A">Predictions</text>
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {modelPerformance.map((entry, index) => (
                  <div key={`legend-${index}`} className="pie-legend-item">
                    <span className="pie-legend-dot" style={{ background: index === 0 ? chartColors.green : chartColors.red }} />
                    <span className="pie-legend-label">{entry.name}</span>
                    <span className="pie-legend-value">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card span-12">
            <h2 className="headline-sm">User Growth</h2>
            <p>Cumulative user registrations over time.</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={userGrowth} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8A8A8A' }} axisLine={{ stroke: 'rgba(0,0,0,0.06)' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(154, 107, 76, 0.04)' }} />
                  <defs>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9A6B4C" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#C96442" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="users" fill="url(#barGrad2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
