import 'dotenv/config';
import { validateEnvironment } from './src/config/env';
import app from './src/app';
import { pool } from './src/config/db';

validateEnvironment();
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => console.log(`Sprout Task Manager API listening on port ${port}`));

async function shutdown(signal: string): Promise<void> {
  console.log(`${signal} received. Shutting down gracefully.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));
