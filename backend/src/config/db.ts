import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

export async function checkDatabaseHealth(): Promise<boolean> {
  const result = await pool.query('SELECT 1 AS ok');
  return result.rows[0].ok === 1;
}
