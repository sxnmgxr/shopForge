import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

// GET /api/products
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1, limit = 12, category, search,
      minPrice, maxPrice, sort = 'created_at', order = 'DESC'
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['p.is_active = true'];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (category) {
      conditions.push(`c.slug = $${paramIdx++}`);
      params.push(category);
    }
    if (search) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (minPrice) { conditions.push(`p.price >= $${paramIdx++}`); params.push(minPrice); }
    if (maxPrice) { conditions.push(`p.price <= $${paramIdx++}`); params.push(maxPrice); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const validSorts: Record<string, string> = {
      price: 'p.price', name: 'p.name', created_at: 'p.created_at', rating: 'p.rating'
    };
    const sortCol = validSorts[sort as string] || 'p.created_at';
    const sortDir = order === 'ASC' ? 'ASC' : 'DESC';

    const [productsRes, countRes] = await Promise.all([
      query(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         ${where}
         ORDER BY ${sortCol} ${sortDir}
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, offset]
      ),
      query(
        `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`,
        params
      ),
    ]);

    res.json({
      success: true,
      data: productsRes.rows,
      pagination: {
        total: parseInt(countRes.rows[0].count),
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(parseInt(countRes.rows[0].count) / Number(limit)),
      },
    });
  } catch (err) { next(err); }
};

// GET /api/products/:id
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND p.is_active = true`,
      [req.params.id]
    );
    if (!result.rows[0]) return next(new AppError('Product not found', 404));
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

// GET /api/products/slug/:slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = true`,
      [req.params.slug]
    );
    if (!result.rows[0]) return next(new AppError('Product not found', 404));
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

// POST /api/products (Admin)
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, price, stock, category_id, image_url } = req.body;
    const result = await query(
      `INSERT INTO products (name, slug, description, price, stock, category_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, slug, description, price, stock, category_id, image_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

// PUT /api/products/:id (Admin)
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, image_url, is_active } = req.body;
    const result = await query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, is_active=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [name, description, price, stock, image_url, is_active, req.params.id]
    );
    if (!result.rows[0]) return next(new AppError('Product not found', 404));
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};
