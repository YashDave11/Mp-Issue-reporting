import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { ShieldAlert, Loader2, ArrowRight, Eye, EyeOff, ChevronDown } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('citizen');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      if (isLogin) {
        await login(username, password);
      } else {
        await signup(username, password, role);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setIsLogin(true);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        background: 'linear-gradient(180deg, #f5f3ff 0%, #f4f6fa 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: 56, height: 56, borderRadius: '14px',
              background: 'linear-gradient(135deg, #613af5 0%, #9b6dff 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 20px rgba(97,58,245,0.3)',
            }}
          >
            <ShieldAlert size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1040', margin: 0 }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Peoples Priorities AI · Jodhpur
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#fff', borderRadius: '20px', padding: '28px 28px 24px',
            boxShadow: '0 4px 32px rgba(97,58,245,0.1)',
            border: '1px solid #ede9fe',
          }}
        >
          {error && (
            <div
              style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
                padding: '10px 14px', fontSize: '0.83rem', color: '#b91c1c', marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Toggle tabs */}
            <div
              style={{
                display: 'flex', background: '#f5f3ff', borderRadius: '10px',
                padding: '3px', marginBottom: '20px',
              }}
            >
              {['Sign In', 'Sign Up'].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setIsLogin(i === 0); setError(null); }}
                  style={{
                    flex: 1, border: 'none', borderRadius: '8px', padding: '7px',
                    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    background: (isLogin ? i === 0 : i === 1) ? '#fff' : 'transparent',
                    color: (isLogin ? i === 0 : i === 1) ? '#613af5' : '#999',
                    boxShadow: (isLogin ? i === 0 : i === 1) ? '0 1px 6px rgba(97,58,245,0.12)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. citizen_jodhpur"
                required
                style={{
                  width: '100%', border: '1.5px solid #e0d9ff', borderRadius: '10px',
                  padding: '10px 14px', fontSize: '0.9rem', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#613af5')}
                onBlur={e => (e.target.style.borderColor = '#e0d9ff')}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', border: '1.5px solid #e0d9ff', borderRadius: '10px',
                    padding: '10px 40px 10px 14px', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#613af5')}
                  onBlur={e => (e.target.style.borderColor = '#e0d9ff')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  style={{
                    width: '100%', border: '1.5px solid #e0d9ff', borderRadius: '10px',
                    padding: '10px 14px', fontSize: '0.88rem', outline: 'none',
                    boxSizing: 'border-box', background: '#fff', cursor: 'pointer',
                  }}
                >
                  <option value="citizen">Citizen (नागरिक)</option>
                  <option value="staff">MP Office Staff</option>
                  <option value="moderator">Analyst / Moderator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#c4b5fd' : 'linear-gradient(135deg, #613af5 0%, #7c5aff 100%)',
                border: 'none', borderRadius: '10px', padding: '12px',
                color: '#fff', fontWeight: 700, fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: '8px', transition: 'background 0.2s',
              }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo credentials — collapsible */}
        <div
          style={{
            marginTop: 16, background: '#fff', borderRadius: '14px',
            border: '1px solid #ede9fe', overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            style={{
              width: '100%', background: 'none', border: 'none',
              padding: '12px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: '0.78rem', color: '#613af5', fontWeight: 700,
            }}
          >
            <span>🔑 Demo Credentials (Hackathon)</span>
            <ChevronDown size={14} style={{ transform: showDemo ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
          </button>
          {showDemo && (
            <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Citizen', user: 'citizen', pass: 'citizen123' },
                { label: 'MP Staff', user: 'staff', pass: 'staff123' },
                { label: 'Moderator', user: 'moderator', pass: 'mod123' },
              ].map(({ label, user, pass }) => (
                <button
                  key={user}
                  type="button"
                  onClick={() => fillDemo(user, pass)}
                  style={{
                    background: '#f5f3ff', border: 'none', borderRadius: '8px',
                    padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
                    fontSize: '0.78rem', color: '#444',
                  }}
                >
                  <strong>{label}:</strong> {user} / <em>{pass}</em>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-3">
          <Link to="/" style={{ fontSize: '0.78rem', color: '#888', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
