import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import repository from '../src/repositories/task.repository';
import {
  STATUSES,
  ValidationError,
  NotFoundError,
  createTask,
  listTasks,
  updateTaskStatus,
  validateStatus,
} from '../src/services/task.service';

type ErrorClass = new (message: string) => Error;

async function expectRejected(promise: Promise<unknown>, errorType: ErrorClass): Promise<void> {
  try {
    await promise;
    expect.fail(`Expected ${errorType.name} to be thrown`);
  } catch (error) {
    expect(error).to.be.instanceOf(errorType);
  }
}

describe('Task service', () => {
  afterEach(() => sinon.restore());

  it('accepts every supported status', () => {
    for (const status of STATUSES) {
      expect(() => validateStatus(status)).not.to.throw();
    }
  });

  it('rejects missing and unsupported statuses', () => {
    for (const status of [undefined, null, '', 'blocked', 1]) {
      expect(() => validateStatus(status)).to.throw(ValidationError);
    }
  });

  it('requires a non-empty title', async () => {
    const create = sinon.stub(repository, 'create');
    for (const title of [undefined, null, '', '   ', 123, 'x'.repeat(201)]) {
      await expectRejected(createTask({ title }), ValidationError);
    }
    expect(create.called).to.equal(false);
  });

  it('trims title and description before persistence', async () => {
    const create = sinon.stub(repository, 'create').resolves({
      id: 1,
      title: 'Clean title',
      description: 'Clean description',
      status: 'pending',
    });

    await createTask({ title: '  Clean title  ', description: '  Clean description  ' });

    expect(create.calledOnce).to.equal(true);
    expect(create.firstCall.args[0]).to.deep.equal({
      title: 'Clean title',
      description: 'Clean description',
      status: 'pending',
    });
  });

  it('rejects a non-string description', async () => {
    const create = sinon.stub(repository, 'create').resolves({
      id: 1,
      title: 'Task',
      description: null,
      status: 'pending',
    });

    await expectRejected(createTask({ title: 'Task', description: 42 }), ValidationError);
    expect(create.called).to.equal(false);
  });

  it('rejects an explicitly supplied empty status', async () => {
    const create = sinon.stub(repository, 'create');
    await expectRejected(createTask({ title: 'Task', status: '' }), ValidationError);
    expect(create.called).to.equal(false);
  });

  it('validates list filters before querying', async () => {
    const findPage = sinon.stub(repository, 'findPage').resolves({
      tasks: [],
      total: 0,
      counts: { all: 0, pending: 0, in_progress: 0, completed: 0 },
    });
    await expectRejected(listTasks('blocked'), ValidationError);
    expect(findPage.called).to.equal(false);
  });

  it('lists tasks without a filter', async () => {
    const tasks = [{ id: 1, title: 'Task', status: 'pending' as const }];
    const findPage = sinon.stub(repository, 'findPage').resolves({
      tasks,
      total: 1,
      counts: { all: 1, pending: 1, in_progress: 0, completed: 0 },
    });
    expect((await listTasks()).tasks).to.equal(tasks);
    expect(findPage.calledOnce).to.equal(true);
    expect(findPage.firstCall.args).to.deep.equal([undefined, 1, 10]);
  });

  it('throws NotFoundError when a status update affects no task', async () => {
    sinon.stub(repository, 'updateStatus').resolves(null);
    await expectRejected(updateTaskStatus(99, 'completed'), NotFoundError);
  });

  it('does not query when an update status is invalid', async () => {
    const updateStatus = sinon.stub(repository, 'updateStatus');
    await expectRejected(updateTaskStatus(1, 'blocked' as never), ValidationError);
    expect(updateStatus.called).to.equal(false);
  });
});
