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
    expect(response.body.tasks).to.have.length(1);
    expect(response.body.tasks[0]).to.deep.include({ title: 'Existing task', status: 'pending' });
    expect(response.body.pagination).to.deep.equal({
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it('paginates and filters tasks on the server', async () => {
    await pool.query(
      `INSERT INTO tasks (title, status)
       VALUES ('Pending one', 'pending'), ('Pending two', 'pending'), ('Completed', 'completed')`
    );

    const response = await request(app).get('/api/tasks?status=pending&page=2&pageSize=1');

    expect(response.status).to.equal(200);
    expect(response.body.tasks).to.have.length(1);
    expect(response.body.pagination).to.deep.include({
      page: 2,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
    expect(response.body.counts).to.deep.equal({
      all: 3,
      pending: 2,
      in_progress: 0,
      completed: 1,
    });
  });

  it('rejects invalid pagination parameters', async () => {
    const response = await request(app).get('/api/tasks?page=0&pageSize=101');

    expect(response.status).to.equal(400);
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
