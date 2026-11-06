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
      <div className="task-list">
        {[1, 2, 3].map((item) => (
          <SkeletonCard key={item} />
        ))}
      </div>
    );
  }
  if (!tasks.length)
    return (
      <div className="empty-state">
        <h2>No tasks found</h2>
        <p>Try another filter or create a new task.</p>
      </div>
    );
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} updating={updating} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
