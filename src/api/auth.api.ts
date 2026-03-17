import client from './client';

export const login = (username: string, password: string) =>
  client.post('/api/auth/login', { username, password });

export const logout = () =>
  client.post('/api/auth/logout');
