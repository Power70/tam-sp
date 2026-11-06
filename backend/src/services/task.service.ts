import repository from '../repositories/task.repository';
import { isTaskStatus, normalizeDescription, TASK_STATUSES } from '../domain/task';
import type { CreateTaskInput, PersistedTaskInput, Task, TaskStatus } from '../domain/task';

export { TASK_STATUSES as STATUSES };
export type { CreateTaskInput, Task, TaskStatus };

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
  if (!isTaskStatus(status)) {
    throw new ValidationError(`Status must be one of: ${TASK_STATUSES.join(', ')}.`);
  }
}

export async function listTasks(status?: unknown): Promise<Task[]> {
  if (status !== undefined) {
    validateStatus(status);
  }
  return repository.findAll(status);
}

export async function createTask(input: CreateTaskInput = {}): Promise<Task> {
  validateTitle(input.title);
  let status: TaskStatus = 'pending';
  if ('status' in input) {
    validateStatus(input.status);
    status = input.status;
  }
  const task: PersistedTaskInput = {
    title: input.title.trim(),
    description: normalizeDescription(input.description),
    status
  };
  return repository.create(task);
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  validateStatus(status);
  const task = await repository.updateStatus(id, status);
  if (!task) throw new NotFoundError('Task not found.');
  return task;
}
