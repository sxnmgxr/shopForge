import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { query } from '../config/database';
import bcrypt from 'bcryptjs';

const router = Router();

// GET profile
router.get('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user?.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

// PUT update profile
router.put('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { name, email } = req.body;
    const result = await query(
      'UPDATE users SET name=$1, email=$2, updated_at=NOW() WHERE id=$3 RETURNING id, name, email, role',
      [name, email, req.user?.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

// PUT change password
router.put('/password', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userRes = await query('SELECT password FROM users WHERE id = $1', [req.user?.id]);
    const valid = await bcrypt.compare(currentPassword, userRes.rows[0].password);
    if (!valid) { res.status(400).json({ success: false, error: 'Current password incorrect' }); return; }
    const hashed = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password=$1 WHERE id=$2', [hashed, req.user?.id]);
    res.json({ success: true, message: 'Password updated' });
  } catch (err) { next(err); }
});

export default router;
