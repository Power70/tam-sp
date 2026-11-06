import { pool } from '../config/db';
import type { PersistedTaskInput, Task, TaskStatus } from '../domain/task';

const columns = 'id, title, description, status, created_at, updated_at';

export async function findAll(status?: TaskStatus): Promise<Task[]> {
  const values = [];
  let query = `SELECT ${columns} FROM tasks`;
  if (status) {
    values.push(status);
    query += ' WHERE status = $1';
  }
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, values);
  return result.rows;
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

export default { findAll, findById, create, updateStatus };
