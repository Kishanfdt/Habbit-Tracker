import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import Navbar from '../components/Layout/Navbar';
import StreakDisplay from '../components/Habits/StreakDisplay';
import HabitTrendChart from '../components/Analytics/HabitTrendChart';
import CheckInButton from '../components/Habits/CheckInButton';
import { useHabit, useHabitCheckIns, useCreateCheckIn, useDeleteHabit } from '../hooks/useHabits';
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
  const [checkInPage, setCheckInPage] = useState(1);
  const { data: checkInsPageData, isLoading: isLoadingCheckIns } = useHabitCheckIns(habitId, checkInPage, 10);

  const past90Days = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      days.push(format(subDays(today, i), 'yyyy-MM-dd'));
    }
    return days;
  }, []);

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
      <div className="min-h-screen bg-[#fbfbfa]">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2383e2] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className="min-h-screen bg-[#fbfbfa]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            Habit not found or failed to load.
          </div>
        </main>
      </div>
    );
  }

  const checkedInDates = new Set(habit.checkIns.map((ci) => ci.local_date));
  const checkedInToday = checkedInDates.has(format(new Date(), 'yyyy-MM-dd'));

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-[#787774] hover:text-[#37352f] transition-colors"
        >
          ← Back to Dashboard
        </button>

        {/* Main Habit Header Card */}
        <div className="rounded-lg border border-[#e9e9e7] bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#37352f]">{habit.name}</h1>
              {habit.description && (
                <p className="mt-1.5 text-sm text-[#787774] leading-relaxed">{habit.description}</p>
              )}
              <p className="mt-2 text-xs text-[#9b9a97]">
                Created {format(parseISO(habit.created_at), 'MMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
              className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
            >
              {deleteHabit.isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <CheckInButton habitId={habitId} checkedInToday={checkedInToday} />
          </div>

          <div className="mt-6 border-t border-[#f2f1ee] pt-5">
            <StreakDisplay streaks={habit.streaks} size="lg" />
          </div>
        </div>

        {/* Habit Trend Chart */}
        <HabitTrendChart habitId={habitId} />

        {/* Check-in Heatmap */}
        <div className="mt-6 rounded-lg border border-[#e9e9e7] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#37352f]">Activity (Last 90 Days)</h2>
            <span className="text-xs text-[#787774]">
              {habit.checkIns.length} total check-in{habit.checkIns.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
              {past90Days.map((dateStr) => {
                const isChecked = checkedInDates.has(dateStr);
                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}${isChecked ? ' (Checked in)' : ''}`}
                    className={`h-3.5 w-3.5 rounded-[2px] transition-colors ${
                      isChecked
                        ? 'bg-[#2383e2] hover:bg-[#1d6bf3]'
                        : 'bg-[#f2f1ee] hover:bg-[#e9e9e7]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-end gap-2 text-[11px] text-[#9b9a97]">
            <span>Less</span>
            <div className="h-3 w-3 rounded-[2px] bg-[#f2f1ee]" />
            <div className="h-3 w-3 rounded-[2px] bg-[#2383e2]" />
            <span>More</span>
          </div>
        </div>

        {/* Backfill Form */}
        <div className="mt-6 rounded-lg border border-[#e9e9e7] bg-white p-6">
          <h2 className="text-sm font-semibold text-[#37352f]">Backfill a Past Date</h2>
          <form onSubmit={handleBackfill} className="mt-4 flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="backfill-date" className="block text-xs font-medium text-[#787774]">
                Date
              </label>
              <input
                id="backfill-date"
                type="date"
                value={backfillDate}
                onChange={(e) => setBackfillDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
                className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] focus:border-[#2383e2] focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={createCheckIn.isPending}
              className="rounded-md bg-[#2383e2] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1d6bf3] disabled:opacity-50 transition-colors"
            >
              {createCheckIn.isPending ? 'Adding…' : 'Add Check-in'}
            </button>
          </form>
          {backfillError && (
            <p className="mt-2 text-xs text-red-600 font-medium">{backfillError}</p>
          )}
        </div>

        {/* Check-in History */}
        <div className="mt-6 rounded-lg border border-[#e9e9e7] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#37352f]">Check-in History</h2>
            {checkInsPageData?.pagination && (
              <span className="text-xs text-[#787774]">
                Page {checkInsPageData.pagination.page} of {Math.max(1, checkInsPageData.pagination.totalPages)} ({checkInsPageData.pagination.total} total)
              </span>
            )}
          </div>

          {isLoadingCheckIns ? (
            <p className="mt-3 text-xs text-[#787774]">Loading check-ins…</p>
          ) : (checkInsPageData?.data ?? habit.checkIns).length === 0 ? (
            <p className="mt-3 text-xs text-[#787774]">No check-ins yet.</p>
          ) : (
            <>
              <div className="mt-3 space-y-1.5">
                {(checkInsPageData?.data ?? habit.checkIns.slice().reverse()).map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="flex items-center justify-between rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3.5 py-2 text-xs"
                  >
                    <div>
                      <span className="font-medium text-[#37352f]">
                        {format(parseISO(checkIn.local_date), 'EEEE, MMM d, yyyy')}
                      </span>
                      <span className="ml-2 text-[11px] text-[#787774]">
                        at {format(parseISO(checkIn.checked_in_at), 'h:mm a')}
                      </span>
                    </div>
                    <span className="font-semibold text-[#059669]">✓</span>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {checkInsPageData?.pagination && checkInsPageData.pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-[#f2f1ee] pt-3">
                  <button
                    type="button"
                    onClick={() => setCheckInPage((p) => Math.max(1, p - 1))}
                    disabled={checkInPage <= 1}
                    className="rounded border border-[#e9e9e7] px-2.5 py-1 text-xs font-medium text-[#37352f] hover:bg-[#f7f6f3] disabled:opacity-40 transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-[#787774]">
                    Page {checkInsPageData.pagination.page} of {checkInsPageData.pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCheckInPage((p) => Math.min(checkInsPageData.pagination.totalPages, p + 1))}
                    disabled={checkInPage >= checkInsPageData.pagination.totalPages}
                    className="rounded border border-[#e9e9e7] px-2.5 py-1 text-xs font-medium text-[#37352f] hover:bg-[#f7f6f3] disabled:opacity-40 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
