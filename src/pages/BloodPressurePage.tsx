import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Alert,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BloodPressureReading } from '../types/api.types';
import * as api from '../api/bloodPressure.api';
import AddBloodPressureDialog from '../components/AddBloodPressureDialog';

// Simple classification based on NHS/BHF guidelines
function getCategory(systolic: number, diastolic: number): { label: string; color: 'success' | 'warning' | 'error' | 'default' } {
  if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: 'success' };
  if (systolic < 130 && diastolic < 80) return { label: 'Elevated', color: 'warning' };
  if (systolic < 140 || diastolic < 90) return { label: 'High (Stage 1)', color: 'warning' };
  return { label: 'High (Stage 2)', color: 'error' };
}

export default function BloodPressurePage() {
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      setReadings(res.data.value);
    } catch {
      setError('Failed to load readings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReadings(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.remove(id);
      setReadings((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Failed to delete reading.');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Blood Pressure</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Reading
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : readings.length === 0 ? (
        <Typography color="text.secondary">No readings yet. Add your first one!</Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell align="center">Systolic</TableCell>
                <TableCell align="center">Diastolic</TableCell>
                <TableCell align="center">Pulse</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {readings.map((r) => {
                const cat = getCategory(r.systolic, r.diastolic);
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>{new Date(r.recordedAt).toLocaleString()}</TableCell>
                    <TableCell align="center"><strong>{r.systolic}</strong></TableCell>
                    <TableCell align="center"><strong>{r.diastolic}</strong></TableCell>
                    <TableCell align="center">{r.pulse}</TableCell>
                    <TableCell>
                      <Chip label={cat.label} color={cat.color} size="small" />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontStyle: r.notes ? 'normal' : 'italic' }}>
                      {r.notes ?? '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddBloodPressureDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdded={() => { setDialogOpen(false); fetchReadings(); }}
      />
    </Box>
  );
}
