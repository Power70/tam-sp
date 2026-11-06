import { useCallback, useEffect, useState } from 'react';
import { taskApi, type NewTask, type Task, type TaskStatus } from '../api/taskApi';

export function useTasks(status: TaskStatus | '') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await taskApi.list(status));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addTask(task: NewTask): Promise<void> {
    await taskApi.create(task);
    await refresh();
  }

  async function updateStatus(id: number, nextStatus: TaskStatus): Promise<void> {
    await taskApi.updateStatus(id, nextStatus);
    await refresh();
  }

  return { tasks, loading, error, addTask, updateStatus };
}
