'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function AdminPage() {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // ensure user is loaded
    if (!user && typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchMe();
    }
  }, []);

  useEffect(() => {
    // redirect non-admins and unauthenticated users to login
    if (user) {
      if (user.role !== 'admin') router.push('/auth/login');
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center">Redirecting...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user.name}! Use the links below to manage the store.</p>
      <ul className="list-disc pl-5 text-amber-600">
        <li><a href="/products" className="hover:underline">View all products (backend admin routes available)</a></li>
        {/* further admin tools (manage categories, orders, etc.) could be added here */}
      </ul>
    </div>
  );
}
