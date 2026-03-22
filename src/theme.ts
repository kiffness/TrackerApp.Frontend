import { createTheme } from '@mui/material/styles';

export type ThemeId =
  | 'cyan-light'
  | 'sage-light'
  | 'violet-light'
  | 'cyan-dark'
  | 'sage-dark'
  | 'violet-dark';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
}

export const THEMES: ThemeMeta[] = [
  { id: 'cyan-light',   name: 'Cyan',   mode: 'light', primary: '#0097a7', secondary: '#ef6c00' },
  { id: 'sage-light',   name: 'Sage',   mode: 'light', primary: '#5f8575', secondary: '#8d6e63' },
  { id: 'violet-light', name: 'Violet', mode: 'light', primary: '#7b1fa2', secondary: '#f57c00' },
  { id: 'cyan-dark',    name: 'Cyan',   mode: 'dark',  primary: '#00bcd4', secondary: '#ff9800' },
  { id: 'sage-dark',    name: 'Sage',   mode: 'dark',  primary: '#81a890', secondary: '#ffb74d' },
  { id: 'violet-dark',  name: 'Violet', mode: 'dark',  primary: '#ce93d8', secondary: '#ffcc80' },
];

export const DEFAULT_THEME: ThemeId = 'sage-dark';

export function createAppTheme(themeId: ThemeId) {
  const meta = THEMES.find((t) => t.id === themeId) ?? THEMES.find((t) => t.id === DEFAULT_THEME)!;

  return createTheme({
    palette: {
      mode: meta.mode,
      primary: { main: meta.primary },
      secondary: { main: meta.secondary },
    },
    shape: { borderRadius: 8 },
  });
}
