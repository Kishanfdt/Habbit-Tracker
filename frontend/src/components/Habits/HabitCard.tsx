import { Link } from 'react-router-dom';
import type { HabitWithStreaks } from '../../types';
import StreakDisplay from './StreakDisplay';
import CheckInButton from './CheckInButton';

interface Props {
  habit: HabitWithStreaks;
}

export default function HabitCard({ habit }: Props) {
  return (
    <div
      className={`group relative rounded-2xl border bg-white p-6 shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg ${
        habit.checkedInToday
          ? 'border-l-4 border-l-emerald-500 border-slate-200/80 bg-slate-50/30'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/habits/${habit.id}`}
            className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
          >
            {habit.name}
          </Link>
          {habit.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <CheckInButton habitId={habit.id} checkedInToday={habit.checkedInToday} />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <StreakDisplay streaks={habit.streaks} />
      </div>
    </div>
  );
}
