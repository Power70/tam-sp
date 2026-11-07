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
      className="mb-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible"
      aria-label="Filter tasks by status"
      role="group"
    >
      {filters.map((filter) => (
        <button
          className={`h-10 shrink-0 whitespace-nowrap rounded-lg border px-3.5 text-sm ${
            value === filter.value
              ? 'border-teal-700 bg-teal-100 font-semibold text-teal-800'
              : 'border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50'
          }`}
          key={filter.value || 'all'}
          type="button"
          onClick={() => onChange(filter.value)}
          aria-pressed={value === filter.value}
        >
          {filter.label} <span>{filter.count}</span>
        </button>
      ))}
    </div>
  );
}
