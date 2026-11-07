import type { NextFunction, Request, Response } from 'express';
import * as service from '../services/task.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const result = await service.listTasks(req.query.status, page, pageSize);
    res.json({
      tasks: result.tasks,
      counts: result.counts,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await service.createTask(req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Task id must be an integer.' });
      return;
    }

    res.json(await service.updateTaskStatus(id, req.body.status));
  } catch (error) {
    next(error);
  }
}
