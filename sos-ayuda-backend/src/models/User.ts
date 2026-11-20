export interface User {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  blood_type: string | null;
  vehicle_info: string | null;
  ice_contact: string | null;
  created_at: Date;
  updated_at: Date;
}

export type PublicUser = Omit<User, 'password_hash'>;

export function toPublicUser(user: User): PublicUser {
  const { password_hash: _password_hash, ...publicUser } = user;
  return publicUser;
}
