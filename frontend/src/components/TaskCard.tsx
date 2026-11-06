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
      className={`grid w-full grid-cols-[minmax(0,1fr)_auto_auto] grid-rows-[auto_auto_auto] items-center gap-x-3 gap-y-1 rounded-xl border bg-white px-4 py-4 text-left text-gray-900 shadow-sm transition hover:border-gray-300 sm:px-5 ${
        selected ? 'border-teal-700 bg-teal-50' : 'border-gray-200'
      }`}
      aria-haspopup="dialog"
      onClick={() => onSelect(task.id)}
    >
      <span className="truncate text-[17px] font-semibold leading-6">{task.title}</span>
      <span className="row-span-3 text-2xl font-light text-gray-400" aria-hidden="true">
        ›
      </span>
      {descriptionPreview && (
        <span className="col-start-1 row-start-2 line-clamp-2 pr-2 text-sm leading-5 text-gray-600">
          {descriptionPreview}
        </span>
      )}
      <span className="col-start-1 row-start-3 text-sm text-gray-500">
        Created {formatCreatedAt(task.created_at)}
      </span>
      <span className="col-start-2 row-span-3">
        <StatusBadge status={task.status} />
      </span>
    </button>
  );
}
