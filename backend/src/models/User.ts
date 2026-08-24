import mongoose, { Schema, Document } from 'mongoose';
import { User, ID } from '../types';

export interface IUserDocument extends Document {
  email: string;
  password_hash: string;
  timezone: string;
  created_at: Date;
}

const userSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, index: true },
  password_hash: { type: String, required: true },
  timezone: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const UserModel =
  mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export function mapUser(doc: IUserDocument | null): User | null {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    email: doc.email,
    password_hash: doc.password_hash,
    timezone: doc.timezone,
    created_at: doc.created_at,
  };
}

export async function findByEmail(email: string): Promise<User | null> {
  const doc = await UserModel.findOne({ email }).exec();
  return mapUser(doc);
}

export async function findById(id: ID): Promise<User | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await UserModel.findById(id).exec();
  return mapUser(doc);
}

export async function create(
  email: string,
  passwordHash: string,
  timezone: string
): Promise<User> {
  const doc = await UserModel.create({
    email,
    password_hash: passwordHash,
    timezone,
    created_at: new Date(),
  });
  return mapUser(doc)!;
}
