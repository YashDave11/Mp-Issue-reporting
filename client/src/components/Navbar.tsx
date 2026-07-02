import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart2, User, ShieldAlert, LogOut, LogIn, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LANG_KEY = 'pp_lang';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';

  const currentLang = (localStorage.getItem(LANG_KEY) || 'en') as 'en' | 'hi';
  const toggleLang = () => {
    const next = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem(LANG_KEY, next);
    window.location.reload(); // simple re-render — CitizenHome reads from localStorage on mount
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      style={{
        background: '#fff',
        borderBottom: '1px solid #ede9fe',
        padding: '0.6rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 8px rgba(97,58,245,0.07)',
      }}
    >
      <div className="container d-flex justify-content-between align-items-center" style={{ maxWidth: 900 }}>
        {/* Brand */}
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div
            style={{
              width: 34, height: 34, borderRadius: '9px',
              background: 'linear-gradient(135deg, #613af5 0%, #9b6dff 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BarChart2 size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1a1040', lineHeight: 1.1 }}>Peoples Priorities</div>
            <div style={{ fontSize: '0.6rem', color: '#613af5', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI · Jodhpur</div>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="d-flex align-items-center gap-2">
          {/* Language toggle — visible everywhere except login */}
          {!isLogin && (
            <button
              onClick={toggleLang}
              title="Toggle language"
              style={{
                background: 'none', border: '1.5px solid #ddd', borderRadius: '20px',
                padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#555',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Globe size={13} />
              {currentLang === 'en' ? 'हिंदी' : 'English'}
            </button>
          )}

          {/* Citizen portal link */}
          {!isLogin && (
            <Link
              to="/"
              className="d-flex align-items-center gap-1"
              style={{
                textDecoration: 'none',
                fontSize: '0.8rem', fontWeight: 600,
                color: !isDashboard ? '#613af5' : '#888',
                padding: '5px 10px',
                borderRadius: '20px',
                background: !isDashboard ? '#f0ebff' : 'transparent',
              }}
            >
              <User size={14} />
              <span className="d-none d-sm-inline">Citizen</span>
            </Link>
          )}

          {/* Staff dashboard link — only for staff/moderator */}
          {isAuthenticated && (user?.role === 'staff' || user?.role === 'moderator') && (
            <Link
              to="/dashboard"
              className="d-flex align-items-center gap-1"
              style={{
                textDecoration: 'none',
                fontSize: '0.8rem', fontWeight: 600,
                color: isDashboard ? '#613af5' : '#888',
                padding: '5px 10px',
                borderRadius: '20px',
                background: isDashboard ? '#f0ebff' : 'transparent',
              }}
            >
              <ShieldAlert size={14} />
              <span className="d-none d-sm-inline">Dashboard</span>
            </Link>
          )}

          {/* Auth button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              title={`Sign out (${user?.username})`}
              style={{
                background: 'none', border: '1.5px solid #ddd', borderRadius: '20px',
                padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, color: '#555',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <LogOut size={13} />
              <span className="d-none d-sm-inline">{user?.display_name || user?.username}</span>
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                background: '#613af5', color: '#fff', textDecoration: 'none',
                borderRadius: '20px', padding: '5px 14px',
                fontSize: '0.78rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
