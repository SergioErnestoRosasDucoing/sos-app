import { Request, Response } from 'express';
import { pool } from '../db';
import {
  ServiceRequest,
  ServiceRequestWithProfessionalRow,
  ServiceRequestWithProfessional,
  toServiceRequestWithProfessional,
} from '../models/ServiceRequest';

interface ErrorResponseBody {
  error: string;
}

interface CreateServiceRequestBody {
  pro_id: string;
}

interface PayServiceRequestBody {
  paymentMethodLabel?: string;
}

interface IdParams {
  id: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_PAYMENT_METHOD_LABEL = 'Tarjeta de prueba •••• 4242';

export async function createServiceRequest(
  req: Request<Record<string, never>, ServiceRequest | ErrorResponseBody, CreateServiceRequestBody>,
  res: Response<ServiceRequest | ErrorResponseBody>
): Promise<void> {
  try {
    const { pro_id } = req.body;

    if (!pro_id || !UUID_REGEX.test(pro_id)) {
      res.status(400).json({ error: 'pro_id must be a valid UUID' });
      return;
    }

    const result = await pool.query<ServiceRequest>(
      `INSERT INTO service_requests (user_id, pro_id) VALUES ($1, $2) RETURNING *`,
      [req.user_id, pro_id]
    );

    const serviceRequest = result.rows[0];
    if (!serviceRequest) {
      res.status(500).json({ error: 'Failed to create service request' });
      return;
    }

    res.status(201).json(serviceRequest);
  } catch (err) {
    if (isForeignKeyViolation(err)) {
      res.status(404).json({ error: 'Professional not found' });
      return;
    }
    console.error('createServiceRequest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listMyServiceRequests(
  req: Request,
  res: Response<ServiceRequestWithProfessional[] | ErrorResponseBody>
): Promise<void> {
  try {
    const result = await pool.query<ServiceRequestWithProfessionalRow>(
      `SELECT sr.*, p.name AS pro_name, p.role AS pro_role, c.name AS category_slug,
              EXISTS(SELECT 1 FROM professional_reviews r WHERE r.service_request_id = sr.id) AS has_review
       FROM service_requests sr
       JOIN professionals p ON p.id = sr.pro_id
       JOIN categories c ON c.id = p.category_id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
      [req.user_id]
    );

    res.status(200).json(result.rows.map(toServiceRequestWithProfessional));
  } catch (err) {
    console.error('listMyServiceRequests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function payServiceRequest(
  req: Request<IdParams, ServiceRequest | ErrorResponseBody, PayServiceRequestBody>,
  res: Response<ServiceRequest | ErrorResponseBody>
): Promise<void> {
  try {
    const { id } = req.params;
    const paymentMethodLabel = req.body.paymentMethodLabel?.trim() || DEFAULT_PAYMENT_METHOD_LABEL;

    const existingResult = await pool.query<{ user_id: string; status: string }>(
      'SELECT user_id, status FROM service_requests WHERE id = $1',
      [id]
    );
    const existing = existingResult.rows[0];

    if (!existing) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }
    if (existing.user_id !== req.user_id) {
      res.status(403).json({ error: 'You do not have access to this service request' });
      return;
    }
    if (existing.status === 'completed') {
      res.status(400).json({ error: 'This service request has already been paid' });
      return;
    }

    const result = await pool.query<ServiceRequest>(
      `UPDATE service_requests sr
       SET total_cost = (SELECT base_visit_price FROM professionals WHERE id = sr.pro_id),
           payment_method = $1,
           status = 'completed'
       WHERE sr.id = $2 AND sr.user_id = $3
       RETURNING sr.*`,
      [paymentMethodLabel, id, req.user_id]
    );

    const updated = result.rows[0];
    if (!updated) {
      res.status(500).json({ error: 'Failed to process payment' });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('payServiceRequest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function isForeignKeyViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === '23503';
}
