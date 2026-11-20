import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { pool } from '../db';
import { verifyToken } from '../utils/jwt';
import { sendPushToUser } from '../utils/webPush';
import { Message } from '../models/Message';

interface JoinRequestPayload {
  requestId: string;
}

interface SendMessagePayload {
  requestId: string;
  content: string;
}

const CANNED_PRO_REPLIES = [
  'Recibido, estoy en camino.',
  'Entendido, monitoreando tu ubicación.',
  'Gracias por la información, ya voy en ruta.',
  'Confirmado, llego en unos minutos.',
];

function pickCannedReply(): string {
  const reply = CANNED_PRO_REPLIES[Math.floor(Math.random() * CANNED_PRO_REPLIES.length)];
  return reply ?? CANNED_PRO_REPLIES[0]!;
}

function roomFor(requestId: string): string {
  return `request:${requestId}`;
}

async function requestBelongsToUser(requestId: string, userId: string): Promise<boolean> {
  const result = await pool.query<{ user_id: string }>(
    'SELECT user_id FROM service_requests WHERE id = $1',
    [requestId]
  );
  return result.rows[0]?.user_id === userId;
}

async function getRequestOwnerAndProName(requestId: string): Promise<{ userId: string; proName: string } | null> {
  const result = await pool.query<{ user_id: string; pro_name: string }>(
    `SELECT sr.user_id, p.name AS pro_name
     FROM service_requests sr
     JOIN professionals p ON p.id = sr.pro_id
     WHERE sr.id = $1`,
    [requestId]
  );
  const row = result.rows[0];
  return row ? { userId: row.user_id, proName: row.pro_name } : null;
}

export function initSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      next(new Error('unauthorized'));
      return;
    }

    socket.data.userId = userId;
    next();
  });

  io.on('connection', (socket: Socket) => {
    socket.on('join_request', async (payload: JoinRequestPayload) => {
      try {
        const isOwner = await requestBelongsToUser(payload.requestId, socket.data.userId);
        if (!isOwner) {
          socket.emit('error', { message: 'You do not have access to this conversation' });
          return;
        }
        await socket.join(roomFor(payload.requestId));
      } catch (err) {
        console.error('join_request error:', err);
        socket.emit('error', { message: 'Could not join conversation' });
      }
    });

    socket.on('send_message', async (payload: SendMessagePayload) => {
      try {
        const content = payload.content?.trim();
        if (!content) {
          socket.emit('error', { message: 'Message content cannot be empty' });
          return;
        }

        const room = roomFor(payload.requestId);
        if (!socket.rooms.has(room)) {
          socket.emit('error', { message: 'Join the conversation before sending messages' });
          return;
        }

        const insertResult = await pool.query<Message>(
          `INSERT INTO messages (request_id, sender_type, content) VALUES ($1, 'user', $2) RETURNING *`,
          [payload.requestId, content]
        );
        const userMessage = insertResult.rows[0];
        if (!userMessage) return;

        io.to(room).emit('new_message', userMessage);

        setTimeout(async () => {
          try {
            const replyText = pickCannedReply();
            const replyResult = await pool.query<Message>(
              `INSERT INTO messages (request_id, sender_type, content) VALUES ($1, 'pro', $2) RETURNING *`,
              [payload.requestId, replyText]
            );
            const proMessage = replyResult.rows[0];
            if (proMessage) io.to(room).emit('new_message', proMessage);

            const owner = await getRequestOwnerAndProName(payload.requestId);
            if (owner) {
              await sendPushToUser(owner.userId, {
                title: `${owner.proName} está en camino`,
                body: replyText,
              });
            }
          } catch (err) {
            console.error('simulated pro reply error:', err);
          }
        }, 2000);
      } catch (err) {
        console.error('send_message error:', err);
        socket.emit('error', { message: 'Could not send message' });
      }
    });
  });

  return io;
}
