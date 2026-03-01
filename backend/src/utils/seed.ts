import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

const seed = async () => {
  console.log('🌱 Connecting to:', process.env.DATABASE_URL);
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding...');
    const seedPath = path.join(__dirname, '../../../database/seeds/002_seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf-8');
    await client.query(seedData);
    console.log('✅ Seed complete!');
  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
