import { STATUS_LABELS, type TaskStatus } from '../api/taskApi';

const STYLES: Record<TaskStatus, { badge: string; dot: string }> = {
  pending: { badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-700' },
  in_progress: { badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-600' },
  completed: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-600' },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
