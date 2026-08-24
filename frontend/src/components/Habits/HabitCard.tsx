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
      className={`group rounded-lg border border-[#e9e9e7] bg-white p-5 transition-colors hover:bg-[#f7f6f3]/50 ${
        habit.checkedInToday ? 'border-l-2 border-l-[#059669]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/habits/${habit.id}`}
            className="text-base font-semibold text-[#37352f] hover:text-[#2383e2] transition-colors"
          >
            {habit.name}
          </Link>
          {habit.description && (
            <p className="mt-1 text-xs text-[#787774] leading-relaxed line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <CheckInButton habitId={habit.id} checkedInToday={habit.checkedInToday} />
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#f2f1ee]">
        <StreakDisplay streaks={habit.streaks} />
      </div>
    </div>
  );
}
