import { apiRequest } from './client';

export async function subscribeToBackend(subscription, token) {
  return apiRequest('/push/subscribe', { method: 'POST', body: subscription, token });
}
