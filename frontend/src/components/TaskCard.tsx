import type { Task } from '../api/taskApi';
import DOMPurify from 'dompurify';
import StatusBadge from './StatusBadge';

interface TaskCardProps {
  task: Task;
  selected: boolean;
  onSelect: (id: number) => void;
}

function formatCreatedAt(value?: string): string {
  if (!value) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
}

export default function TaskCard({ task, selected, onSelect }: TaskCardProps) {
  const descriptionPreview = task.description
    ? DOMPurify.sanitize(task.description, { ALLOWED_TAGS: [] }).replace(/\s+/g, ' ').trim()
    : '';

  return (
    <button
      type="button"
      className={`flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-xl border bg-white px-4 py-4 text-left text-gray-900 shadow-sm transition hover:border-gray-300 sm:px-5 ${
        selected ? 'border-teal-700 bg-teal-50' : 'border-gray-200'
      }`}
      aria-haspopup="dialog"
      onClick={() => onSelect(task.id)}
    >
      <span className="flex min-w-0 items-start gap-2">
        <span className="min-w-0 flex-1 break-words text-[17px] font-semibold leading-6">
          {task.title}
        </span>
        <StatusBadge status={task.status} />
        <span 
          className="shrink-0 text-2xl font-light leading-6 text-gray-400" aria-hidden="true">
        </span>
      </span>
      {descriptionPreview && (
        <span className="min-w-0 max-w-full line-clamp-2 break-words pr-2 text-sm leading-5 text-gray-600">
          {descriptionPreview}
        </span>
      )}
      <span className="break-words text-sm text-gray-500">
        Created {formatCreatedAt(task.created_at)}
      </span>
    </button>
  );
}
