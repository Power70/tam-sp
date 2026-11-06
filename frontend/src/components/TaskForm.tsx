import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
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
      <section className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 lg:sticky lg:top-6 lg:max-h-none lg:rounded-xl lg:border lg:border-gray-200 lg:p-6">
        <div className="mb-1 flex justify-end lg:hidden">
          <button
            className="flex size-11 items-center justify-center text-gray-700"
            type="button"
            onClick={onClose}
            aria-label="Close new task form"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <h2 className="m-0 mb-4 text-base font-semibold">New task</h2>
        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold" htmlFor="task-title">
              Title <span className="text-red-700">*</span>
            </label>
            <input
              id="task-title"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-gray-500 disabled:opacity-60"
              value={title}
              maxLength={150}
              onChange={(event) => {
                setTitle(event.target.value);
                setTitleError('');
              }}
              placeholder="e.g. Review pull request"
              disabled={submitting}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'task-title-error' : undefined}
            />
            {titleError && (
              <span id="task-title-error" className="mt-1 block text-xs text-red-700">
                {titleError}
              </span>
            )}
          </div>

          <div>
            <span className="mb-1.5 block text-[13px] font-semibold">Description</span>
            <RichTextEditor value={description} onChange={setDescription} disabled={submitting} />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold" htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 disabled:opacity-60"
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
          </div>

          {formError && <p className="m-0 text-xs text-red-700">{formError}</p>}
          {success && (
            <p className="m-0 text-xs text-green-700" role="status">
              {success}
            </p>
          )}
          <button
            className="h-11 rounded-lg bg-teal-700 font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
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
