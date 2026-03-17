// Wrapper shape returned by all API endpoints on success.
// The backend always wraps the payload in { value, isSuccess, errors }.
export interface ApiResult<T> {
  value: T;
  isSuccess: boolean;
  errors: { type: string; description: string }[] | null;
}

export interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt: string;
  notes: string | null;
}

export interface ScratchCard {
  id: string;
  cost: number;
  winnings: number;
  net: number;
  purchasedAt: string;
  notes: string | null;
}

export interface ScratchCardSummary {
  totalSpent: number;
  totalWon: number;
  netProfit: number;
  cardCount: number;
  period: string;
  from: string | null;
  to: string | null;
}

export type SummaryPeriod = 'day' | 'week' | 'month' | 'year' | 'all';
