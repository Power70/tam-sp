import TaskItem from './TaskItem';
import type { Task, TaskStatus } from '../api/taskApi';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
}

export default function TaskList({ tasks, onStatusChange }: TaskListProps) {
  if (!tasks.length) return <p>No tasks found.</p>;
  return <ul>{tasks.map((task) => <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} />)}</ul>;
}
