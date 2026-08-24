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
      <div className="min-h-screen bg-[#fbfbfa]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-[#e9e9e7]" />
            <div className="h-8 w-24 animate-pulse rounded-md bg-[#e9e9e7]" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-lg border border-[#e9e9e7] bg-white p-5"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#e9e9e7]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#f2f1ee]" />
                  </div>
                  <div className="h-7 w-24 animate-pulse rounded bg-[#e9e9e7]" />
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-10 w-24 animate-pulse rounded bg-[#f2f1ee]" />
                  <div className="h-10 w-24 animate-pulse rounded bg-[#f2f1ee]" />
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
      <div className="min-h-screen bg-[#fbfbfa]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            Failed to load habits. Please try again.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#37352f]">My Habits</h1>
            <p className="mt-0.5 text-xs text-[#787774]">Track daily consistency in your local calendar timezone</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-[#2383e2] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1d6bf3] transition-colors"
          >
            + New Habit
          </button>
        </div>

        {habits && habits.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#e9e9e7] bg-white p-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f7f6f3] text-xl">
              🎯
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#37352f]">No habits created yet</h3>
            <p className="mt-1 max-w-xs text-xs text-[#787774] leading-relaxed">
              Start building your daily consistency by tracking your very first habit.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-md bg-[#2383e2] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1d6bf3] transition-colors"
            >
              + Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
