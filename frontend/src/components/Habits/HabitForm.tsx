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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">New Habit</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="habit-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water, Read, Run"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="habit-desc" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              id="habit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {create.isPending ? 'Creating…' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
