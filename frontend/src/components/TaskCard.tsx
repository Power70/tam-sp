import type { Task } from '../api/taskApi';
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
  return (
    <button
      type="button"
      className={`grid w-full grid-cols-[minmax(0,1fr)_auto_auto] grid-rows-2 items-center gap-x-3 gap-y-1 rounded-xl border bg-white px-4 py-4 text-left text-gray-900 shadow-sm transition hover:border-gray-300 ${
        selected ? 'border-teal-700 bg-teal-50' : 'border-gray-200'
      }`}
      aria-haspopup="dialog"
      onClick={() => onSelect(task.id)}
    >
      <span className="truncate text-[17px] font-semibold leading-6">{task.title}</span>
      <span className="row-span-2 text-2xl font-light text-gray-400" aria-hidden="true">
        ›
      </span>
      <span className="col-start-1 row-start-2 text-sm text-gray-500">
        Created {formatCreatedAt(task.created_at)}
      </span>
      <span className="col-start-2 row-span-2">
        <StatusBadge status={task.status} />
      </span>
    </button>
  );
}
