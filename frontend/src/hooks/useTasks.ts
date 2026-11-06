import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskApi, type NewTask, type Task, type TaskStatus } from '../api/taskApi';

export const PAGE_SIZE = 10;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Request failed.';
}

export function useTasks(status: TaskStatus | '') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await taskApi.list(page, PAGE_SIZE, status);
      setTasks(result.tasks);
      setTotal(result.pagination.total);
      setTotalPages(Math.max(1, result.pagination.totalPages));
      setError('');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  async function addTask(task: NewTask): Promise<void> {
    setSaving(true);
    try {
      const created = await taskApi.create(task);
      setTasks((current) => [created, ...current].slice(0, PAGE_SIZE));
      setTotal((current) => current + 1);
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
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
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

  const counts = useMemo(() => {
    const result: Record<TaskStatus | 'all', number> = {
      all: total,
      pending: 0,
      in_progress: 0,
      completed: 0,
    };
    tasks.forEach((task) => {
      result[task.status] += 1;
    });
    return result;
  }, [tasks, total]);

  return {
    tasks,
    counts,
    page,
    total,
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
