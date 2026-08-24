import { Router } from 'express';
import authRoutes from './auth';
import habitRoutes from './habits';

const router = Router();

router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);

export default router;
