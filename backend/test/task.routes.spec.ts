import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';
import { pool } from '../src/config/db';

describe('Task routes integration', () => {
  before(async () => {
    await pool.query('DELETE FROM tasks');
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM tasks');
  });

  after(async () => {
    await pool.query('DELETE FROM tasks');
    await pool.end();
  });

  it('creates and retrieves a task from PostgreSQL', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Integration task', description: 'Stored in PostgreSQL' });

    expect(createResponse.status).to.equal(201);
    expect(createResponse.body.title).to.equal('Integration task');

    const listResponse = await request(app).get('/api/tasks?status=pending');
    expect(listResponse.status).to.equal(200);
    expect(listResponse.body).to.have.length(1);
    expect(listResponse.body[0].description).to.equal('Stored in PostgreSQL');
  });

  it('updates a task status in PostgreSQL', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Status transition' });

    const updateResponse = await request(app)
      .patch(`/api/tasks/${createResponse.body.id}/status`)
      .send({ status: 'completed' });

    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.body.status).to.equal('completed');
  });

  it('filters tasks by each supported status', async () => {
    for (const status of ['pending', 'in_progress', 'completed']) {
      await request(app).post('/api/tasks').send({ title: `${status} task`, status });
    }

    for (const status of ['pending', 'in_progress', 'completed']) {
      const response = await request(app).get(`/api/tasks?status=${status}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.length(1);
      expect(response.body[0].status).to.equal(status);
    }
  });

  it('rejects an invalid status filter', async () => {
    const response = await request(app).get('/api/tasks?status=blocked');
    expect(response.status).to.equal(400);
    expect(response.body.error).to.contain('pending');
  });

  it('rejects titles over the database and service limit', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'x'.repeat(201) });
    expect(response.status).to.equal(400);
  });

  it('rejects a null or array request body', async () => {
    const nullResponse = await request(app)
      .post('/api/tasks')
      .set('Content-Type', 'application/json')
      .send('null');
    const arrayResponse = await request(app).post('/api/tasks').send([]);
    expect(nullResponse.status).to.equal(400);
    expect(arrayResponse.status).to.equal(400);
  });

  it('returns 404 for a valid but missing task id', async () => {
    const response = await request(app).patch('/api/tasks/999999/status').send({ status: 'completed' });
    expect(response.status).to.equal(404);
  });

  it('exposes a healthy database status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ status: 'ok', database: 'ok' });
  });

  it('enforces the database status constraint', async () => {
    let error: unknown;
    try {
      await pool.query(
        'INSERT INTO tasks (title, status) VALUES ($1, $2)',
        ['invalid status', 'blocked']
      );
    } catch (caught) {
      error = caught;
    }
    expect(error).to.be.instanceOf(Error);
  });
});
