import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';

interface Props {
  onSuccess: () => void;
}

// Common IANA timezones for the dropdown
const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Toronto',
  'America/Vancouver',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Singapore',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
];

function getDetectedTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

export default function SignupForm({ onSuccess }: Props) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timezone, setTimezone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimezone(getDetectedTimezone());
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, timezone);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Build all available timezones (detected + common, deduplicated)
  const allTimezones = Array.from(
    new Set([getDetectedTimezone(), ...COMMON_TIMEZONES]),
  ).sort();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="signup-email" className="block text-xs font-medium text-[#787774]">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] focus:border-[#2383e2] focus:bg-white focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-xs font-medium text-[#787774]">
          Password (min 6 characters)
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] focus:border-[#2383e2] focus:bg-white focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="timezone" className="block text-xs font-medium text-[#787774]">
          Timezone
        </label>
        <select
          id="timezone"
          required
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] focus:border-[#2383e2] focus:bg-white focus:outline-none"
        >
          {allTimezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
              {tz === getDetectedTimezone() ? ' (detected)' : ''}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[#2383e2] px-4 py-2 text-xs font-medium text-white hover:bg-[#1d6bf3] disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating account…' : 'Sign up'}
      </button>
    </form>
  );
}
