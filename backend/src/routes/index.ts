import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './auth';
import habitRoutes from './habits';
import analyticsRoutes from './analytics';

const router = Router();

// Locate and load openapi.yaml
const openapiPaths = [
  path.resolve(process.cwd(), 'openapi.yaml'),
  path.resolve(__dirname, '../../openapi.yaml'),
  path.resolve(__dirname, '../openapi.yaml'),
];
const openapiPath = openapiPaths.find((p) => fs.existsSync(p));

if (openapiPath) {
  const yamlContent = fs.readFileSync(openapiPath, 'utf8');
  const swaggerDocument = YAML.parse(yamlContent);
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
