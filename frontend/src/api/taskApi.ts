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
    limit: number;
    total: number;
    totalPages: number;
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

function toTaskPage(payload: TaskPage | Task[], page: number, limit: number): TaskPage {
  if (Array.isArray(payload)) {
    return {
      tasks: payload,
      pagination: {
        page,
        limit,
        total: payload.length,
        totalPages: Math.max(1, Math.ceil(payload.length / limit)),
      },
    };
  }
  return payload;
}

export const taskApi = {
  list: async (page = 1, limit = 10, status: TaskStatus | '' = ''): Promise<TaskPage> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    const payload = await request<TaskPage | Task[]>(`/tasks?${params.toString()}`);
    return toTaskPage(payload, page, limit);
  },
  create: (task: NewTask) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id: number, status: TaskStatus) =>
    request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
