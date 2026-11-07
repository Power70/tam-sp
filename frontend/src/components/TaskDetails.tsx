import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
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
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const dialog = closeRef.current?.closest('[role="dialog"]');
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), [href], input:not([disabled]), textarea:not([disabled])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <>
      <button
        className="fixed inset-x-0 bottom-0 top-16 z-20 cursor-default bg-gray-900/50"
        aria-label="Close task details"
        onClick={onClose}
      />
      <aside
        className="fixed inset-x-0 bottom-0 top-16 z-30 flex min-h-0 flex-col overflow-hidden bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:left-auto sm:right-0 sm:w-[min(100%,480px)] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <button className="text-base text-gray-600" type="button" onClick={onClose}>
            Back to tasks
          </button>
          <button
            ref={closeRef}
            className="text-3xl leading-none text-gray-600"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={24} strokeWidth={4} aria-hidden="true" />
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
        <section className="mt-8 flex min-h-0 flex-1 flex-col border-t border-gray-200 pt-6">
          <h3 className="mb-3 shrink-0 text-lg font-semibold">Description</h3>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {description ? (
              <div
                className="task-description text-base leading-7 text-gray-600"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base text-gray-500">No description provided.</p>
            )}
          </div>
        </section>
        <button
          className="mt-8 min-h-12 w-full shrink-0 rounded-lg border border-gray-300 bg-white text-base font-semibold"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </aside>
    </>
  );
}
