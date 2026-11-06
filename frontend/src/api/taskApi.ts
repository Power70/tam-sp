const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export const TASK_STATUSES: readonly TaskStatus[] = ['pending', 'in_progress', 'completed'];
export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
}
export interface NewTask {
  title: string;
  description?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    ...options
  });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json() as { error?: string } & T
    : undefined;
  if (!response.ok) {
    throw new ApiError(payload?.error || `Request failed with status ${response.status}.`, response.status);
  }
  return payload as T;
}

export const taskApi = {
  list: (status: TaskStatus | '' = '') =>
    request<Task[]>(`/tasks${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  create: (task: NewTask) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id: number, status: TaskStatus) => request<Task>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};
