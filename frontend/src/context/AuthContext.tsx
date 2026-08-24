import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import * as api from '../services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, timezone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token'),
  );
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount if we have a token
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const loginFn = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const signupFn = useCallback(
    async (email: string, password: string, timezone: string) => {
      const res = await api.signup(email, password, timezone);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login: loginFn, signup: signupFn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
