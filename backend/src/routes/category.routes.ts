import { Router } from 'express';
import { query } from '../config/database';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
});

export default router;
