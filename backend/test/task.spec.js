const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const repository = require('../src/repositories/task.repository');

describe('Task routes', () => {
  beforeEach(() => {
    repository.findAll = async () => [{ id: 1, title: 'Write tests', status: 'pending' }];
    repository.create = async (task) => ({ id: 2, ...task });
    repository.updateStatus = async (id, status) => id === '2' ? { id: 2, title: 'Write tests', status } : null;
  });

  it('lists tasks', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.length(1);
  });

  it('rejects an invalid task', async () => {
    const response = await request(app).post('/api/tasks').send({ title: '' });
    expect(response.status).to.equal(400);
  });

  it('creates a task', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'Plan sprint' });
    expect(response.status).to.equal(201);
    expect(response.body.title).to.equal('Plan sprint');
  });

  it('updates task status', async () => {
    const response = await request(app).patch('/api/tasks/2/status').send({ status: 'completed' });
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('completed');
  });
});
