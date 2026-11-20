import { Request, Response } from 'express';
import { pool } from '../db';
import { PublicUser, User, toPublicUser } from '../models/User';
import { isValidBloodType, isValidFreeText, isValidName } from '../utils/validators';

interface UpdateMeRequestBody {
  full_name?: string;
  blood_type?: string;
  vehicle_info?: string;
  ice_contact?: string;
}

interface ErrorResponseBody {
  error: string;
}

export async function updateMe(
  req: Request<Record<string, never>, PublicUser | ErrorResponseBody, UpdateMeRequestBody>,
  res: Response<PublicUser | ErrorResponseBody>
): Promise<void> {
  try {
    const { full_name, blood_type, vehicle_info, ice_contact } = req.body;

    // An empty string means "leave unchanged" here, same as omitting the
    // field entirely — the UPDATE below only overwrites on a real value.
    const fullName = full_name || null;
    const bloodType = blood_type || null;
    const vehicleInfo = vehicle_info || null;
    const iceContact = ice_contact || null;

    if (fullName !== null && !isValidName(fullName)) {
      res.status(400).json({ error: 'full_name must be between 2 and 100 characters' });
      return;
    }
    if (bloodType !== null && !isValidBloodType(bloodType)) {
      res.status(400).json({ error: 'blood_type must be one of A+, A-, B+, B-, AB+, AB-, O+, O-' });
      return;
    }
    if (vehicleInfo !== null && !isValidFreeText(vehicleInfo)) {
      res.status(400).json({ error: 'vehicle_info is too long' });
      return;
    }
    if (iceContact !== null && !isValidFreeText(iceContact)) {
      res.status(400).json({ error: 'ice_contact is too long' });
      return;
    }

    const result = await pool.query<User>(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           blood_type = COALESCE($2, blood_type),
           vehicle_info = COALESCE($3, vehicle_info),
           ice_contact = COALESCE($4, ice_contact)
       WHERE id = $5
       RETURNING id, email, full_name, password_hash, blood_type, vehicle_info, ice_contact, created_at, updated_at`,
      [fullName, bloodType, vehicleInfo, iceContact, req.user_id]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(toPublicUser(user));
  } catch (err) {
    console.error('updateMe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
