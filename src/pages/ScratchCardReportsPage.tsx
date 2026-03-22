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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CasinoIcon from '@mui/icons-material/Casino';
import type { ScratchCardReport, ReportPeriod } from '../types/api.types';
import * as api from '../api/scratchCards.api';

const fmt = (n: number) => `£${Math.abs(n).toFixed(2)}`;
const fmtNet = (n: number) => `${n >= 0 ? '+' : '-'}£${Math.abs(n).toFixed(2)}`;

const PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

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

export default function ScratchCardReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [report, setReport] = useState<ScratchCardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async (p: ReportPeriod) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getReport(p);
      setReport(res.data.value);
    } catch {
      setError('Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(period); }, [period]);

  const isProfit = (report?.netProfit ?? 0) >= 0;

  const dateRangeLabel = () => {
    if (!report?.from || !report?.to) return null;
    const from = new Date(report.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const to = new Date(report.to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${from} – ${to}`;
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        mb={1}
      >
        <Typography variant="h5" fontWeight={700}>Scratch Card Report</Typography>

        {/* Mobile: Select */}
        <FormControl size="small" fullWidth sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
          >
            {PERIODS.map((p) => (
              <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Desktop: ToggleButtonGroup */}
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, val) => { if (val) setPeriod(val); }}
          size="small"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          {PERIODS.map((p) => (
            <ToggleButton key={p.value} value={p.value}>{p.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {dateRangeLabel() && (
        <Typography variant="body2" color="text.secondary" mb={3}>{dateRangeLabel()}</Typography>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : report && (
        <>
          {/* Summary stat cards */}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="Cards Bought"
                value={String(report.cardCount)}
                icon={<CasinoIcon />}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="Total Spent"
                value={fmt(report.totalSpent)}
                icon={<TrendingDownIcon />}
                color="error.main"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="Total Won"
                value={fmt(report.totalWon)}
                icon={<TrendingUpIcon />}
                color="success.main"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                label={isProfit ? 'Net Profit' : 'Net Loss'}
                value={fmt(report.netProfit)}
                icon={isProfit ? <TrendingUpIcon /> : <TrendingDownIcon />}
                color={isProfit ? 'success.main' : 'error.main'}
              />
            </Grid>
          </Grid>

          {/* Breakdown by card value */}
          <Typography variant="h6" fontWeight={600} mb={2}>By Card Value</Typography>
          {report.byValue.length === 0 ? (
            <Typography color="text.secondary">No cards in this period.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={1} sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                    <TableCell>Card Value</TableCell>
                    <TableCell align="right">Cards</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Won</TableCell>
                    <TableCell align="right">Net</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.byValue.map((row) => (
                    <TableRow key={row.cardValue} hover>
                      <TableCell sx={{ fontWeight: 600 }}>£{row.cardValue}</TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                      <TableCell align="right">{fmt(row.totalSpent)}</TableCell>
                      <TableCell align="right">{fmt(row.totalWon)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: row.net >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}
                      >
                        {fmtNet(row.net)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals row */}
                  <TableRow sx={{ '& td': { fontWeight: 700, borderTop: 2, borderColor: 'divider' } }}>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">{report.cardCount}</TableCell>
                    <TableCell align="right">{fmt(report.totalSpent)}</TableCell>
                    <TableCell align="right">{fmt(report.totalWon)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: isProfit ? 'success.main' : 'error.main' }}
                    >
                      {fmtNet(report.netProfit)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
}
