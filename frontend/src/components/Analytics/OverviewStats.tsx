import { useOverviewAnalytics } from '../../hooks/useAnalytics';

export default function OverviewStats() {
  const { data: stats, isLoading, error } = useOverviewAnalytics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg border border-[#e9e9e7] bg-white p-3.5"
          >
            <div className="h-3 w-16 animate-pulse rounded bg-[#e9e9e7]" />
            <div className="mt-2 h-6 w-12 animate-pulse rounded bg-[#f2f1ee]" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Habits',
      value: stats.totalHabits,
      icon: '🎯',
      subtext: 'Tracked habits',
    },
    {
      label: 'Active Streaks',
      value: stats.activeStreaksCount,
      icon: '🔥',
      subtext: 'Habits with streak > 0',
    },
    {
      label: '7-Day Rate',
      value: `${stats.completionRate7d}%`,
      icon: '📈',
      subtext: 'Last 7 days',
    },
    {
      label: '30-Day Rate',
      value: `${stats.completionRate30d}%`,
      icon: '📊',
      subtext: 'Last 30 days',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-[#e9e9e7] bg-white p-3.5 transition-colors hover:bg-[#f7f6f3]/50"
        >
          <div className="flex items-center justify-between text-[#787774]">
            <span className="text-[11px] font-medium tracking-wide uppercase">{card.label}</span>
            <span className="text-sm">{card.icon}</span>
          </div>
          <div className="mt-1 text-xl font-bold tracking-tight text-[#37352f]">{card.value}</div>
          <div className="mt-0.5 text-[10px] text-[#9b9a97]">{card.subtext}</div>
        </div>
      ))}
    </div>
  );
}
