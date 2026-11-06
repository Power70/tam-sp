import { useCallback, useEffect, useState } from 'react';
import { taskApi } from '../api/taskApi';

export function useTasks(status) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await taskApi.list(status));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addTask(task) {
    await taskApi.create(task);
    await refresh();
  }

  async function updateStatus(id, nextStatus) {
    await taskApi.updateStatus(id, nextStatus);
    await refresh();
  }

  return { tasks, loading, error, addTask, updateStatus };
}
