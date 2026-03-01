import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string; email: string; role: string;
    };
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
