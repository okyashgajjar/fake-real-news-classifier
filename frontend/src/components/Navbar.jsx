import { Link, useLocation } from 'react-router-dom';
import { Newspaper, LayoutDashboard, Brain, ClipboardList, LogOut } from 'lucide-react';

function Navbar({ onLogout }) {
  const location = useLocation();
  const username = localStorage.getItem('username') || 'User';

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <Newspaper size={24} />
        Fake News Detector
      </Link>
      <div className="navbar-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/predict" className={location.pathname === '/predict' ? 'active' : ''}>
          <Brain size={18} />
          Predict
        </Link>
        <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
          <ClipboardList size={18} />
          Admin
        </Link>
        <span className="user-badge">{username}</span>
        <button className="btn-logout" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
