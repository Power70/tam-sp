const { STATUSES } = require('../services/task.service');

function validateCreateTask(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be an object.' });
  }
  next();
}

function validateStatus(req, res, next) {
  if (!req.body || !STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}.` });
  }
  next();
}

module.exports = { validateCreateTask, validateStatus };
