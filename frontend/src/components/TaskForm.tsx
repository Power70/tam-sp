import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NewTask } from '../api/taskApi';

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!title.trim()) return;
    await onSubmit({ title, description });
    setTitle('');
    setDescription('');
  }

  return <form onSubmit={handleSubmit}>
    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" aria-label="Task title" />
    <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" aria-label="Task description" />
    <button type="submit">Add task</button>
  </form>;
}
