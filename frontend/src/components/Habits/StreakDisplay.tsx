import type { Streaks } from '../../types';

interface Props {
  streaks: Streaks;
  size?: 'sm' | 'lg';
}

export default function StreakDisplay({ streaks, size = 'sm' }: Props) {
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-3 ${isLarge ? 'gap-4' : 'gap-3'}`}>
      {/* Current Streak */}
      <div
        className={`flex flex-col rounded-md border border-[#e9e9e7] bg-[#fdfdfd] ${
          isLarge ? 'px-4 py-2.5 min-w-[110px]' : 'px-3 py-1.5 min-w-[90px]'
        }`}
      >
        <div className={`flex items-center gap-1.5 font-semibold text-[#d97706] ${isLarge ? 'text-2xl' : 'text-base'}`}>
          <span>🔥</span>
          <span>{streaks.currentStreak}</span>
        </div>
        <div className={`text-[11px] font-medium text-[#787774] ${isLarge ? 'mt-0.5' : ''}`}>
          Current Streak
        </div>
      </div>

      {/* Longest Streak */}
      <div
        className={`flex flex-col rounded-md border border-[#e9e9e7] bg-[#fdfdfd] ${
          isLarge ? 'px-4 py-2.5 min-w-[110px]' : 'px-3 py-1.5 min-w-[90px]'
        }`}
      >
        <div className={`flex items-center gap-1.5 font-semibold text-[#37352f] ${isLarge ? 'text-2xl' : 'text-base'}`}>
          <span>⭐</span>
          <span>{streaks.longestStreak}</span>
        </div>
        <div className={`text-[11px] font-medium text-[#787774] ${isLarge ? 'mt-0.5' : ''}`}>
          Longest Streak
        </div>
      </div>
    </div>
  );
}
