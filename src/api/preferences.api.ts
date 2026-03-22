import client from './client';
import type { ApiResult } from '../types/api.types';

export interface UserPreferences {
  theme: string;
}

export const get = () =>
  client.get<ApiResult<UserPreferences>>('/api/preferences');

export const update = (theme: string) =>
  client.put<ApiResult<UserPreferences>>('/api/preferences', { theme });
