import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as authApi from '../api/auth.api';
import { useAppTheme } from './ThemeContext';
import { DEFAULT_THEME } from '../theme';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // localStorage is used only as a UX hint so the app doesn't flash the login page
  // on every refresh when the cookie is still valid. The cookie is the real auth guard.
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const { loadThemeFromApi, setTheme } = useAppTheme();

  // Re-sync theme from API on every page load when already logged in
  useEffect(() => {
    if (isAuthenticated) {
      loadThemeFromApi();
    }
  }, []);

  const login = async (username: string, password: string) => {
    await authApi.login(username, password);
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
    await loadThemeFromApi();
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('theme');
    setIsAuthenticated(false);
    setTheme(DEFAULT_THEME);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
