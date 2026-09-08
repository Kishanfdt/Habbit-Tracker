import { Router } from 'express';
import authRoutes from './auth';
import habitRoutes from './habits';
import analyticsRoutes from './analytics';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
