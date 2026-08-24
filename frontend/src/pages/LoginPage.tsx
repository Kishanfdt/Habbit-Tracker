import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfbfa] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#37352f]">🔥 Habit Tracker</h1>
          <p className="mt-1 text-xs text-[#787774]">Log in to track your habits</p>
        </div>

        <div className="mt-6 rounded-lg border border-[#e9e9e7] bg-white p-6">
          <LoginForm onSuccess={() => navigate('/dashboard')} />

          <p className="mt-4 text-center text-xs text-[#787774]">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-[#2383e2] hover:text-[#1d6bf3] transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
