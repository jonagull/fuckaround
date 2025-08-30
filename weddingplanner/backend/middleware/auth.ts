import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';

export interface AuthRequest extends Request { userId?: string }

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;

    next();

  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};