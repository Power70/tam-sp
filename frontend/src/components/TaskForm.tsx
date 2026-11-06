import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NewTask } from '../api/taskApi';

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>;
  submitting?: boolean;
}

export default function TaskForm({ onSubmit, submitting = false }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      await onSubmit({ title, description });
      setTitle('');
      setDescription('');
    } catch {
      return;
    }
  }

  return <form onSubmit={handleSubmit}>
    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" aria-label="Task title" disabled={submitting} />
    <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" aria-label="Task description" disabled={submitting} />
    <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add task'}</button>
  </form>;
}
