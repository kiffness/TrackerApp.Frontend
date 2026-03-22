import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Switch,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { THEMES, type ThemeId } from '../theme';
import { useAppTheme } from '../contexts/ThemeContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function SettingsPage() {
  const { themeId, saveThemeToApi } = useAppTheme();
  const push = usePushNotifications();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSelect = async (id: ThemeId) => {
    if (id === themeId || saving) return;
    setSaving(true);
    setError('');
    try {
      await saveThemeToApi(id);
      setSuccess(true);
    } catch {
      setError('Failed to save theme.');
    } finally {
      setSaving(false);
    }
  };

  const lightThemes = THEMES.filter((t) => t.mode === 'light');
  const darkThemes = THEMES.filter((t) => t.mode === 'dark');

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Typography variant="h6" fontWeight={600} mb={2}>Theme</Typography>

      <Typography variant="subtitle2" color="text.secondary" mb={1}>Light</Typography>
      <Grid container spacing={2} mb={3}>
        {lightThemes.map((t) => (
          <Grid item xs={12} sm={4} key={t.id}>
            <ThemeCard
              meta={t}
              selected={themeId === t.id}
              onSelect={() => handleSelect(t.id)}
              disabled={saving}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle2" color="text.secondary" mb={1}>Dark</Typography>
      <Grid container spacing={2}>
        {darkThemes.map((t) => (
          <Grid item xs={12} sm={4} key={t.id}>
            <ThemeCard
              meta={t}
              selected={themeId === t.id}
              onSelect={() => handleSelect(t.id)}
              disabled={saving}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={600} mb={2}>Notifications</Typography>

      {!push.isSupported ? (
        <Alert severity="info">Push notifications are not supported in this browser.</Alert>
      ) : (
        <Box>
          {push.error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>{push.error}</Alert>}
          <Box display="flex" alignItems="center" justifyContent="space-between"
            sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {push.isSubscribed
                ? <NotificationsIcon color="primary" />
                : <NotificationsOffIcon color="disabled" />}
              <Box>
                <Typography fontWeight={600}>Blood Pressure Reminders</Typography>
                <Typography variant="body2" color="text.secondary">
                  {push.isSubscribed
                    ? 'You will receive a daily reminder to log your blood pressure.'
                    : 'Get a daily reminder to log your blood pressure.'}
                </Typography>
              </Box>
            </Box>
            {push.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Switch
                checked={push.isSubscribed}
                onChange={push.isSubscribed ? push.unsubscribe : push.subscribe}
              />
            )}
          </Box>
        </Box>
      )}

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="Theme saved"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

interface ThemeCardProps {
  meta: (typeof THEMES)[number];
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

function ThemeCard({ meta, selected, onSelect, disabled }: ThemeCardProps) {
  return (
    <Card
      elevation={selected ? 4 : 1}
      sx={{
        outline: selected ? '2px solid' : '2px solid transparent',
        outlineColor: selected ? 'primary.main' : 'transparent',
        transition: 'outline-color 0.15s, box-shadow 0.15s',
      }}
    >
      <CardActionArea onClick={onSelect} disabled={disabled}>
        {/* Color swatches */}
        <Box display="flex" height={56}>
          <Box sx={{ flex: 1, bgcolor: meta.primary }} />
          <Box sx={{ flex: 1, bgcolor: meta.secondary }} />
        </Box>

        <CardContent sx={{ py: 1.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              {meta.mode === 'dark' ? (
                <DarkModeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              ) : (
                <LightModeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              )}
              <Typography variant="body1" fontWeight={600}>{meta.name}</Typography>
            </Box>
            {selected && <CheckCircleIcon fontSize="small" color="primary" />}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
