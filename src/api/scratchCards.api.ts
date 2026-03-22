import client from './client';
import type { ApiResult, ScratchCard, ScratchCardSummary, ScratchCardReport, SummaryPeriod, ReportPeriod } from '../types/api.types';

export interface AddScratchCardRequest {
  cost: number;
  winnings: number;
  purchasedAt?: string | null;
  notes?: string | null;
}

export const getAll = () =>
  client.get<ApiResult<ScratchCard[]>>('/api/scratchcards');

export const add = (data: AddScratchCardRequest) =>
  client.post<ApiResult<ScratchCard>>('/api/scratchcards', data);

export const remove = (id: string) =>
  client.delete(`/api/scratchcards/${id}`);

export const getSummary = (period: SummaryPeriod, date?: string) =>
  client.get<ApiResult<ScratchCardSummary>>('/api/scratchcards/summary', {
    params: { period, date },
  });

export const getReport = (period: ReportPeriod, date?: string) =>
  client.get<ApiResult<ScratchCardReport>>('/api/scratchcards/report', {
    params: { period, date },
  });
