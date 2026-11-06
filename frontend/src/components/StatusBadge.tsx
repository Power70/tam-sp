import { STATUS_LABELS, type TaskStatus } from '../api/taskApi';

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ${
        status === 'pending'
          ? 'bg-amber-100 text-amber-800'
          : status === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          status === 'pending'
            ? 'bg-amber-700'
            : status === 'in_progress'
              ? 'bg-blue-600'
              : 'bg-green-600'
        }`}
        aria-hidden="true"
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
