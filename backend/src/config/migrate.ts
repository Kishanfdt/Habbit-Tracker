import { runMigrations, closePool } from './database';

async function main() {
  try {
    console.log('Starting database migrations...');
    await runMigrations();
    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
