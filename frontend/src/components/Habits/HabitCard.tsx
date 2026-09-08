import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { HabitWithStreaks } from '../../types';
import StreakDisplay from './StreakDisplay';
import CheckInButton from './CheckInButton';
import { useArchiveHabit } from '../../hooks/useHabits';

interface Props {
  habit: HabitWithStreaks;
}

const categoryStyles: Record<string, string> = {
  health: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  productivity: 'bg-blue-50 text-blue-700 border-blue-200',
  learning: 'bg-purple-50 text-purple-700 border-purple-200',
  fitness: 'bg-amber-50 text-amber-700 border-amber-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
};

export default function HabitCard({ habit }: Props) {
  const archiveMutation = useArchiveHabit();
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(habit.id);
      setIsConfirmingArchive(false);
    } catch (err) {
      console.error('Failed to archive habit:', err);
    }
  };

  const category = habit.category || 'other';

  return (
    <div
      className={`group relative rounded-lg border border-[#e9e9e7] bg-white p-5 transition-colors hover:bg-[#f7f6f3]/50 ${
        habit.checkedInToday ? 'border-l-2 border-l-[#059669]' : ''
      } ${habit.archived ? 'opacity-75 bg-[#fbfbfa]' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/habits/${habit.id}`}
              className="text-base font-semibold text-[#37352f] hover:text-[#2383e2] transition-colors"
            >
              {habit.name}
            </Link>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                categoryStyles[category] || categoryStyles.other
              }`}
            >
              {category}
            </span>
            {habit.archived && (
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                Archived
              </span>
            )}
          </div>
          {habit.description && (
            <p className="mt-1 text-xs text-[#787774] leading-relaxed line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {!habit.archived && (
            <CheckInButton habitId={habit.id} checkedInToday={habit.checkedInToday} />
          )}
          {!habit.archived && (
            <button
              onClick={() => setIsConfirmingArchive(true)}
              title="Archive habit"
              className="rounded p-1 text-[#9b9a97] hover:bg-[#e9e9e7] hover:text-[#37352f] transition-colors text-xs"
            >
              📥
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#f2f1ee]">
        <StreakDisplay streaks={habit.streaks} />
      </div>

      {isConfirmingArchive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/95 p-4 backdrop-blur-xs">
          <div className="text-center">
            <p className="text-xs font-medium text-[#37352f]">Archive "{habit.name}"?</p>
            <p className="mt-0.5 text-[11px] text-[#787774]">It will be hidden from main view.</p>
            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={() => setIsConfirmingArchive(false)}
                className="rounded border border-[#e9e9e7] px-2.5 py-1 text-xs text-[#37352f] hover:bg-[#f7f6f3]"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
                className="rounded bg-[#2383e2] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#1d6bf3] disabled:opacity-50"
              >
                {archiveMutation.isPending ? 'Archiving…' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
