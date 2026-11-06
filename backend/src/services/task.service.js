const repository = require('../repositories/task.repository');

const STATUSES = ['pending', 'in_progress', 'completed'];

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

function validateTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 200) {
    throw new ValidationError('Title is required and must be 1-200 characters.');
  }
}

function validateStatus(status) {
  if (!STATUSES.includes(status)) {
    throw new ValidationError(`Status must be one of: ${STATUSES.join(', ')}.`);
  }
}

async function listTasks(status) {
  if (status) validateStatus(status);
  return repository.findAll(status);
}

async function createTask(input = {}) {
  validateTitle(input.title);
  if (input.status) validateStatus(input.status);
  return repository.create({
    title: input.title.trim(),
    description: typeof input.description === 'string' ? input.description.trim() : null,
    status: input.status || 'pending'
  });
}

async function updateTaskStatus(id, status) {
  validateStatus(status);
  const task = await repository.updateStatus(id, status);
  if (!task) throw new NotFoundError('Task not found.');
  return task;
}

module.exports = { STATUSES, ValidationError, NotFoundError, listTasks, createTask, updateTaskStatus };
