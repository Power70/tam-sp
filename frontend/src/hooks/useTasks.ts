import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskApi, type NewTask, type Task, type TaskStatus } from '../api/taskApi';

export const PAGE_SIZE = 10;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Request failed.';
}

export function useTasks(status: TaskStatus | '') {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setAllTasks(await taskApi.list());
      setError('');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredTasks = useMemo(
    () => (status ? allTasks.filter((task) => task.status === status) : allTasks),
    [allTasks, status]
  );
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const tasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const counts = useMemo(
    () => ({
      all: allTasks.length,
      pending: allTasks.filter((task) => task.status === 'pending').length,
      in_progress: allTasks.filter((task) => task.status === 'in_progress').length,
      completed: allTasks.filter((task) => task.status === 'completed').length,
    }),
    [allTasks]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  async function addTask(task: NewTask): Promise<void> {
    setSaving(true);
    try {
      const created = await taskApi.create(task);
      setAllTasks((current) => [created, ...current]);
      setError('');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: number, nextStatus: TaskStatus): Promise<void> {
    setSaving(true);
    try {
      const updated = await taskApi.updateStatus(id, nextStatus);
      setAllTasks((current) => current.map((task) => (task.id === id ? updated : task)));
      setError('');
    } catch (requestError) {
      setError('Could not update the task. Please try again.');
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  function changePage(nextPage: number): void {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return {
    tasks,
    counts,
    page,
    total: filteredTasks.length,
    totalPages,
    loading,
    saving,
    error,
    refresh,
    addTask,
    updateStatus,
    changePage,
  };
}
