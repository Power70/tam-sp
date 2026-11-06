import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pool } from '../../src/config/db';

export async function setupTestDatabase(): Promise<void> {
  const schemaPath = resolve(process.cwd(), '..', 'db', 'schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  await pool.query(schema);
}
