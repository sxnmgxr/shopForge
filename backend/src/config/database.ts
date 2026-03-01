import { Pool } from 'pg';
import { logger } from '../utils/logger';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info(`✅ PostgreSQL connected at ${result.rows[0].now}`);
  } catch (err) {
    logger.error('❌ PostgreSQL connection failed:', err);
    process.exit(1);
  }
};

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug(`Query executed in ${duration}ms: ${text.substring(0, 80)}`);
  return result;
};
