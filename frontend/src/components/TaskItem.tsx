import type { ChangeEvent } from 'react';
import { TASK_STATUSES, type Task, type TaskStatus } from '../api/taskApi';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
}

export default function TaskItem({ task, onStatusChange }: TaskItemProps) {
  async function handleStatusChange(event: ChangeEvent<HTMLSelectElement>): Promise<void> {
    try {
      await onStatusChange(task.id, event.target.value as TaskStatus);
    } catch {
      return;
    }
  }

  return <li>
    <div><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}</div>
    <select value={task.status} onChange={handleStatusChange}>
      {TASK_STATUSES.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
    </select>
  </li>;
}
