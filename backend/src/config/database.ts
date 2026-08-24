import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/habittracker';

export async function connectDB(customUri?: string): Promise<typeof mongoose> {
  const uri = customUri || process.env.MONGODB_URI || process.env.DATABASE_URL || DEFAULT_URI;
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  return mongoose.connect(uri);
}

export async function runMigrations(): Promise<void> {
  await connectDB();
  const models = mongoose.models;
  for (const name in models) {
    await models[name].syncIndexes();
  }
}

export async function closePool(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export default connectDB;
