import { useState, useEffect } from 'react';
import * as pushApi from '../api/push.api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const isSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setIsSubscribed(!!sub))
    );
  }, [isSupported]);

  const subscribe = async () => {
    setIsLoading(true);
    setError('');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied.');
        return;
      }
      const keyRes = await pushApi.getVapidPublicKey();
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyRes.data.value.publicKey).buffer as ArrayBuffer,
      });
      await pushApi.subscribe(sub.toJSON());
      setIsSubscribed(true);
    } catch {
      setError('Failed to enable notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    setError('');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await pushApi.unsubscribe();
      }
      setIsSubscribed(false);
    } catch {
      setError('Failed to disable notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  return { isSupported, isSubscribed, isLoading, error, subscribe, unsubscribe };
}
