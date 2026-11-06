import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskFilter from './components/TaskFilter';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import type { TaskStatus } from './api/taskApi';

export default function App() {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const { tasks, loading, error, addTask, updateStatus } = useTasks(status);
  return <main>
    <h1>Sprout Task Manager</h1>
    <TaskForm onSubmit={addTask} />
    <TaskFilter value={status} onChange={setStatus} />
    {error && <p role="alert">{error}</p>}
    {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} onStatusChange={updateStatus} />}
  </main>;
}
