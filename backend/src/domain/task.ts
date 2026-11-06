export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateTaskInput {
  title?: unknown;
  description?: unknown;
  status?: unknown;
}

export interface PersistedTaskInput {
  title: string;
  description: string | null;
  status: TaskStatus;
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (TASK_STATUSES as readonly unknown[]).includes(value);
}

export function normalizeDescription(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}
