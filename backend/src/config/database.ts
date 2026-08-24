import { Pool, QueryResult, types } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATE column (OID 1082) directly as string 'YYYY-MM-DD' without timezone conversion
types.setTypeParser(1082, (val: string) => val);

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool || (pool as unknown as { ended?: boolean }).ended) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

export async function query(text: string, params?: unknown[]): Promise<QueryResult> {
  return getPool().query(text, params);
}

export async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, '..', '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      console.log(`Running migration: ${file}`);
      await getPool().query(sql);
      console.log(`Migration complete: ${file}`);
    }
  }
}

export async function closePool(): Promise<void> {
  if (pool && !(pool as unknown as { ended?: boolean }).ended) {
    await pool.end();
    pool = null;
  }
}

export default pool;
