import { useEffect, useState } from 'react';
import {
  Alert,
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
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ScratchCard } from '../types/api.types';
import * as api from '../api/scratchCards.api';
import AddScratchCardDialog from '../components/AddScratchCardDialog';

const fmt = (n: number) => `£${n.toFixed(2)}`;

export default function ScratchCardsPage() {
  const [cards, setCards] = useState<ScratchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      setCards(res.data.value);
    } catch {
      setError('Failed to load scratch cards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.remove(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Failed to delete entry.');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Scratch Cards</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Card
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : cards.length === 0 ? (
        <Typography color="text.secondary">No cards yet. Add your first one!</Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Winnings</TableCell>
                <TableCell align="right">Net</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{new Date(c.purchasedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">{fmt(c.cost)}</TableCell>
                  <TableCell align="right">{fmt(c.winnings)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: c.net >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}
                  >
                    {c.net >= 0 ? '+' : ''}{fmt(c.net)}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontStyle: c.notes ? 'normal' : 'italic' }}>
                    {c.notes ?? '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddScratchCardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdded={() => { setDialogOpen(false); fetchCards(); }}
      />
    </Box>
  );
}
