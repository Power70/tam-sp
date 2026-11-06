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
      className={`task-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded((current) => !current)}
    >
      <div className="task-card-top">
        <h3>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      {description ? (
        <div
          className="task-description"
          dangerouslySetInnerHTML={{ __html: description }}
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <p className="task-description muted">No description provided.</p>
      )}
      <div className="task-card-footer" onClick={(event) => event.stopPropagation()}>
        <time dateTime={task.created_at}>Created {formatCreatedAt(task.created_at)}</time>
        <select
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
