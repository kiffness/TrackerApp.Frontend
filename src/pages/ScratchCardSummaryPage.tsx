import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CasinoIcon from '@mui/icons-material/Casino';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { ScratchCardSummary, SummaryPeriod } from '../types/api.types';
import * as api from '../api/scratchCards.api';

const fmt = (n: number) => `£${Math.abs(n).toFixed(2)}`;

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <Card elevation={1}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
            <Typography variant="h5" fontWeight={700} color={color}>{value}</Typography>
          </Box>
          <Box sx={{ color: color ?? 'text.secondary', opacity: 0.8 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ScratchCardSummaryPage() {
  const [period, setPeriod] = useState<SummaryPeriod>('month');
  const [summary, setSummary] = useState<ScratchCardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async (p: SummaryPeriod) => {
    setLoading(true);
    try {
      const res = await api.getSummary(p);
      setSummary(res.data.value);
    } catch {
      setError('Failed to load summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(period); }, [period]);

  const isProfit = (summary?.netProfit ?? 0) >= 0;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Scratch Card Summary</Typography>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value as SummaryPeriod)}
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : summary && (
        <>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Cards Bought"
                value={String(summary.cardCount)}
                icon={<CasinoIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Total Spent"
                value={fmt(summary.totalSpent)}
                icon={<AttachMoneyIcon />}
                color="error.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Total Won"
                value={fmt(summary.totalWon)}
                icon={<TrendingUpIcon />}
                color="success.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label={isProfit ? 'Net Profit' : 'Net Loss'}
                value={fmt(summary.netProfit)}
                icon={isProfit ? <TrendingUpIcon /> : <TrendingDownIcon />}
                color={isProfit ? 'success.main' : 'error.main'}
              />
            </Grid>
          </Grid>

          {summary.from && summary.to && (
            <Typography variant="body2" color="text.secondary" mt={3}>
              {new Date(summary.from).toLocaleDateString()} – {new Date(summary.to).toLocaleDateString()}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
