import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Alert,
} from '@mui/material';
import * as api from '../api/scratchCards.api';

const CARD_VALUES = [1, 2, 3, 5];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddScratchCardDialog({ open, onClose, onAdded }: Props) {
  const [cost, setCost] = useState<number | ''>('');
  const [winnings, setWinnings] = useState('');
  const [purchasedAt, setPurchasedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setCost(''); setWinnings(''); setPurchasedAt(''); setNotes(''); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.add({
        cost: cost as number,
        winnings: Number(winnings),
        purchasedAt: purchasedAt ? new Date(purchasedAt).toISOString() : null,
        notes: notes || null,
      });
      reset();
      onAdded();
    } catch (err: any) {
      const detail = err.response?.data?.detail ?? 'Failed to add scratch card.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Scratch Card</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <FormControl required fullWidth>
            <InputLabel>Card Value</InputLabel>
            <Select
              value={cost}
              label="Card Value"
              onChange={(e) => setCost(e.target.value as number)}
            >
              {CARD_VALUES.map((v) => (
                <MenuItem key={v} value={v}>£{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Winnings (£)"
            type="number"
            value={winnings}
            onChange={(e) => setWinnings(e.target.value)}
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            helperText="Enter 0 for a losing card"
          />
          <TextField
            label="Purchased At (optional)"
            type="datetime-local"
            value={purchasedAt}
            onChange={(e) => setPurchasedAt(e.target.value)}
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
          disabled={loading || cost === '' || winnings === ''}
        >
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
