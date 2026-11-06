import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pool } from '../config/db';

async function seed(): Promise<void> {
  const schemaPath = resolve(process.cwd(), '..', 'db', 'schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('Database schema applied and initial data seeded.');
}

seed()
  .catch((error: unknown) => {
    console.error('Database seeding failed.', error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
