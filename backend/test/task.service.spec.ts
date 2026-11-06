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
  validateStatus
} from '../src/services/task.service';

async function expectRejected(promise: Promise<unknown>, errorType: Function): Promise<void> {
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
      status: 'pending'
    });

    await createTask({ title: '  Clean title  ', description: '  Clean description  ' });

    expect(create.calledOnce).to.equal(true);
    expect(create.firstCall.args[0]).to.deep.equal({
      title: 'Clean title',
      description: 'Clean description',
      status: 'pending'
    });
  });

  it('stores a null description when description is not a string', async () => {
    const create = sinon.stub(repository, 'create').resolves({
      id: 1,
      title: 'Task',
      description: null,
      status: 'pending'
    });

    await createTask({ title: 'Task', description: 42 });

    expect(create.calledOnce).to.equal(true);
    expect(create.firstCall.args[0]).to.deep.equal({
      title: 'Task',
      description: null,
      status: 'pending'
    });
  });

  it('rejects an explicitly supplied empty status', async () => {
    const create = sinon.stub(repository, 'create');
    await expectRejected(createTask({ title: 'Task', status: '' }), ValidationError);
    expect(create.called).to.equal(false);
  });

  it('validates list filters before querying', async () => {
    const findAll = sinon.stub(repository, 'findAll').resolves([]);
    await expectRejected(listTasks('blocked'), ValidationError);
    expect(findAll.called).to.equal(false);
  });

  it('lists tasks without a filter', async () => {
    const tasks = [{ id: 1, title: 'Task', status: 'pending' as const }];
    const findAll = sinon.stub(repository, 'findAll').resolves(tasks);
    expect(await listTasks()).to.equal(tasks);
    expect(findAll.calledOnce).to.equal(true);
    expect(findAll.firstCall.args[0]).to.equal(undefined);
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
