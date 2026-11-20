import { apiRequest } from './client';

export async function fetchActionPlan(slug) {
  return apiRequest(`/action-plans/${encodeURIComponent(slug)}`);
}
