import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_THEME, type ThemeId } from '../theme';
import * as preferencesApi from '../api/preferences.api';

interface ThemeContextValue {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  loadThemeFromApi: () => Promise<void>;
  saveThemeToApi: (id: ThemeId) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(
    () => (localStorage.getItem('theme') as ThemeId) ?? DEFAULT_THEME
  );

  const setTheme = (id: ThemeId) => {
    localStorage.setItem('theme', id);
    setThemeId(id);
  };

  const loadThemeFromApi = async () => {
    try {
      const res = await preferencesApi.get();
      setTheme(res.data.value.theme as ThemeId);
    } catch {
      // Not logged in or API unavailable — keep localStorage value
    }
  };

  const saveThemeToApi = async (id: ThemeId) => {
    setTheme(id);
    await preferencesApi.update(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setTheme, loadThemeFromApi, saveThemeToApi }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return ctx;
}
