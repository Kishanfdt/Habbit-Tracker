import { Pool, QueryResult, types } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATE column (OID 1082) directly as string 'YYYY-MM-DD' without timezone conversion
types.setTypeParser(1082, (val: string) => val);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: unknown[]): Promise<QueryResult> {
  return pool.query(text, params);
}

export async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, '..', '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`Migration complete: ${file}`);
    }
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
