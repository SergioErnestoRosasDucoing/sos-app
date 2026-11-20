import { Request, Response } from 'express';
import { pool } from '../db';

interface ErrorResponseBody {
  error: string;
}

interface SubscribeBody {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface UnsubscribeBody {
  endpoint: string;
}

export async function subscribe(
  req: Request<Record<string, never>, { ok: true } | ErrorResponseBody, SubscribeBody>,
  res: Response<{ ok: true } | ErrorResponseBody>
): Promise<void> {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({ error: 'endpoint and keys.p256dh/keys.auth are required' });
      return;
    }

    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE
         SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
      [req.user_id, endpoint, keys.p256dh, keys.auth]
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function unsubscribe(
  req: Request<Record<string, never>, { ok: true } | ErrorResponseBody, UnsubscribeBody>,
  res: Response<{ ok: true } | ErrorResponseBody>
): Promise<void> {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      res.status(400).json({ error: 'endpoint is required' });
      return;
    }

    await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1 AND user_id = $2', [endpoint, req.user_id]);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('unsubscribe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
