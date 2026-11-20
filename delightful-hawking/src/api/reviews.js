import { apiRequest } from './client';

export async function createReview(requestId, { rating, comment }, token) {
  return apiRequest(`/service-requests/${encodeURIComponent(requestId)}/review`, {
    method: 'POST',
    body: { rating, comment },
    token,
  });
}
