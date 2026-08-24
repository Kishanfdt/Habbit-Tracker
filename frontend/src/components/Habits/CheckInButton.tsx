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
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
          checkedInToday
            ? 'bg-[#f7f6f3] text-[#787774] border-[#e9e9e7] cursor-default'
            : 'bg-white text-[#37352f] border-[#e9e9e7] hover:bg-[#efefe0]/70 hover:border-[#d0d0ce] disabled:opacity-50'
        }`}
      >
        {checkedInToday ? (
          <span className="flex items-center gap-1">
            <span>Done Today</span>
            <span className="text-[#059669] font-bold">✓</span>
          </span>
        ) : createCheckIn.isPending ? (
          <span>Saving…</span>
        ) : (
          <span>Check In Today</span>
        )}
      </button>
      {errorMsg && <p className="text-xs text-[#dc2626] mt-1 font-normal">{errorMsg}</p>}
    </div>
  );
}
