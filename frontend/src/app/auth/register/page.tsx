'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuthStore();
  const router                  = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    try {
      const user = await register(name, email, password);
      toast.success('Account created!');
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch {
      toast.error('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} data-testid="register-form" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              data-testid="name-input"
              type="text" required
              value={name} onChange={(e) => setName(e.target.value)}
              className="input-field" placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              data-testid="email-input"
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              data-testid="password-input"
              type="password" required minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="Min. 8 characters"
            />
          </div>

          <button data-testid="register-button" type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
