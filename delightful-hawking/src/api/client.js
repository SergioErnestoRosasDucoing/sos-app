const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  let response;

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(`No se pudo conectar con el servidor (${networkErr.message}).`, 0);
  }

  if (!response.ok) {
    let message = `Error ${response.status} al consultar ${path}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body; keep default message
    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}
