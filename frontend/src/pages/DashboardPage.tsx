import { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import HabitCard from '../components/Habits/HabitCard';
import HabitForm from '../components/Habits/HabitForm';
import { useHabits } from '../hooks/useHabits';

export default function DashboardPage() {
  const { data: habits, isLoading, error } = useHabits();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="h-8 w-36 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200" />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-100" />
                  </div>
                  <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200" />
                </div>
                <div className="mt-8 flex gap-3">
                  <div className="h-14 w-28 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-14 w-28 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm font-semibold text-red-700 shadow-xs">
            Failed to load habits. Please try again.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Habits</h1>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-all shadow-xs hover:shadow-md active:scale-95"
          >
            + New Habit
          </button>
        </div>

        {habits && habits.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl">
              🎯
            </div>
            <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
              No habits created yet
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500 leading-relaxed">
              Start building your daily consistency by tracking your very first habit.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-700 hover:shadow-md transition-all active:scale-95"
            >
              + Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {habits?.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </main>

      {showForm && <HabitForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
