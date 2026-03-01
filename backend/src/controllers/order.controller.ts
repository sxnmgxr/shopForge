import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

// POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { items, shipping_address, payment_method = 'card' } = req.body;

    if (!items?.length) return next(new AppError('Order must have at least one item', 400));

    // Calculate total from actual DB prices (never trust client prices)
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const productsRes = await query(
      `SELECT id, name, price, stock FROM products WHERE id = ANY($1)`,
      [productIds]
    );

    let total = 0;
    const orderItems = items.map((item: { product_id: string; quantity: number }) => {
      const product = productsRes.rows.find(p => p.id === item.product_id);
      if (!product) throw new AppError(`Product ${item.product_id} not found`, 404);
      if (product.stock < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);
      total += product.price * item.quantity;
      return { ...item, price: product.price, name: product.name };
    });

    // Create order
    const orderRes = await query(
      `INSERT INTO orders (user_id, total, status, shipping_address, payment_method)
       VALUES ($1, $2, 'pending', $3, $4) RETURNING *`,
      [userId, total, JSON.stringify(shipping_address), payment_method]
    );
    const order = orderRes.rows[0];

    // Create order items & reduce stock
    for (const item of orderItems) {
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
      await query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    res.status(201).json({ success: true, data: { ...order, items: orderItems } });
  } catch (err) { next(err); }
};

// GET /api/orders (my orders)
export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT o.*,
         json_agg(json_build_object(
           'id', oi.id, 'product_id', oi.product_id,
           'name', p.name, 'quantity', oi.quantity,
           'price', oi.price, 'image_url', p.image_url
         )) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user?.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
};

// GET /api/orders/:id
export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT o.*,
         json_agg(json_build_object(
           'id', oi.id, 'product_id', oi.product_id,
           'name', p.name, 'quantity', oi.quantity,
           'price', oi.price, 'image_url', p.image_url
         )) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND (o.user_id = $2 OR $3 = 'admin')
       GROUP BY o.id`,
      [req.params.id, req.user?.id, req.user?.role]
    );
    if (!result.rows[0]) return next(new AppError('Order not found', 404));
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};
