import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/Auth/SignupForm';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🔥 Habit Tracker</h1>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>

        <div className="mt-8 rounded-lg bg-white p-8 shadow-md">
          <SignupForm onSuccess={() => navigate('/dashboard')} />

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
