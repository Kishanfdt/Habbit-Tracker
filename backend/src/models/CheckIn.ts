import mongoose, { Schema, Document } from 'mongoose';
import { CheckIn, ID } from '../types';

export interface ICheckInDocument extends Document {
  habit_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  checked_in_at: Date;
  local_date: string;
  created_at: Date;
}

const checkInSchema = new Schema<ICheckInDocument>({
  habit_id: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  checked_in_at: { type: Date, required: true },
  local_date: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// CRITICAL COMPOUND UNIQUE INDEX: Enforces 1 check-in per habit per local_date
checkInSchema.index({ habit_id: 1, local_date: 1 }, { unique: true });

export const CheckInModel =
  mongoose.models.CheckIn || mongoose.model<ICheckInDocument>('CheckIn', checkInSchema);

export function mapCheckIn(doc: ICheckInDocument | null): CheckIn | null {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    habit_id: doc.habit_id.toString(),
    user_id: doc.user_id.toString(),
    checked_in_at: doc.checked_in_at,
    local_date: doc.local_date,
    created_at: doc.created_at,
  };
}

export async function create(
  habitId: ID,
  userId: ID,
  checkedInAt: Date,
  localDate: string
): Promise<CheckIn> {
  const doc = await CheckInModel.create({
    habit_id: habitId,
    user_id: userId,
    checked_in_at: checkedInAt,
    local_date: localDate,
    created_at: new Date(),
  });
  return mapCheckIn(doc)!;
}

export async function findByHabitId(habitId: ID): Promise<CheckIn[]> {
  if (!mongoose.Types.ObjectId.isValid(habitId)) return [];
  const docs = await CheckInModel.find({ habit_id: habitId })
    .sort({ local_date: 1 })
    .exec();
  return docs.map((doc) => mapCheckIn(doc)!);
}

export async function getLocalDatesForHabit(habitId: ID): Promise<string[]> {
  if (!mongoose.Types.ObjectId.isValid(habitId)) return [];
  const docs = await CheckInModel.find({ habit_id: habitId })
    .sort({ local_date: 1 })
    .select('local_date')
    .exec();
  return docs.map((doc) => doc.local_date);
}

export async function findById(id: ID): Promise<CheckIn | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await CheckInModel.findById(id).exec();
  return mapCheckIn(doc);
}

export async function deleteById(id: ID): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const res = await CheckInModel.findByIdAndDelete(id).exec();
  return !!res;
}
