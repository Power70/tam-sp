const service = require('../services/task.service');

async function list(req, res, next) {
  try {
    res.json(await service.listTasks(req.query.status));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await service.createTask(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    res.json(await service.updateTaskStatus(req.params.id, req.body.status));
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, updateStatus };
