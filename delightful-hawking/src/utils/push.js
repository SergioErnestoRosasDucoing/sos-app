import { subscribeToBackend } from '../api/push';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// Standard conversion from the base64url VAPID key to the Uint8Array
// PushManager.subscribe expects as applicationServerKey.
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  return navigator.serviceWorker.register('/sw.js');
}

export async function subscribeToPush(token) {
  if (!('Notification' in window) || !('PushManager' in window)) {
    throw new Error('Este navegador no soporta notificaciones push.');
  }
  if (!VAPID_PUBLIC_KEY) {
    throw new Error('Notificaciones push no configuradas.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permiso de notificaciones denegado.');
  }

  const registration = await registerServiceWorker();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  await subscribeToBackend(subscription.toJSON(), token);
  return subscription;
}
