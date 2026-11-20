import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { PublicUser, User, toPublicUser } from '../models/User';
import { isValidBloodType, isValidEmail, isValidFreeText, isValidName, isValidPassword } from '../utils/validators';

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

interface RegisterRequestBody {
  email: string;
  full_name: string;
  password: string;
  blood_type?: string;
  vehicle_info?: string;
  ice_contact?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface AuthResponseBody {
  token: string;
  user: PublicUser;
}

interface ErrorResponseBody {
  error: string;
}

function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ user_id: userId }, secret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export async function register(
  req: Request<Record<string, never>, AuthResponseBody | ErrorResponseBody, RegisterRequestBody>,
  res: Response<AuthResponseBody | ErrorResponseBody>
): Promise<void> {
  try {
    const { email, full_name, password, blood_type, vehicle_info, ice_contact } = req.body;

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'A valid email is required' });
      return;
    }
    if (!isValidName(full_name)) {
      res.status(400).json({ error: 'full_name must be between 2 and 100 characters' });
      return;
    }
    if (!isValidPassword(password)) {
      res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
      return;
    }
    if (blood_type && !isValidBloodType(blood_type)) {
      res.status(400).json({ error: 'blood_type must be one of A+, A-, B+, B-, AB+, AB-, O+, O-' });
      return;
    }
    if (vehicle_info && !isValidFreeText(vehicle_info)) {
      res.status(400).json({ error: 'vehicle_info is too long' });
      return;
    }
    if (ice_contact && !isValidFreeText(ice_contact)) {
      res.status(400).json({ error: 'ice_contact is too long' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query<User>(
      `INSERT INTO users (email, full_name, password_hash, blood_type, vehicle_info, ice_contact)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, password_hash, blood_type, vehicle_info, ice_contact, created_at, updated_at`,
      [email, full_name.trim(), passwordHash, blood_type ?? null, vehicle_info ?? null, ice_contact ?? null]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    const token = signToken(user.id);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    if (isUniqueViolation(err)) {
      res.status(409).json({ error: 'Email is already registered' });
      return;
    }
    console.error('register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(
  req: Request<Record<string, never>, AuthResponseBody | ErrorResponseBody, LoginRequestBody>,
  res: Response<AuthResponseBody | ErrorResponseBody>
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const result = await pool.query<User>(
      `SELECT id, email, full_name, password_hash, blood_type, vehicle_info, ice_contact, created_at, updated_at
       FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken(user.id);
    res.status(200).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === '23505';
}
