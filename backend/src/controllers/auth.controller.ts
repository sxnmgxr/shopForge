import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

const signToken = (id: string, email: string, role: string) =>
  jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' } as object
  );

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return next(new AppError('Email already registered', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'customer')
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = signToken(user.id, user.email, user.role);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken(user.id, user.email, user.role);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ success: true, token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user?.id]
    );
    if (!result.rows[0]) return next(new AppError('User not found', 404));
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
