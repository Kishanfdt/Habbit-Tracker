import type { Streaks } from '../../types';

interface Props {
  streaks: Streaks;
  size?: 'sm' | 'lg';
}

export default function StreakDisplay({ streaks, size = 'sm' }: Props) {
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-${isLarge ? '6' : '4'}`}>
      <div className="text-center">
        <div className={`flex items-center justify-center gap-1 ${isLarge ? 'text-3xl' : 'text-xl'} font-bold text-orange-500`}>
          🔥 {streaks.currentStreak}
        </div>
        <div className={`${isLarge ? 'text-sm' : 'text-xs'} text-gray-500`}>
          Current Streak
        </div>
      </div>
      <div className="h-8 w-px bg-gray-200" />
      <div className="text-center">
        <div className={`flex items-center justify-center gap-1 ${isLarge ? 'text-3xl' : 'text-xl'} font-bold text-yellow-500`}>
          ⭐ {streaks.longestStreak}
        </div>
        <div className={`${isLarge ? 'text-sm' : 'text-xs'} text-gray-500`}>
          Longest Streak
        </div>
      </div>
    </div>
  );
}
