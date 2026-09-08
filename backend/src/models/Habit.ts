import mongoose, { Schema, Document } from 'mongoose';
import { Habit, ID } from '../types';

export interface IHabitDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  name: string;
  description?: string | null;
  category?: string;
  archived: boolean;
  created_at: Date;
}

const habitSchema = new Schema<IHabitDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: null },
  category: {
    type: String,
    enum: ['health', 'productivity', 'learning', 'fitness', 'other'],
    default: 'other',
  },
  archived: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export const HabitModel =
  mongoose.models.Habit || mongoose.model<IHabitDocument>('Habit', habitSchema);

export function mapHabit(doc: IHabitDocument | null): Habit | null {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    user_id: doc.user_id.toString(),
    name: doc.name,
    description: doc.description || null,
    category: doc.category || 'other',
    archived: doc.archived ?? false,
    created_at: doc.created_at,
  };
}

export async function create(
  userId: ID,
  name: string,
  description?: string,
  category?: string
): Promise<Habit> {
  const doc = await HabitModel.create({
    user_id: userId,
    name,
    description: description || null,
    category: category || 'other',
    created_at: new Date(),
  });
  return mapHabit(doc)!;
}

export async function findByUserId(
  userId: ID,
  includeArchived: boolean = false
): Promise<Habit[]> {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const query: Record<string, unknown> = { user_id: userId };
  if (!includeArchived) {
    query.archived = { $ne: true };
  }
  const docs = await HabitModel.find(query)
    .sort({ created_at: -1 })
    .exec();
  return docs.map((doc) => mapHabit(doc)!);
}

export async function findById(id: ID): Promise<Habit | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await HabitModel.findById(id).exec();
  return mapHabit(doc);
}

export async function update(
  id: ID,
  name: string,
  description?: string,
  category?: string
): Promise<Habit | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await HabitModel.findByIdAndUpdate(
    id,
    { name, description: description || null, ...(category !== undefined && { category }) },
    { new: true }
  ).exec();
  return mapHabit(doc);
}

export async function deleteById(id: ID): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const res = await HabitModel.findByIdAndDelete(id).exec();
  return !!res;
}

export async function archive(id: ID): Promise<Habit | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await HabitModel.findByIdAndUpdate(
    id,
    { archived: true },
    { new: true }
  ).exec();
  return mapHabit(doc);
}
