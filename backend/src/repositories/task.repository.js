const { pool } = require('../config/db');

const columns = 'id, title, description, status, created_at, updated_at';

async function findAll(status) {
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

async function findById(id) {
  const result = await pool.query(`SELECT ${columns} FROM tasks WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function create({ title, description, status = 'pending' }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status)
     VALUES ($1, $2, $3)
     RETURNING ${columns}`,
    [title, description || null, status]
  );
  return result.rows[0];
}

async function updateStatus(id, status) {
  const result = await pool.query(
    `UPDATE tasks SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING ${columns}`,
    [status, id]
  );
  return result.rows[0] || null;
}

module.exports = { findAll, findById, create, updateStatus };
