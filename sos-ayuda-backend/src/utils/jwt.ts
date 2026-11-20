import jwt from 'jsonwebtoken';

export interface JwtPayload {
  user_id: string;
}

// Shared by authMiddleware.ts (Express requests) and socket/index.ts
// (Socket.IO handshakes) — neither can rely on the other's mechanism.
export function verifyToken(token: string): string | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not configured');
    return null;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload.user_id;
  } catch {
    return null;
  }
}
