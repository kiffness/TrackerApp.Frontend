import client from './client';
import type { ApiResult } from '../types/api.types';

export const getVapidPublicKey = () =>
  client.get<ApiResult<{ publicKey: string }>>('/api/push/vapid-public-key');

export const subscribe = (subscription: PushSubscriptionJSON) =>
  client.post('/api/push/subscribe', {
    endpoint: subscription.endpoint,
    p256dh: subscription.keys?.p256dh,
    auth: subscription.keys?.auth,
  });

export const unsubscribe = () =>
  client.delete('/api/push/unsubscribe');
