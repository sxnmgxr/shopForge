import dotenv from 'dotenv';
dotenv.config();  // ← MUST be first line before any other imports

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import { connectDB, query } from './config/database';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
// configure CORS to permit frontend URLs defined in env (comma-separated) or any localhost dev port
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^https?:\/\/localhost:(3000|3001|3002)$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'shopforge-api',
    version: '1.0.0',
  });
});

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);

app.use(notFound);
app.use(errorHandler);

// ensure an admin/customer user exists, creating defaults if needed
const ensureDefaultUsers = async () => {
  try {
    const adminRes = await query('SELECT id FROM users WHERE role = $1', ['admin']);
    if (adminRes.rows.length === 0) {
      const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@shopforge.com';
      const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
      const hash = await bcrypt.hash(password, 12);
      await query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, 'admin')`,
        ['Admin User', email, hash]
      );
      logger.info(`Default admin created (${email})`);
    }
    const custRes = await query('SELECT id FROM users WHERE role = $1', ['customer']);
    if (custRes.rows.length === 0) {
      const email = process.env.DEFAULT_CUSTOMER_EMAIL || 'customer@shopforge.com';
      const password = process.env.DEFAULT_CUSTOMER_PASSWORD || 'Customer123!';
      const hash = await bcrypt.hash(password, 12);
      await query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, 'customer')`,
        ['Default Customer', email, hash]
      );
      logger.info(`Default customer created (${email})`);
    }
  } catch (err) {
    logger.error('Failed to ensure default users:', err);
  }
};

const start = async () => {
  await connectDB();
  await ensureDefaultUsers();
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
