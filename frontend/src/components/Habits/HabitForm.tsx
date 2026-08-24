import { useState, type FormEvent } from 'react';
import { useCreateHabit } from '../../hooks/useHabits';
import { getErrorMessage } from '../../services/api';

interface Props {
  onClose: () => void;
}

export default function HabitForm({ onClose }: Props) {
  const create = useCreateHabit();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await create.mutateAsync({ name, description: description || undefined });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-lg border border-[#e9e9e7] bg-white p-6 shadow-xs">
        <h2 className="text-base font-semibold text-[#37352f]">New Habit</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="habit-name" className="block text-xs font-medium text-[#787774]">
              Name
            </label>
            <input
              id="habit-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water, Read, Run"
              className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] placeholder-[#9b9a97] focus:border-[#2383e2] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="habit-desc" className="block text-xs font-medium text-[#787774]">
              Description (optional)
            </label>
            <textarea
              id="habit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] placeholder-[#9b9a97] focus:border-[#2383e2] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#e9e9e7] px-3 py-1.5 text-xs font-medium text-[#37352f] hover:bg-[#f7f6f3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="rounded-md bg-[#2383e2] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1d6bf3] disabled:opacity-50 transition-colors"
            >
              {create.isPending ? 'Creating…' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
