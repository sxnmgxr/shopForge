import { query } from '../config/database';

const run = async () => {
  try {
    const res = await query('SELECT id, name, email, password, role FROM users');
    console.log('users:', res.rows);
  } catch (err) {
    console.error('error querying users', err);
  } finally {
    process.exit(0);
  }
};

run();
