import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// GET cart
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.user?.id]
    );
    const total = result.rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, data: { items: result.rows, total } });
  } catch (err) { next(err); }
});

// POST add item
router.post('/items', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await query('SELECT id, stock FROM products WHERE id = $1', [product_id]);
    if (!product.rows[0]) return next(new AppError('Product not found', 404));
    if (product.rows[0].stock < quantity) return next(new AppError('Insufficient stock', 400));

    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3`,
      [req.user?.id, product_id, quantity]
    );
    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) { next(err); }
});

// PUT update quantity
router.put('/items/:productId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await query('DELETE FROM cart_items WHERE user_id=$1 AND product_id=$2',
        [req.user?.id, req.params.productId]);
    } else {
      await query('UPDATE cart_items SET quantity=$1 WHERE user_id=$2 AND product_id=$3',
        [quantity, req.user?.id, req.params.productId]);
    }
    res.json({ success: true, message: 'Cart updated' });
  } catch (err) { next(err); }
});

// DELETE remove item
router.delete('/items/:productId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await query('DELETE FROM cart_items WHERE user_id=$1 AND product_id=$2',
      [req.user?.id, req.params.productId]);
    res.json({ success: true, message: 'Item removed' });
  } catch (err) { next(err); }
});

// DELETE clear cart
router.delete('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await query('DELETE FROM cart_items WHERE user_id=$1', [req.user?.id]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
});

export default router;
