import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { STATUS_LABELS, TASK_STATUSES, type NewTask, type TaskStatus } from '../api/taskApi';
import RichTextEditor from './RichTextEditor';

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>;
  onSuccess?: () => void;
  submitting?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function TaskForm({
  onSubmit,
  onSuccess,
  submitting = false,
  open = true,
  onClose,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [titleError, setTitleError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    setTitleError('');
    try {
      await onSubmit({ title: title.trim(), description, status });
      setTitle('');
      setDescription('');
      setStatus('pending');
      onSuccess?.();
      onClose?.();
    } catch {
      // The parent displays submission errors in the header toast.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-16 z-30 flex items-start bg-gray-900/50 lg:static lg:block lg:bg-transparent"
      role="dialog"
      aria-modal="true"
      aria-label="New task"
    >
      <section className="relative h-full max-h-[calc(100dvh-4rem)] w-full overflow-y-auto bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:sticky lg:top-6 lg:h-auto lg:max-h-none lg:rounded-xl lg:border lg:border-gray-200 lg:p-6">
        <div className="mb-1 flex justify-end lg:hidden">
          <button
            className="flex size-11 items-center justify-center text-gray-700"
            type="button"
            onClick={onClose}
            aria-label="Close new task form"
          >
            <X size={24} strokeWidth={4} aria-hidden="true" />
          </button>
        </div>
        <h2 className="m-0 mb-5 text-lg font-semibold">New task</h2>
        <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="task-title">
              Title <span className="text-red-700">*</span>
            </label>
            <input
              id="task-title"
              className="min-h-12 w-full rounded-lg border border-gray-300 px-3 text-base text-gray-900 placeholder:text-gray-500 disabled:opacity-60"
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
            <span className="mb-1.5 block text-sm font-semibold">Description</span>
            <RichTextEditor value={description} onChange={setDescription} disabled={submitting} />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold" htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900 disabled:opacity-60"
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

          <button
            className="min-h-12 rounded-lg bg-teal-700 text-base font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
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
