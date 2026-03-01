'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading }    = useAuthStore();
  const router                  = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      // redirect based on role
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} data-testid="login-form" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              data-testid="email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              data-testid="password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            data-testid="login-button"
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick login hints for testing */}
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
          <p className="font-medium text-amber-800 mb-1">Test Accounts:</p>
          <p className="text-amber-700">customer@shopforge.com / Customer123!</p>
          <p className="text-amber-700">admin@shopforge.com / Admin123!</p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          No account?{' '}
          <Link href="/auth/register" className="text-amber-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
