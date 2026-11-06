export default function TaskFilter({ value, onChange }) {
  return <label>Filter:
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="in_progress">In progress</option>
      <option value="completed">Completed</option>
    </select>
  </label>;
}
