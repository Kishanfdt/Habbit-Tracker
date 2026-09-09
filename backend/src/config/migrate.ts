import { runMigrations, closePool } from './database';
import { logger } from '../utils/logger';

async function main() {
  try {
    logger.info('Starting database migrations...');
    await runMigrations();
    logger.info('All migrations completed successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Migration failed');
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
