import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { runMigrations } from './config/database';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Main entry API routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export function startServer() {
  const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    if (process.env.NODE_ENV !== 'test') {
      try {
        await runMigrations();
      } catch (error) {
        console.error('Failed to run migrations on startup:', error);
      }
    }
  });
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
