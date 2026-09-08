import { Router } from 'express';
import * as habitController from '../controllers/habitController';
import * as analyticsController from '../controllers/analyticsController';
import * as checkInController from '../controllers/checkInController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createHabitSchema, updateHabitSchema } from '../validators/habit';
import { createCheckInSchema } from '../validators/checkIn';

const router = Router();

// All routes require auth
router.use(authMiddleware);

router.post('/', validate(createHabitSchema), habitController.create);
router.get('/', habitController.getAll);
router.get('/:id', habitController.getById);
router.get('/:id/analytics', analyticsController.getHabitAnalytics);
router.put('/:id', validate(updateHabitSchema), habitController.update);
router.patch('/:id/archive', habitController.archive);
router.delete('/:id', habitController.remove);

// Check-in sub-routes
router.post('/:id/check-ins', validate(createCheckInSchema), checkInController.create);
router.get('/:id/check-ins', checkInController.getByHabit);

export default router;
