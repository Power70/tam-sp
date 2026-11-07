import type { Task } from '../api/taskApi';
import TaskCard from './TaskCard';
import SkeletonCard from './SkeletonCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function TaskList({ tasks, loading, selectedId, onSelect }: TaskListProps) {
  if (loading) {
    return (
      <div className="grid gap-3" aria-busy="true" aria-label="Loading tasks">
        {[1, 2, 3].map((item) => (
          <SkeletonCard key={item} />
        ))}
      </div>
    );
  }
  if (!tasks.length)
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center text-sm text-gray-600">
        <h2 className="mb-1 text-base font-semibold text-gray-900">No tasks found</h2>
        <p>Try another filter or create a new task.</p>
      </div>
    );
  return (
    <div className="grid min-w-0 gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} selected={task.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
