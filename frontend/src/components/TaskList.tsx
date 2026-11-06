import type { Task, TaskStatus } from '../api/taskApi';
import TaskCard from './TaskCard';
import SkeletonCard from './SkeletonCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  updating: boolean;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
}

export default function TaskList({ tasks, loading, updating, onStatusChange }: TaskListProps) {
  if (loading) {
    return (
      <div className="grid gap-3">
        {[1, 2, 3].map((item) => (
          <SkeletonCard key={item} />
        ))}
      </div>
    );
  }
  if (!tasks.length)
    return (
      <div className="px-4 py-12 text-center text-gray-600">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">No tasks found</h2>
        <p>Try another filter or create a new task.</p>
      </div>
    );
  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} updating={updating} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
