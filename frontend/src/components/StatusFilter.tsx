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
    <div className="status-filter" aria-label="Filter tasks by status" role="group">
      {filters.map((filter) => (
        <button
          className={value === filter.value ? 'filter-button selected' : 'filter-button'}
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
