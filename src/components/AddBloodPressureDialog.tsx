import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import * as api from '../api/bloodPressure.api';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddBloodPressureDialog({ open, onClose, onAdded }: Props) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [recordedAt, setRecordedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setSystolic(''); setDiastolic(''); setPulse('');
    setRecordedAt(''); setNotes(''); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.add({
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        pulse: Number(pulse),
        recordedAt: recordedAt ? new Date(recordedAt).toISOString() : null,
        notes: notes || null,
      });
      reset();
      onAdded();
    } catch (err: any) {
      const detail = err.response?.data?.detail ?? 'Failed to add reading.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Blood Pressure Reading</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Systolic (mmHg)"
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Diastolic (mmHg)"
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Pulse (bpm)"
            type="number"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Recorded At (optional)"
            type="datetime-local"
            value={recordedAt}
            onChange={(e) => setRecordedAt(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
            inputProps={{ maxLength: 500 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !systolic || !diastolic || !pulse}
        >
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
