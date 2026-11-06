import { useState } from 'react';
import type { FormEvent } from 'react';
import { STATUS_LABELS, TASK_STATUSES, type NewTask, type TaskStatus } from '../api/taskApi';
import RichTextEditor from './RichTextEditor';

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>;
  submitting?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function TaskForm({
  onSubmit,
  submitting = false,
  open = true,
  onClose,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [titleError, setTitleError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    setTitleError('');
    setFormError('');
    try {
      await onSubmit({ title: title.trim(), description, status });
      setTitle('');
      setDescription('');
      setStatus('pending');
      setSuccess('Task created successfully.');
      window.setTimeout(() => setSuccess(''), 3000);
      onClose?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not create the task.');
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex items-end bg-gray-900/50 lg:static lg:block lg:bg-transparent"
      role="dialog"
      aria-modal="true"
      aria-label="New task"
    >
      <section className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-8 lg:max-h-none lg:rounded-xl lg:border lg:border-gray-200 lg:p-5">
        <button
          className="absolute right-6 top-4 text-3xl leading-none text-gray-600 lg:hidden"
          type="button"
          onClick={onClose}
          aria-label="Close new task form"
        >
          ×
        </button>
        <h2 className="mb-4 text-2xl font-bold lg:text-base">New task</h2>
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <label className="mt-1 text-sm font-semibold" htmlFor="task-title">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="task-title"
            className="min-h-10 w-full rounded-lg border border-gray-300 px-3"
            value={title}
            maxLength={150}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError('');
            }}
            placeholder="e.g. Review pull request"
            disabled={submitting}
          />
          {titleError && <span className="text-xs text-red-700">{titleError}</span>}

          <label className="mt-1 text-sm font-semibold">Description</label>
          <RichTextEditor value={description} onChange={setDescription} disabled={submitting} />

          <label className="mt-1 text-sm font-semibold" htmlFor="task-status">
            Status
          </label>
          <select
            id="task-status"
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-3"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            disabled={submitting}
          >
            {TASK_STATUSES.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>

          {formError && <p className="m-0 text-xs text-red-700">{formError}</p>}
          {success && (
            <p className="m-0 text-xs text-green-700" role="status">
              {success}
            </p>
          )}
          <button
            className="mt-2 min-h-10 rounded-lg bg-teal-700 font-semibold text-white disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating…' : 'Create task'}
          </button>
        </form>
      </section>
    </div>
  );
}
