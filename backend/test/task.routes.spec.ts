import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';
import { pool } from '../src/config/db';
import { setupTestDatabase } from './fixtures/database';

describe('Task routes integration', () => {
  before(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM tasks');
  });

  after(async () => {
    await pool.query('DELETE FROM tasks');
    await pool.end();
  });

  it('creates a task and persists it in PostgreSQL', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Integration task', description: 'Stored in PostgreSQL' });

    expect(response.status).to.equal(201);
    const result = await pool.query('SELECT title, description, status FROM tasks WHERE id = $1', [
      response.body.id,
    ]);
    expect(result.rows[0]).to.deep.include({
      title: 'Integration task',
      description: 'Stored in PostgreSQL',
      status: 'pending',
    });
  });

  it('rejects missing task data without inserting a row', async () => {
    const response = await request(app).post('/api/tasks').send({});

    expect(response.status).to.equal(400);
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM tasks');
    expect(result.rows[0].count).to.equal(0);
  });

  it('lists persisted tasks through the API', async () => {
    await pool.query('INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3)', [
      'Existing task',
      'From PostgreSQL',
      'pending',
    ]);

    const response = await request(app).get('/api/tasks');

    expect(response.status).to.equal(200);
    expect(response.body).to.have.length(1);
    expect(response.body[0]).to.deep.include({ title: 'Existing task', status: 'pending' });
  });

  it('updates a task status and verifies the database state', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Status transition' });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'completed' });

    expect(response.status).to.equal(200);
    const result = await pool.query('SELECT status FROM tasks WHERE id = $1', [created.body.id]);
    expect(result.rows[0].status).to.equal('completed');
  });

  it('rejects invalid status input without changing the database', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Protected task' });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'blocked' });

    expect(response.status).to.equal(400);
    const result = await pool.query('SELECT status FROM tasks WHERE id = $1', [created.body.id]);
    expect(result.rows[0].status).to.equal('pending');
  });
});
