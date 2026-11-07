import { pool } from '../config/db';
import type { PersistedTaskInput, Task, TaskStatus } from '../domain/task';

// Keep PostgreSQL access isolated from business rules.
const columns = 'id, title, description, status, created_at, updated_at';

export interface TaskPageResult {
  tasks: Task[];
  total: number;
  counts: Record<TaskStatus | 'all', number>;
}

export async function findPage(
  status: TaskStatus | undefined,
  page: number,
  pageSize: number
): Promise<TaskPageResult> {
  const offset = (page - 1) * pageSize;
  const values: (TaskStatus | number)[] = [];
  let query = `SELECT ${columns} FROM tasks`;
  if (status) {
    values.push(status);
    query += ' WHERE status = $1';
  }
  values.push(pageSize, offset);
  query += ` ORDER BY created_at DESC, id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

  const totalExpression = status ? 'COUNT(*) FILTER (WHERE status = $1)' : 'COUNT(*)';
  const metadataValues = status ? [status] : [];
  const [tasksResult, metadataResult] = await Promise.all([
    pool.query(query, values),
    pool.query(
      `SELECT
         ${totalExpression}::int AS total,
         COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
         COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
         COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
       FROM tasks`,
      metadataValues
    ),
  ]);
  const counts = {
    all: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
  };
  const metadata = metadataResult.rows[0];
  counts.pending = metadata.pending;
  counts.in_progress = metadata.in_progress;
  counts.completed = metadata.completed;
  counts.all = counts.pending + counts.in_progress + counts.completed;
  return { tasks: tasksResult.rows, total: metadata.total, counts };
}

export async function findById(id: number): Promise<Task | null> {
  const result = await pool.query(`SELECT ${columns} FROM tasks WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function create({ title, description, status }: PersistedTaskInput): Promise<Task> {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status)
     VALUES ($1, $2, $3)
     RETURNING ${columns}`,
    [title, description || null, status]
  );
  return result.rows[0];
}

export async function updateStatus(id: number, status: TaskStatus): Promise<Task | null> {
  const result = await pool.query(
    `UPDATE tasks SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING ${columns}`,
    [status, id]
  );
  return result.rows[0] || null;
}

export default { findPage, findById, create, updateStatus };
