import { STATUS_LABELS, TASK_STATUSES, type TaskStatus } from '../api/taskApi';

interface StatusFilterProps {
  value: TaskStatus | '';
  counts: Record<TaskStatus | 'all', number>;
  onChange: (value: TaskStatus | '') => void;
}

export default function StatusFilter({ value, counts, onChange }: StatusFilterProps) {
  const filters: { value: TaskStatus | ''; label: string; count: number }[] = [
    { value: '', label: 'All', count: counts.all },
    ...TASK_STATUSES.map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
      count: counts[status],
    })),
  ];

  return (
    <div
      className="mb-4 flex gap-2 overflow-x-auto pb-1"
      aria-label="Filter tasks by status"
      role="group"
    >
      {filters.map((filter) => (
        <button
          className={`min-h-10 shrink-0 rounded-lg border px-3 text-sm ${
            value === filter.value
              ? 'border-teal-700 bg-teal-50 font-semibold text-teal-800'
              : 'border-gray-200 bg-white text-gray-700'
          }`}
          key={filter.value || 'all'}
          type="button"
          onClick={() => onChange(filter.value)}
          aria-pressed={value === filter.value}
        >
          {filter.label} {filter.count}
        </button>
      ))}
    </div>
  );
}
