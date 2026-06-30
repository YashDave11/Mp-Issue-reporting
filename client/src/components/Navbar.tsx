import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShieldAlert, Award } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="navbar-custom">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand">
          <Award className="text-primary" size={28} />
          <div className="d-flex flex-column">
            <span style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1 }}>PEOPLES PRIORITIES AI</span>
            <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600, letterSpacing: '0.05rem' }}>CONSTITUENCY ENGINE</span>
          </div>
        </Link>

        <div className="d-flex gap-2">
          <Link 
            to="/" 
            className={`btn ${!isDashboard ? 'btn-primary' : 'btn-light'}`}
            style={{ borderRadius: '20px' }}
          >
            <User size={16} />
            <span>Citizen Portal</span>
          </Link>
          <Link 
            to="/dashboard" 
            className={`btn ${isDashboard ? 'btn-primary' : 'btn-light'}`}
            style={{ borderRadius: '20px' }}
          >
            <ShieldAlert size={16} />
            <span>Staff Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
