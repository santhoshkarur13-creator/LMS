import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="navbar glass-panel animate-fade-in">
      <Link to="/catalog" className="nav-brand">
        <BookOpen size={28} />
        <span>Lumina Library</span>
      </Link>

      <div className="nav-links">
        <Link to="/catalog" className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`}>Catalog</Link>
        {user.role === 'admin' ? (
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin Dashboard</Link>
        ) : (
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>My Dashboard</Link>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <UserIcon size={18} />
            {user.name} ({user.role})
          </span>
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
