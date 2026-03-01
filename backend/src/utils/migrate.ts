import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

const migrate = async () => {
  console.log('🔄 Connecting to:', process.env.DATABASE_URL);
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');
    const schemaPath = path.join(__dirname, '../../../database/migrations/001_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schema);
    console.log('✅ Migration complete!');
  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
