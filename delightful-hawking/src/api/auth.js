import { apiRequest } from './client';

export async function register(payload) {
  return apiRequest('/auth/register', { method: 'POST', body: payload });
}

export async function login(payload) {
  return apiRequest('/auth/login', { method: 'POST', body: payload });
}

export async function updateMe(payload, token) {
  return apiRequest('/users/me', { method: 'PATCH', body: payload, token });
}
