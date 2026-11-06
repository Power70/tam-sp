import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../api/taskApi';
import type { TaskError } from '../hooks/useTasks';
import ErrorBanner from './ErrorBanner';
import StatusBadge from './StatusBadge';

interface TaskDetailsProps {
  task: Task;
  updating: boolean;
  error: TaskError | null;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onClose: () => void;
}

function formatCreatedAt(value?: string): string {
  if (!value) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
}

function sanitizeDescription(value: string): string {
  const document = new DOMParser().parseFromString(DOMPurify.sanitize(value), 'text/html');
  document.querySelectorAll('a').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  return document.body.innerHTML;
}

export default function TaskDetails({
  task,
  updating,
  error,
  onStatusChange,
  onClose,
}: TaskDetailsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const description = task.description ? sanitizeDescription(task.description) : '';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      <button
        className="fixed inset-0 z-20 cursor-default bg-gray-900/50"
        aria-label="Close task details"
        onClick={onClose}
      />
      <aside
        className="fixed inset-x-0 bottom-0 z-30 max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[min(100%,480px)] sm:rounded-none sm:rounded-l-3xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <button className="text-base text-gray-600" type="button" onClick={onClose}>
            ‹ Tasks
          </button>
          <span className="text-sm font-semibold text-gray-500">Task details</span>
          <button
            ref={closeRef}
            className="text-3xl leading-none text-gray-600"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {error && <ErrorBanner message={error.message} onRetry={error.retry} />}
        <div className="mb-7">
          <h2 id="task-details-title" className="mb-3 text-2xl font-bold">
            {task.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={task.status} />
            <time className="text-sm text-gray-500" dateTime={task.created_at}>
              Created {formatCreatedAt(task.created_at)}
            </time>
          </div>
        </div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="detail-status">
          Status
        </label>
        <select
          id="detail-status"
          className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base"
          value={task.status}
          disabled={updating}
          onChange={(event) => void onStatusChange(task.id, event.target.value as TaskStatus)}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          {updating ? 'Saving…' : 'Changes are saved automatically.'}
        </p>
        <section className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="mb-3 text-lg font-semibold">Description</h3>
          {description ? (
            <div
              className="task-description text-base leading-7 text-gray-600"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className="text-base text-gray-500">No description provided.</p>
          )}
        </section>
        <button
          className="mt-8 min-h-12 w-full rounded-lg border border-gray-300 bg-white text-base font-semibold"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </aside>
    </>
  );
}
