import { Request, Response } from 'express';
import { pool } from '../db';
import { Message } from '../models/Message';

interface ErrorResponseBody {
  error: string;
}

interface RequestIdParams {
  requestId: string;
}

export async function listMessages(
  req: Request<RequestIdParams>,
  res: Response<Message[] | ErrorResponseBody>
): Promise<void> {
  try {
    const { requestId } = req.params;

    const ownerResult = await pool.query<{ user_id: string }>(
      'SELECT user_id FROM service_requests WHERE id = $1',
      [requestId]
    );
    const owner = ownerResult.rows[0];

    if (!owner) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }
    if (owner.user_id !== req.user_id) {
      res.status(403).json({ error: 'You do not have access to this conversation' });
      return;
    }

    const result = await pool.query<Message>(
      'SELECT * FROM messages WHERE request_id = $1 ORDER BY created_at ASC',
      [requestId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('listMessages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
