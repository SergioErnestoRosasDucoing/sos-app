import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SOCKET_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

let socket = null;

export function getSocket(token) {
  if (socket) return socket;

  socket = io(SOCKET_ORIGIN, {
    auth: { token },
    autoConnect: false,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
