import express from 'express';
import * as controller from '../controllers/task.controller';
import { validateCreateTask, validateStatus, validateTaskFilter } from '../middleware/validate';

const router = express.Router();

router.get('/', validateTaskFilter, controller.list);
router.post('/', validateCreateTask, controller.create);
router.patch('/:id/status', validateStatus, controller.updateStatus);

export default router;
