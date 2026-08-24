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
        className={`relative flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ease-out active:scale-95 shadow-2xs ${
          checkedInToday
            ? 'bg-emerald-100 text-emerald-800 cursor-default scale-100 border border-emerald-300/60'
            : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {checkedInToday ? (
          <span className="inline-flex items-center gap-1 transition-all duration-300 transform scale-100">
            <span>Done Today</span>
            <span className="inline-block transform scale-110 font-extrabold text-emerald-700">✓</span>
          </span>
        ) : createCheckIn.isPending ? (
          <span className="inline-flex items-center gap-1.5 animate-pulse">
            <span>Saving...</span>
          </span>
        ) : (
          <span>Check In Today</span>
        )}
      </button>
      {errorMsg && <p className="text-red-500 text-xs mt-1.5 font-medium">{errorMsg}</p>}
    </div>
  );
}
