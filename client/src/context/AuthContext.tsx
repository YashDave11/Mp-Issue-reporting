import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

export type UserRole = 'citizen' | 'staff' | 'moderator';

export interface AuthUser {
  username: string;
  role: UserRole;
  display_name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'pp_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session?.token && session?.user) {
          setUser(session.user);
          setToken(session.token);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Invalid credentials.');
    }
    const data = await res.json();
    const session = { token: data.token, user: data.user };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(data.user);
    setToken(data.token);
  };

  const signup = async (username: string, password: string, role: UserRole) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Sign up failed.');
    }
    const data = await res.json();
    const session = { token: data.token, user: data.user };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
