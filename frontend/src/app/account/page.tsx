'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

export default function AccountPage() {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchMe();
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin');
    }
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <p className="mb-2">Name: {user.name}</p>
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-4">Role: {user.role}</p>
      <Link href="/orders" className="text-amber-600 hover:underline">
        View my orders
      </Link>
    </div>
  );
}
