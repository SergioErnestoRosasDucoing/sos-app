import webpush from 'web-push';
import { pool } from '../db';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT ?? 'mailto:soporte@sosayuda.mx';

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
} else {
  console.warn('VAPID keys are not configured — push notifications are disabled.');
}

interface PushPayload {
  title: string;
  body: string;
}

interface SubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  if (!publicKey || !privateKey) return;

  const result = await pool.query<SubscriptionRow>(
    'SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1',
    [userId]
  );

  await Promise.all(
    result.rows.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // Subscription expired or was revoked by the browser — clean it up.
          await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]);
        } else {
          console.error('sendPushToUser error:', err);
        }
      }
    })
  );
}
