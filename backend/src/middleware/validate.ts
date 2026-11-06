import type { NextFunction, Request, Response } from 'express';
import { STATUSES } from '../services/task.service';

function isValidStatus(status: unknown): boolean {
  return (STATUSES as readonly unknown[]).includes(status);
}

function sendValidationError(res: Response, message: string): void {
  res.status(400).json({ error: message });
}

export function validateCreateTask(req: Request, res: Response, next: NextFunction): void {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    sendValidationError(res, 'Request body must be an object.');
    return;
  }

  const { title, description, status } = req.body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
  };

  if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 200) {
    sendValidationError(res, 'Title is required and must be 1-200 characters.');
    return;
  }
  if (description !== undefined && typeof description !== 'string') {
    sendValidationError(res, 'Description must be a string.');
    return;
  }
  if (status !== undefined && !isValidStatus(status)) {
    sendValidationError(res, `Status must be one of: ${STATUSES.join(', ')}.`);
    return;
  }
  next();
}

export function validateStatus(req: Request, res: Response, next: NextFunction): void {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) ||
      !isValidStatus(req.body.status)) {
    sendValidationError(res, `Status must be one of: ${STATUSES.join(', ')}.`);
    return;
  }
  next();
}

export function validateTaskFilter(req: Request, res: Response, next: NextFunction): void {
  const { status } = req.query;
  if (status !== undefined && (Array.isArray(status) || !isValidStatus(status))) {
    sendValidationError(res, `Status must be one of: ${STATUSES.join(', ')}.`);
    return;
  }
  next();
}
