import client from './client';
import type { ApiResult } from '../types/api.types';

export interface UserPreferences {
  theme: string;
  morningReminderTime: string | null;
  eveningReminderTime: string | null;
}

export const get = () =>
  client.get<ApiResult<UserPreferences>>('/api/preferences');

export const update = (theme: string) =>
  client.put<ApiResult<UserPreferences>>('/api/preferences', { theme });

export const updateReminders = (morningReminderTime: string | null, eveningReminderTime: string | null) =>
  client.put<ApiResult<UserPreferences>>('/api/preferences/reminders', { morningReminderTime, eveningReminderTime });
