import { query, runMigrations, closePool } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

export async function setupTestDB(): Promise<void> {
  await runMigrations();
}

export async function truncateAllTables(): Promise<void> {
  await query('TRUNCATE TABLE check_ins CASCADE');
  await query('TRUNCATE TABLE habits CASCADE');
  await query('TRUNCATE TABLE users CASCADE');
}

export async function closeTestDB(): Promise<void> {
  await closePool();
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
