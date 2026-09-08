import { useHabitAnalytics } from '../../hooks/useAnalytics';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

interface Props {
  habitId: string;
  days?: number;
}

export default function HabitTrendChart({ habitId, days = 30 }: Props) {
  const { data, isLoading, error } = useHabitAnalytics(habitId, days);

  if (isLoading) {
    return (
      <div className="mt-6 rounded-lg border border-[#e9e9e7] bg-white p-6">
        <div className="h-4 w-36 animate-pulse rounded bg-[#e9e9e7]" />
        <div className="mt-4 h-48 animate-pulse rounded bg-[#f2f1ee]" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const chartData = data.trend.map((point) => ({
    date: point.date,
    displayDate: format(parseISO(point.date), 'MMM d'),
    value: point.checkedIn ? 1 : 0,
    checkedIn: point.checkedIn,
  }));

  const checkedInCount = chartData.filter((d) => d.checkedIn).length;
  const rate = Math.round((checkedInCount / days) * 100);

  return (
    <div className="mt-6 rounded-lg border border-[#e9e9e7] bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#37352f]">30-Day Completion Trend</h2>
          <p className="mt-0.5 text-xs text-[#787774]">
            {checkedInCount} of {days} days checked in ({rate}%)
          </p>
        </div>
        <span className="text-xs font-medium text-[#2383e2]">{rate}% Rate</span>
      </div>

      <div className="mt-5 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -35, bottom: 0 }}>
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fill: '#787774' }}
              tickLine={false}
              axisLine={{ stroke: '#e9e9e7' }}
              interval={4}
            />
            <YAxis
              ticks={[0, 1]}
              tickFormatter={(v) => (v === 1 ? 'Yes' : 'No')}
              tick={{ fontSize: 10, fill: '#787774' }}
              tickLine={false}
              axisLine={{ stroke: '#e9e9e7' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-md border border-[#e9e9e7] bg-white p-2 text-xs shadow-xs">
                      <p className="font-semibold text-[#37352f]">{item.displayDate}</p>
                      <p className={item.checkedIn ? 'text-[#059669]' : 'text-[#787774]'}>
                        {item.checkedIn ? '✓ Checked In' : '✗ Missed'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.checkedIn ? '#2383e2' : '#e9e9e7'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
