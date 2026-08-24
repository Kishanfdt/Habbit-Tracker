import { Pool } from 'pg';
import { runMigrations } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;

export async function setupTestDB(): Promise<Pool> {
  pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  });

  await runMigrations();
  return pool;
}

export async function truncateAllTables(): Promise<void> {
  await pool.query('TRUNCATE TABLE check_ins CASCADE');
  await pool.query('TRUNCATE TABLE habits CASCADE');
  await pool.query('TRUNCATE TABLE users CASCADE');
}

export async function closeTestDB(): Promise<void> {
  await pool.end();
}

// Jest hooks
beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  await closeTestDB();
});
