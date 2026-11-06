import TaskItem from './TaskItem';

export default function TaskList({ tasks, onStatusChange }) {
  if (!tasks.length) return <p>No tasks found.</p>;
  return <ul>{tasks.map((task) => <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} />)}</ul>;
}
