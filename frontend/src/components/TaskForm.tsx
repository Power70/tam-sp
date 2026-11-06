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
    <div className="form-overlay" role="dialog" aria-modal="true" aria-label="New task">
      <section className="task-form-card">
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close new task form"
        >
          ×
        </button>
        <h2>New task</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="task-title">
            Title <span className="required">*</span>
          </label>
          <input
            id="task-title"
            value={title}
            maxLength={150}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError('');
            }}
            placeholder="e.g. Review pull request"
            disabled={submitting}
          />
          {titleError && <span className="field-error">{titleError}</span>}

          <label>Description</label>
          <RichTextEditor value={description} onChange={setDescription} disabled={submitting} />

          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
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

          {formError && <p className="field-error">{formError}</p>}
          {success && (
            <p className="success-message" role="status">
              {success}
            </p>
          )}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create task'}
          </button>
        </form>
      </section>
    </div>
  );
}
