import client from './client';
import type { ApiResult, BloodPressureReading } from '../types/api.types';

export interface AddBloodPressureRequest {
  systolic: number;
  diastolic: number;
  pulse: number;
  recordedAt?: string | null;
  notes?: string | null;
}

export const getAll = () =>
  client.get<ApiResult<BloodPressureReading[]>>('/api/bloodpressure');

export const add = (data: AddBloodPressureRequest) =>
  client.post<ApiResult<BloodPressureReading>>('/api/bloodpressure', data);

export const remove = (id: string) =>
  client.delete(`/api/bloodpressure/${id}`);
