import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';
import { ColorModeContext } from './contexts/ColorModeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import BloodPressurePage from './pages/BloodPressurePage';
import ScratchCardsPage from './pages/ScratchCardsPage';
import ScratchCardSummaryPage from './pages/ScratchCardSummaryPage';
import ScratchCardReportsPage from './pages/ScratchCardReportsPage';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('colorMode') as 'light' | 'dark') ?? 'dark'
  );

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('colorMode', next);
        return next;
      });
    },
  }), []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/blood-pressure" replace />} />
              <Route path="/blood-pressure" element={<BloodPressurePage />} />
              <Route path="/scratch-cards" element={<ScratchCardsPage />} />
              <Route path="/scratch-cards/summary" element={<ScratchCardSummaryPage />} />
              <Route path="/scratch-cards/reports" element={<ScratchCardReportsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
