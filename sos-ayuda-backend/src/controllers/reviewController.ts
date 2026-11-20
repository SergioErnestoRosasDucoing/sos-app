import { Request, Response } from 'express';
import { pool } from '../db';
import { Review } from '../models/Review';

interface ErrorResponseBody {
  error: string;
}

interface CreateReviewBody {
  rating: number;
  comment: string;
}

interface IdParams {
  id: string;
}

function initialsFromName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? '' : '';
  return (first + last).toUpperCase() || 'U';
}

export async function createReview(
  req: Request<IdParams, Review | ErrorResponseBody, CreateReviewBody>,
  res: Response<Review | ErrorResponseBody>
): Promise<void> {
  const { id: requestId } = req.params;
  const { rating, comment } = req.body;

  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    return;
  }
  if (typeof comment !== 'string' || !comment.trim()) {
    res.status(400).json({ error: 'comment is required' });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const requestResult = await client.query<{ user_id: string; pro_id: string; status: string }>(
      'SELECT user_id, pro_id, status FROM service_requests WHERE id = $1',
      [requestId]
    );
    const serviceRequest = requestResult.rows[0];

    if (!serviceRequest) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Service request not found' });
      return;
    }
    if (serviceRequest.user_id !== req.user_id) {
      await client.query('ROLLBACK');
      res.status(403).json({ error: 'You do not have access to this service request' });
      return;
    }
    if (serviceRequest.status !== 'completed') {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'You can only review a completed service request' });
      return;
    }

    const userResult = await client.query<{ full_name: string }>('SELECT full_name FROM users WHERE id = $1', [req.user_id]);
    const author = userResult.rows[0]?.full_name ?? 'Usuario S.O.S.';
    const initials = initialsFromName(author);

    const reviewResult = await client.query<Review>(
      `INSERT INTO professional_reviews (professional_id, service_request_id, author, initials, rating, comment)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, author, initials, rating, comment, created_at`,
      [serviceRequest.pro_id, requestId, author, initials, rating, comment.trim()]
    );
    const review = reviewResult.rows[0];
    if (!review) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Failed to create review' });
      return;
    }

    await client.query(
      `UPDATE professionals
       SET rating = (SELECT ROUND(AVG(rating), 1) FROM professional_reviews WHERE professional_id = $1)
       WHERE id = $1`,
      [serviceRequest.pro_id]
    );

    await client.query('COMMIT');
    res.status(201).json(review);
  } catch (err) {
    await client.query('ROLLBACK');
    if (isUniqueViolation(err)) {
      res.status(409).json({ error: 'You already left a review for this service request' });
      return;
    }
    console.error('createReview error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === '23505';
}
