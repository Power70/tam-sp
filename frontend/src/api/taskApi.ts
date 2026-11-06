const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

export const taskApi = {
  list: (status = '') => request<Task[]>(`/tasks${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  create: (task: NewTask) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id: number, status: TaskStatus) => request<Task>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};
