const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

export const taskApi = {
  list: (status = '') => request(`/tasks${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id, status) => request(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};
