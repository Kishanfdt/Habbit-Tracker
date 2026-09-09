import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { runMigrations } from './config/database';
import { validateEnv } from './config/env';
import { logger } from './utils/logger';

dotenv.config();

// Parse and validate process.env once at startup
const env = validateEnv();

export const app = express();
const PORT = env.PORT;

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Main entry API routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export function startServer() {
  const server = app.listen(PORT, async () => {
    logger.info(`Server running on port ${PORT}`);
    if (env.NODE_ENV !== 'test') {
      try {
        await runMigrations();
      } catch (error) {
        logger.error({ err: error }, 'Failed to run migrations on startup');
      }
    }
  });
  return server;
}

if (env.NODE_ENV !== 'test') {
  startServer();
}
