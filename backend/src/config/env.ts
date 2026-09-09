import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

export const envSchema = z.object({
  MONGODB_URI: z.string({
    required_error: 'MONGODB_URI is required',
  }).min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required',
  }).min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required').default('7d'),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required').default('http://localhost:5173'),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function validateEnv(): Env {
  const envToValidate = { ...process.env };
  // If running in test mode without an explicit MONGODB_URI (e.g. CI test runners with in-memory Mongo),
  // fallback to a dummy URI so tests don't exit before MongoMemoryServer starts.
  if (envToValidate.NODE_ENV === 'test' && !envToValidate.MONGODB_URI) {
    envToValidate.MONGODB_URI = 'mongodb://127.0.0.1:27017/habittracker_test';
  }

  const result = envSchema.safeParse(envToValidate);

  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => ({
      variable: issue.path.join('.'),
      error: issue.message,
    }));

    const formattedMessage = errorDetails
      .map((d) => `  - ${d.variable}: ${d.error}`)
      .join('\n');

    logger.error({ errors: errorDetails }, `Invalid environment configuration:\n${formattedMessage}`);
    process.exit(1);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export function getEnv(): Env {
  if (!cachedEnv) {
    return validateEnv();
  }
  return cachedEnv;
}
