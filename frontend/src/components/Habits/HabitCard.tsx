import { Link } from 'react-router-dom';
import type { HabitWithStreaks } from '../../types';
import StreakDisplay from './StreakDisplay';
import CheckInButton from './CheckInButton';

interface Props {
  habit: HabitWithStreaks;
}

export default function HabitCard({ habit }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            to={`/habits/${habit.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            {habit.name}
          </Link>
          {habit.description && (
            <p className="mt-1 text-sm text-gray-500">{habit.description}</p>
          )}
        </div>
        <CheckInButton habitId={habit.id} checkedInToday={habit.checkedInToday} />
      </div>

      <div className="mt-4">
        <StreakDisplay streaks={habit.streaks} />
      </div>
    </div>
  );
}
