import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';
import { AppThemeProvider, useAppTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import BloodPressurePage from './pages/BloodPressurePage';
import ScratchCardsPage from './pages/ScratchCardsPage';
import ScratchCardSummaryPage from './pages/ScratchCardSummaryPage';
import ScratchCardReportsPage from './pages/ScratchCardReportsPage';
import SettingsPage from './pages/SettingsPage';

function ThemedApp() {
  const { themeId } = useAppTheme();
  const theme = useMemo(() => createAppTheme(themeId), [themeId]);

  return (
    <MuiThemeProvider theme={theme}>
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
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  );
}
