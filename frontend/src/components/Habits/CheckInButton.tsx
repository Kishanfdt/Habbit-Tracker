import { useState } from 'react';
import { useCreateCheckIn } from '../../hooks/useHabits';
import { getErrorMessage } from '../../services/api';

interface Props {
  habitId: number;
  checkedInToday: boolean;
}

export default function CheckInButton({ habitId, checkedInToday }: Props) {
  const checkIn = useCreateCheckIn();
  const [error, setError] = useState('');

  const handleClick = async () => {
    setError('');
    try {
      await checkIn.mutateAsync({ habitId });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (checkedInToday) {
    return (
      <button
        disabled
        className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 cursor-default"
      >
        ✓ Done today
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={checkIn.isPending}
        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {checkIn.isPending ? 'Checking in…' : 'Check in today'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
