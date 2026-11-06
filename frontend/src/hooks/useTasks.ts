import { useCallback, useEffect, useState } from 'react';
import { taskApi, type NewTask, type Task, type TaskStatus } from '../api/taskApi';

export function useTasks(status: TaskStatus | '') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Request failed.';
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await taskApi.list(status));
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addTask(task: NewTask): Promise<void> {
    setSaving(true);
    try {
      await taskApi.create(task);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: number, nextStatus: TaskStatus): Promise<void> {
    setSaving(true);
    try {
      await taskApi.updateStatus(id, nextStatus);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return { tasks, loading, saving, error, addTask, updateStatus };
}
