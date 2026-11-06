import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../src/app';
import repository from '../src/repositories/task.repository';

describe('Task routes', () => {
  afterEach(() => sinon.restore());

  beforeEach(() => {
    sinon.stub(repository, 'findAll').resolves([{ id: 1, title: 'Write tests', status: 'pending' }]);
    sinon.stub(repository, 'create').callsFake(async (task) => ({
      id: 2,
      ...task,
      status: task.status ?? 'pending',
    }));
    sinon.stub(repository, 'updateStatus').callsFake(async (id, status) => id === 2 ? { id: 2, title: 'Write tests', status } : null);
  });

  it('lists tasks and passes an optional status filter to the service', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.length(1);
  });

  it('rejects an empty title', async () => {
    const response = await request(app).post('/api/tasks').send({ title: '' });
    expect(response.status).to.equal(400);
  });

  it('rejects a title containing only whitespace', async () => {
    const response = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(response.status).to.equal(400);
  });

  it('rejects a title over 200 characters at the HTTP boundary', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'x'.repeat(201) });
    expect(response.status).to.equal(400);
  });

  it('rejects a non-string description', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'Task', description: 123 });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Description must be a string.');
  });

  it('rejects an invalid create status at the HTTP boundary', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'Task', status: 'blocked' });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.contain('pending');
  });

  it('rejects a request body that is not an object', async () => {
    const response = await request(app).post('/api/tasks').send([]);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Request body must be an object.');
  });

  it('creates a task with the pending default', async () => {
    const response = await request(app).post('/api/tasks').send({ title: 'Plan sprint' });
    expect(response.status).to.equal(201);
    expect(response.body.title).to.equal('Plan sprint');
    expect(response.body.status).to.equal('pending');
  });

  it('updates task status', async () => {
    const response = await request(app).patch('/api/tasks/2/status').send({ status: 'completed' });
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('completed');
  });

  it('rejects an invalid status before reaching the controller', async () => {
    const response = await request(app).patch('/api/tasks/2/status').send({ status: 'blocked' });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.contain('pending');
  });

  it('rejects an array status body', async () => {
    const response = await request(app)
      .patch('/api/tasks/2/status')
      .set('Content-Type', 'application/json')
      .send('[]');
    expect(response.status).to.equal(400);
  });

  it('rejects a repeated status query parameter', async () => {
    const response = await request(app).get('/api/tasks?status=pending&status=completed');
    expect(response.status).to.equal(400);
  });

  it('rejects a non-integer task id', async () => {
    const response = await request(app).patch('/api/tasks/not-an-id/status').send({ status: 'completed' });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Task id must be an integer.');
  });

  it('returns not found when the repository cannot update the task', async () => {
    const response = await request(app).patch('/api/tasks/999/status').send({ status: 'completed' });
    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Task not found.');
  });

  it('maps unexpected repository errors to a 500 response', async () => {
    const findAll = repository.findAll as sinon.SinonStub;
    const logError = sinon.stub(console, 'error');
    findAll.rejects(new Error('database unavailable'));
    const response = await request(app).get('/api/tasks');
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('Internal server error.');
    expect(logError.calledOnce).to.equal(true);
  });

  it('maps malformed JSON to a 400 response', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Content-Type', 'application/json')
      .send('{"title":');
    expect(response.status).to.equal(400);
  });

  it('returns 404 for an unknown route', async () => {
    const response = await request(app).get('/api/unknown');
    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal('Route not found.');
  });
});
