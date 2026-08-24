import { useState } from 'react';
import { useCreateCheckIn } from '../../hooks/useHabits';
import { getErrorMessage } from '../../services/api';
import { ID } from '../../types';

interface Props {
  habitId: ID;
  checkedInToday: boolean;
}

export default function CheckInButton({ habitId, checkedInToday }: Props) {
  const createCheckIn = useCreateCheckIn();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckIn = async () => {
    setErrorMsg(null);
    try {
      await createCheckIn.mutateAsync({ habitId });
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckIn}
        disabled={checkedInToday || createCheckIn.isPending}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          checkedInToday
            ? 'bg-emerald-100 text-emerald-800 cursor-default'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
        }`}
      >
        {checkedInToday
          ? 'Done Today ✓'
          : createCheckIn.isPending
          ? 'Saving...'
          : 'Check In Today'}
      </button>
      {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
    </div>
  );
}
