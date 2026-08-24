import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import Navbar from '../components/Layout/Navbar';
import StreakDisplay from '../components/Habits/StreakDisplay';
import CheckInButton from '../components/Habits/CheckInButton';
import { useHabit, useCreateCheckIn, useDeleteHabit } from '../hooks/useHabits';
import { getErrorMessage } from '../services/api';

export default function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habitId = id!;

  const { data: habit, isLoading, error } = useHabit(habitId);
  const createCheckIn = useCreateCheckIn();
  const deleteHabit = useDeleteHabit();

  const [backfillDate, setBackfillDate] = useState('');
  const [backfillError, setBackfillError] = useState('');

  const handleBackfill = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackfillError('');
    try {
      await createCheckIn.mutateAsync({ habitId, date: backfillDate });
      setBackfillDate('');
    } catch (err) {
      setBackfillError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this habit? This cannot be undone.')) {
      return;
    }
    try {
      await deleteHabit.mutateAsync(habitId);
      navigate('/dashboard');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            Habit not found or failed to load.
          </div>
        </div>
      </div>
    );
  }

  const checkedInToday = habit.checkIns.some(
    (ci) => ci.local_date === format(new Date(), 'yyyy-MM-dd'),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{habit.name}</h1>
              {habit.description && (
                <p className="mt-2 text-gray-600">{habit.description}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Created {format(parseISO(habit.created_at), 'MMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {deleteHabit.isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <CheckInButton habitId={habitId} checkedInToday={checkedInToday} />
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <StreakDisplay streaks={habit.streaks} size="lg" />
          </div>
        </div>

        {/* Backfill Form */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Backfill a Past Date</h2>
          <form onSubmit={handleBackfill} className="mt-4 flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="backfill-date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                id="backfill-date"
                type="date"
                value={backfillDate}
                onChange={(e) => setBackfillDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={createCheckIn.isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {createCheckIn.isPending ? 'Adding…' : 'Add Check-in'}
            </button>
          </form>
          {backfillError && (
            <p className="mt-2 text-sm text-red-600">{backfillError}</p>
          )}
        </div>

        {/* Check-in History */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Check-in History</h2>

          {habit.checkIns.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No check-ins yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {habit.checkIns
                .slice()
                .reverse()
                .map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-2"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {format(parseISO(checkIn.local_date), 'EEEE, MMM d, yyyy')}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        at {format(parseISO(checkIn.checked_in_at), 'h:mm a')}
                      </span>
                    </div>
                    <span className="text-green-600">✓</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
