import type { NextFunction, Request, Response } from 'express';
import { STATUSES } from '../services/task.service';

export function validateCreateTask(req: Request, res: Response, next: NextFunction): void {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ error: 'Request body must be an object.' });
    return;
  }
  next();
}

export function validateStatus(req: Request, res: Response, next: NextFunction): void {
  if (!req.body || !STATUSES.includes(req.body.status)) {
    res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}.` });
    return;
  }
  next();
}
