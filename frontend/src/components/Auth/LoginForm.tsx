import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';

interface Props {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-[#787774]">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] focus:border-[#2383e2] focus:bg-white focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium text-[#787774]">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#e9e9e7] bg-[#fbfbfa] px-3 py-1.5 text-sm text-[#37352f] focus:border-[#2383e2] focus:bg-white focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[#2383e2] px-4 py-2 text-xs font-medium text-white hover:bg-[#1d6bf3] disabled:opacity-50 transition-colors"
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}
