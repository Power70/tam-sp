import { pool } from '../config/db';
import type { PersistedTaskInput, Task, TaskStatus } from '../domain/task';

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

  const countValues = status ? [status] : [];
  const [tasksResult, totalResult, countsResult] = await Promise.all([
    pool.query(query, values),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM tasks${status ? ' WHERE status = $1' : ''}`,
      countValues
    ),
    pool.query(`SELECT status, COUNT(*)::int AS count FROM tasks GROUP BY status`),
  ]);
  const counts = {
    all: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
  };
  for (const row of countsResult.rows as { status: TaskStatus; count: number }[]) {
    counts[row.status] = row.count;
    counts.all += row.count;
  }
  return { tasks: tasksResult.rows, total: totalResult.rows[0].total, counts };
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
