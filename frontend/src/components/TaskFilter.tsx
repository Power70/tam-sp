import { TASK_STATUSES, type TaskStatus } from '../api/taskApi';

interface TaskFilterProps {
  value: TaskStatus | '';
  onChange: (value: TaskStatus | '') => void;
}

export default function TaskFilter({ value, onChange }: TaskFilterProps) {
  return (
    <label>
      Filter:
      <select value={value} onChange={(event) => onChange(event.target.value as TaskStatus | '')}>
        <option value="">All</option>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.replace('_', ' ')}
          </option>
        ))}
      </select>
    </label>
  );
}
