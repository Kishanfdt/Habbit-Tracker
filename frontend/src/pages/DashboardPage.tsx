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
      <div>
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            Failed to load habits. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            + New Habit
          </button>
        </div>

        {habits && habits.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">No habits yet. Create your first one!</p>
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
