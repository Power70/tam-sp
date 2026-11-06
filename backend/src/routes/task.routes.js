const express = require('express');
const controller = require('../controllers/task.controller');
const { validateCreateTask, validateStatus } = require('../middleware/validate');

const router = express.Router();

router.get('/', controller.list);
router.post('/', validateCreateTask, controller.create);
router.patch('/:id/status', validateStatus, controller.updateStatus);

module.exports = router;
