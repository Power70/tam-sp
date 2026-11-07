const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  created_at?: string;
}

export interface NewTask {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface TaskPage {
  tasks: Task[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  counts: {
    all: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<Task>;
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    TASK_STATUSES.includes(task.status as TaskStatus)
  );
}

function isTaskCounts(value: unknown): value is TaskPage['counts'] {
  if (!value || typeof value !== 'object') return false;
  const counts = value as Partial<TaskPage['counts']>;
  return (
    typeof counts.all === 'number' &&
    typeof counts.pending === 'number' &&
    typeof counts.in_progress === 'number' &&
    typeof counts.completed === 'number'
  );
}

function isTaskPage(value: unknown): value is TaskPage {
  if (!value || typeof value !== 'object') return false;
  const page = value as Partial<TaskPage>;
  return (
    Array.isArray(page.tasks) &&
    page.tasks.every(isTask) &&
    !!page.pagination &&
    typeof page.pagination.total === 'number' &&
    typeof page.pagination.totalPages === 'number' &&
    isTaskCounts(page.counts)
  );
}

function normalizeTaskList(value: unknown, page: number, pageSize: number, status?: TaskStatus): TaskPage {
  if (isTaskPage(value)) return value;
  if (!Array.isArray(value) || !value.every(isTask)) {
    throw new Error('The task list response was invalid.');
  }

  const filteredTasks = status ? value.filter((task) => task.status === status) : value;
  const counts = {
    all: value.length,
    pending: value.filter((task) => task.status === 'pending').length,
    in_progress: value.filter((task) => task.status === 'in_progress').length,
    completed: value.filter((task) => task.status === 'completed').length,
  };
  return {
    tasks: filteredTasks.slice((page - 1) * pageSize, page * pageSize),
    pagination: {
      page,
      pageSize,
      total: filteredTasks.length,
      totalPages: Math.max(1, Math.ceil(filteredTasks.length / pageSize)),
    },
    counts,
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? ((await response.json()) as { error?: string; details?: string[] } & T)
    : undefined;

  if (!response.ok) {
    throw new ApiError(
      payload?.error || `Request failed with status ${response.status}.`,
      response.status,
      payload?.details
    );
  }
  return payload as T;
}

export const taskApi = {
  list: async (page: number, pageSize: number, status?: TaskStatus) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (status) params.set('status', status);
    const result = await request<unknown>(`/tasks?${params.toString()}`);
    if (Array.isArray(result) && status) {
      const allParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      const allTasks = await request<unknown>(`/tasks?${allParams.toString()}`);
      return normalizeTaskList(allTasks, page, pageSize, status);
    }
    return normalizeTaskList(result, page, pageSize, status);
  },
  create: (task: NewTask) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id: number, status: TaskStatus) =>
    request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
