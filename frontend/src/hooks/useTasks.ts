import { useCallback, useEffect, useState } from 'react';
import { taskApi, type NewTask, type Task, type TaskStatus } from '../api/taskApi';

export const PAGE_SIZE = 10;

export interface TaskError {
  scope: 'load' | 'create' | 'update';
  message: string;
  retry: () => void;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Request failed.';
}

export function useTasks(status: TaskStatus | '') {
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ all: 0, pending: 0, in_progress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<TaskError | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskApi.list(page, PAGE_SIZE, status || undefined);
      setTasks(result.tasks);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
      setCounts(result.counts);
    } catch (requestError) {
      setError({
        scope: 'load',
        message: getErrorMessage(requestError),
        retry: () => void refresh(),
      });
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
    setError(null);
    try {
      await taskApi.create(task);
      await refresh();
    } catch (requestError) {
      setError({
        scope: 'create',
        message: getErrorMessage(requestError),
        retry: () => void addTask(task),
      });
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: number, nextStatus: TaskStatus): Promise<void> {
    setSaving(true);
    setError(null);
    try {
      await taskApi.updateStatus(id, nextStatus);
      await refresh();
    } catch {
      setError({
        scope: 'update',
        message: 'Could not update the task. Please try again.',
        retry: () => void updateStatus(id, nextStatus),
      });
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
