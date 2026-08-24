import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDB, closePool } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

jest.setTimeout(60000);

let mongoServer: MongoMemoryServer | null = null;

export async function setupTestDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }
  await connectDB(mongoServer.getUri());
}

export async function truncateAllTables(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

export async function closeTestDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await truncateAllTables();
  }
}

// Jest hooks
beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  if (mongoServer) {
    await closePool();
    await mongoServer.stop();
    mongoServer = null;
  }
});
