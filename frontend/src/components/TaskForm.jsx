import { useState } from 'react';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event) {
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
