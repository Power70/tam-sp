import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';
import { pool } from '../src/config/db';

describe('Task routes integration', () => {
  before(async () => {
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
});
