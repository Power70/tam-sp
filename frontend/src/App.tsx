import { useState } from 'react';
import { PAGE_SIZE, useTasks } from './hooks/useTasks';
import { type TaskStatus } from './api/taskApi';
import ErrorBanner from './components/ErrorBanner';
import Pagination from './components/Pagination';
import StatusFilter from './components/StatusFilter';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [formOpen, setFormOpen] = useState(false);
  const {
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
  } = useTasks(status);

  function changeFilter(nextStatus: TaskStatus | ''): void {
    setStatus(nextStatus);
    if (page !== 1) changePage(1);
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="flex min-h-14 items-center border-b border-gray-200 bg-white px-5 sm:px-8">
        <div className="flex items-center gap-2 text-base font-bold sm:text-lg">
          <span
            className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white"
            aria-hidden="true"
          >
            ✓
          </span>
          <span>Sprout Task Manager</span>
        </div>
        <span className="ml-auto hidden text-xs text-gray-500 sm:block">{total} tasks</span>
        <button
          className="ml-auto min-h-10 rounded-lg bg-teal-700 px-4 font-semibold text-white sm:hidden"
          type="button"
          onClick={() => setFormOpen(true)}
        >
          New task
        </button>
      </header>
      <main className="mx-auto grid w-[calc(100%-2rem)] max-w-7xl gap-8 py-7 sm:w-[calc(100%-4rem)] sm:py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div className="mb-4">
            <h1 className="m-0 text-2xl font-bold">Tasks</h1>
            <p className="mt-1 text-sm text-gray-600">
              View, create and update the status of your tasks.
            </p>
          </div>
          <StatusFilter value={status} counts={counts} onChange={changeFilter} />
          {error && <ErrorBanner message={error} onRetry={() => void refresh()} />}
          <TaskList
            tasks={tasks}
            loading={loading}
            updating={saving}
            onStatusChange={updateStatus}
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
          <TaskForm onSubmit={addTask} submitting={saving} />
        </aside>
      </main>
      <div className="lg:hidden">
        <TaskForm
          onSubmit={addTask}
          submitting={saving}
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
      </div>
    </div>
  );
}
