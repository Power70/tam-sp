import { useState } from 'react';
import DOMPurify from 'dompurify';
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../api/taskApi';
import StatusBadge from './StatusBadge';

interface TaskCardProps {
  task: Task;
  updating: boolean;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
}

function formatCreatedAt(value?: string): string {
  if (!value) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
}

function sanitizeDescription(value: string): string {
  const clean = DOMPurify.sanitize(value);
  const container = document.createElement('div');
  container.innerHTML = clean;
  container.querySelectorAll('a').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  return container.innerHTML;
}

export default function TaskCard({ task, updating, onStatusChange }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const description = task.description ? sanitizeDescription(task.description) : '';

  return (
    <article
      className={`cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded((current) => !current)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="m-0 text-base font-semibold">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      {description ? (
        <div
          className={`task-description my-3 overflow-hidden text-sm leading-6 text-gray-600 ${expanded ? '' : 'line-clamp-4'}`}
          dangerouslySetInnerHTML={{ __html: description }}
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <p className="my-3 text-sm text-gray-500">No description provided.</p>
      )}
      <div
        className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3"
        onClick={(event) => event.stopPropagation()}
      >
        <time className="text-xs text-gray-500" dateTime={task.created_at}>
          Created {formatCreatedAt(task.created_at)}
        </time>
        <select
          className="min-h-10 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-700 disabled:cursor-wait disabled:opacity-60"
          aria-label={`Status for ${task.title}`}
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
      </div>
    </article>
  );
}
