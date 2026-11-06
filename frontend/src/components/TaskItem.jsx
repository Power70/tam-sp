export default function TaskItem({ task, onStatusChange }) {
  return <li>
    <div><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}</div>
    <select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)}>
      <option value="pending">Pending</option>
      <option value="in_progress">In progress</option>
      <option value="completed">Completed</option>
    </select>
  </li>;
}
