import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { verifyToken } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user_id?: string;
    }
  }
}

// Generic so it can precede route handlers typed with their own params
// (e.g. Request<{ requestId: string }>) in the same router.get(...) call —
// a non-generic signature would force TS to unify on ParamsDictionary and
// reject the more specific handler under strict/exactOptionalPropertyTypes.
export function authMiddleware<P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = ParsedQs>(
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.slice('Bearer '.length);
  const userId = verifyToken(token);

  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user_id = userId;
  next();
}
