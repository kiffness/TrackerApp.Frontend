import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import BloodPressurePage from './pages/BloodPressurePage';
import ScratchCardsPage from './pages/ScratchCardsPage';
import ScratchCardSummaryPage from './pages/ScratchCardSummaryPage';

export default function App() {
  return (
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
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
