import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../src/app';
import repository from '../src/repositories/task.repository';

describe('Task routes', () => {
  afterEach(() => sinon.restore());

  beforeEach(() => {
    sinon.stub(repository, 'findAll').resolves([{ id: 1, title: 'Write tests', status: 'pending' }]);
    sinon.stub(repository, 'create').callsFake(async (task) => ({ id: 2, ...task }));
    sinon.stub(repository, 'updateStatus').callsFake(async (id, status) => id === 2 ? { id: 2, title: 'Write tests', status } : null);
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
