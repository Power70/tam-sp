import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import { checkDatabaseHealth } from './config/db';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', async (req, res, next) => {
  try {
    await checkDatabaseHealth();
    res.json({ status: 'ok', database: 'ok' });
  } catch (error) {
    next(error);
  }
});
app.use('/api/tasks', taskRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use(errorHandler);

export default app;
