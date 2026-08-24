import type { Streaks } from '../../types';

interface Props {
  streaks: Streaks;
  size?: 'sm' | 'lg';
}

export default function StreakDisplay({ streaks, size = 'sm' }: Props) {
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-3 ${isLarge ? 'sm:gap-4' : 'gap-2.5'}`}>
      {/* Current Streak Chip */}
      <div
        className={`flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-orange-50 to-amber-50/80 border border-orange-200/70 shadow-2xs ${
          isLarge ? 'px-5 py-3 min-w-[120px]' : 'px-3.5 py-2 min-w-[96px]'
        }`}
      >
        <div
          className={`flex items-center gap-1.5 font-extrabold tracking-tight text-orange-600 ${
            isLarge ? 'text-3xl' : 'text-xl'
          }`}
        >
          <span>🔥</span>
          <span>{streaks.currentStreak}</span>
        </div>
        <div
          className={`font-semibold tracking-wider text-slate-500 uppercase ${
            isLarge ? 'text-[11px] mt-1' : 'text-[9px] mt-0.5'
          }`}
        >
          Current Streak
        </div>
      </div>

      {/* Longest Streak Chip */}
      <div
        className={`flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-amber-50 to-yellow-50/80 border border-amber-200/70 shadow-2xs ${
          isLarge ? 'px-5 py-3 min-w-[120px]' : 'px-3.5 py-2 min-w-[96px]'
        }`}
      >
        <div
          className={`flex items-center gap-1.5 font-extrabold tracking-tight text-amber-600 ${
            isLarge ? 'text-3xl' : 'text-xl'
          }`}
        >
          <span>⭐</span>
          <span>{streaks.longestStreak}</span>
        </div>
        <div
          className={`font-semibold tracking-wider text-slate-500 uppercase ${
            isLarge ? 'text-[11px] mt-1' : 'text-[9px] mt-0.5'
          }`}
        >
          Longest Streak
        </div>
      </div>
    </div>
  );
}
