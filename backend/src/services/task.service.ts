import repository from '../repositories/task.repository';

export const STATUSES = ['pending', 'in_progress', 'completed'] as const;
export type TaskStatus = typeof STATUSES[number];
export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export class ValidationError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

function validateTitle(title: unknown): asserts title is string {
  if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 200) {
    throw new ValidationError('Title is required and must be 1-200 characters.');
  }
}

export function validateStatus(status: unknown): asserts status is TaskStatus {
  if (!(STATUSES as readonly unknown[]).includes(status)) {
    throw new ValidationError(`Status must be one of: ${STATUSES.join(', ')}.`);
  }
}

export async function listTasks(status?: unknown): Promise<Task[]> {
  if (status) {
    validateStatus(status);
  }
  return repository.findAll(status as TaskStatus | undefined);
}

export async function createTask(input: {
  title?: unknown;
  description?: unknown;
  status?: unknown;
} = {}): Promise<Task> {
  validateTitle(input.title);
  const status = input.status || 'pending';
  if (input.status) validateStatus(input.status);
  return repository.create({
    title: input.title.trim(),
    description: typeof input.description === 'string' ? input.description.trim() : null,
    status: status as TaskStatus
  });
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  validateStatus(status);
  const task = await repository.updateStatus(id, status);
  if (!task) throw new NotFoundError('Task not found.');
  return task;
}
