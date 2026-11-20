// Server-side input validation. Never trust the client alone — these run
// regardless of what the frontend already checks, since any of these
// endpoints can be hit directly (curl, another client, a bug in the UI).

export const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodType = (typeof VALID_BLOOD_TYPES)[number];

export function isValidBloodType(value: unknown): value is BloodType {
  return typeof value === 'string' && (VALID_BLOOD_TYPES as readonly string[]).includes(value);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_REGEX.test(value);
}

export const MIN_PASSWORD_LENGTH = 6;

export function isValidPassword(value: unknown): value is string {
  return typeof value === 'string' && value.length >= MIN_PASSWORD_LENGTH && value.length <= 128;
}

const MAX_FREE_TEXT_LENGTH = 300;

export function isValidFreeText(value: unknown, maxLength = MAX_FREE_TEXT_LENGTH): value is string {
  return typeof value === 'string' && value.length <= maxLength;
}

const MAX_NAME_LENGTH = 100;

export function isValidName(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= MAX_NAME_LENGTH;
}
