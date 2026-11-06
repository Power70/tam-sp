import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setFormOpen(false);
  }, [status]);

  function changeFilter(nextStatus: TaskStatus | ''): void {
    setStatus(nextStatus);
    changePage(1);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            ✓
          </span>
          <strong>Sprout Task Manager</strong>
        </div>
        <span className="total-count">{total} tasks</span>
        <button className="mobile-new-button" type="button" onClick={() => setFormOpen(true)}>
          New task
        </button>
      </header>
      <main className="content-grid">
        <section className="tasks-section">
          <div className="section-heading">
            <h1>Tasks</h1>
            <p>View, create and update the status of your tasks.</p>
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
        <aside className="desktop-form">
          <TaskForm onSubmit={addTask} submitting={saving} />
        </aside>
      </main>
      <div className="mobile-form">
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
