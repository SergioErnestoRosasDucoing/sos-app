import { apiRequest } from './client';

export async function fetchTriage(slug) {
  return apiRequest(`/triage/${encodeURIComponent(slug)}`);
}
