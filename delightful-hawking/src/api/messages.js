import { apiRequest } from './client';

function toChatMessage(row) {
  return {
    id: row.id,
    sender: row.sender_type === 'user' ? 'user' : 'prof',
    text: row.content,
    time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function fetchMessages(requestId, token) {
  const rows = await apiRequest(`/service-requests/${encodeURIComponent(requestId)}/messages`, { token });
  return rows.map(toChatMessage);
}

export { toChatMessage };
