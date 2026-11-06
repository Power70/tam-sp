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
  list: () => request<Task[]>('/tasks'),
  create: (task: NewTask) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id: number, status: TaskStatus) =>
    request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
