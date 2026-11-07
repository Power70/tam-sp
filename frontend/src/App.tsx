import { useCallback, useEffect, useState } from 'react';
import { PAGE_SIZE, useTasks } from './hooks/useTasks';
import { type TaskStatus } from './api/taskApi';
import ErrorBanner from './components/ErrorBanner';
import Pagination from './components/Pagination';
import StatusFilter from './components/StatusFilter';
import TaskDetails from './components/TaskDetails';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';

interface ToastState {
  message: string;
  type: 'error' | 'success';
}

export default function App() {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {
    tasks,
    allTasks,
    counts,
    page,
    total,
    totalPages,
    loading,
    saving,
    error,
    addTask,
    updateStatus,
    changePage,
  } = useTasks(status);
  const selectedTask = allTasks.find((task) => task.id === selectedId) ?? null;
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeDetails = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    if (!error) return;
    setToast({ message: error.message, type: 'error' });
  }, [error]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function changeFilter(nextStatus: TaskStatus | ''): void {
    setStatus(nextStatus);
    if (page !== 1) changePage(1);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f7f9]">
      <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-2 text-[17px] font-bold leading-6 sm:text-lg">
          <span
            className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white"
            aria-hidden="true"
          >
            ✓
          </span>
          <span className="truncate">Sprout Task Manager</span>
        </div>
        <button
          className="ml-auto min-h-11 shrink-0 rounded-lg bg-teal-700 px-4 text-base font-semibold text-white shadow-sm lg:hidden"
          type="button"
          onClick={() => setFormOpen(true)}
        >
          Create task
        </button>
        {toast && (
          <div className="pointer-events-none absolute inset-x-4 top-[calc(100%+0.75rem)] flex justify-center sm:inset-x-8">
            <Toast message={toast.message} type={toast.type} />
          </div>
        )}
      </header>
      <main className="mx-auto grid w-[calc(100%-2rem)] max-w-7xl gap-6 py-6 sm:w-[calc(100%-4rem)] sm:gap-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0">
          <div className="mb-4">
            <h1 className="m-0 text-3xl font-bold leading-9">Tasks</h1>
            <p className="mt-1 text-base leading-6 text-gray-600 sm:text-[17px]">
              View, create and update the status of your tasks.
            </p>
          </div>
          <StatusFilter value={status} counts={counts} onChange={changeFilter} />
          {error?.scope === 'load' && <ErrorBanner message={error.message} onRetry={error.retry} />}
          <TaskList
            tasks={tasks}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={changePage}
          />
        </section>
        <aside className="hidden lg:block">
          <TaskForm
            onSubmit={addTask}
            onSuccess={() => setToast({ message: 'Task created successfully.', type: 'success' })}
            submitting={saving}
          />
        </aside>
      </main>
      <div className="lg:hidden">
        <TaskForm
          onSubmit={addTask}
          onSuccess={() => setToast({ message: 'Task created successfully.', type: 'success' })}
          submitting={saving}
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
      </div>
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          updating={saving}
          error={error?.scope === 'update' ? error : null}
          onStatusChange={updateStatus}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}
