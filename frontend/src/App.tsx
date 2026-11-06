import { useCallback, useState } from 'react';
import { PAGE_SIZE, useTasks } from './hooks/useTasks';
import { type TaskStatus } from './api/taskApi';
import ErrorBanner from './components/ErrorBanner';
import Pagination from './components/Pagination';
import StatusFilter from './components/StatusFilter';
import TaskDetails from './components/TaskDetails';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

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
  const closeDetails = useCallback(() => setSelectedId(null), []);

  function changeFilter(nextStatus: TaskStatus | ''): void {
    setStatus(nextStatus);
    if (page !== 1) changePage(1);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f7f9]">
      <header className="flex min-h-14 items-center border-b border-gray-200 bg-white px-5 sm:px-8">
        <div className="flex items-center gap-2 text-[18px] font-bold leading-6">
          <span
            className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white"
            aria-hidden="true"
          >
            ✓
          </span>
          <span>Sprout Task Manager</span>
        </div>
        <span className="ml-auto hidden text-sm text-gray-500 sm:block">
          {allTasks.length} tasks
        </span>
        <button
          className="ml-auto min-h-11 rounded-lg bg-teal-700 px-4 text-base font-semibold text-white sm:hidden"
          type="button"
          onClick={() => setFormOpen(true)}
        >
          New task
        </button>
      </header>
      <main className="mx-auto grid w-[calc(100%-2.5rem)] max-w-7xl gap-8 py-7 sm:w-[calc(100%-4rem)] sm:py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div className="mb-4">
            <h1 className="m-0 text-[28px] font-bold leading-9">Tasks</h1>
            <p className="mt-1 text-[17px] leading-6 text-gray-600">
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
