import type { ChangeEvent } from 'react';
import type { Task, TaskStatus } from '../api/taskApi';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
}

export default function TaskItem({ task, onStatusChange }: TaskItemProps) {
  return <li>
    <div><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}</div>
    <select value={task.status} onChange={(event: ChangeEvent<HTMLSelectElement>) => onStatusChange(task.id, event.target.value as TaskStatus)}>
      <option value="pending">Pending</option>
      <option value="in_progress">In progress</option>
      <option value="completed">Completed</option>
    </select>
  </li>;
}
