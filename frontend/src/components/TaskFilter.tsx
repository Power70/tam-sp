import type { TaskStatus } from '../api/taskApi';

interface TaskFilterProps {
  value: TaskStatus | '';
  onChange: (value: TaskStatus | '') => void;
}

export default function TaskFilter({ value, onChange }: TaskFilterProps) {
  return <label>Filter:
    <select value={value} onChange={(event) => onChange(event.target.value as TaskStatus | '')}>
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="in_progress">In progress</option>
      <option value="completed">Completed</option>
    </select>
  </label>;
}
