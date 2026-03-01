'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { orderApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  status: string;
  total: string;
  created_at: string;
}

export default function OrdersPage() {
  const { user, fetchMe } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchMe();
    }
  }, []);

  useEffect(() => {
    if (user) {
      orderApi.getAll()
        .then(res => setOrders(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (user === null) {
      router.push('/auth/login');
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (!orders.length) return <div className="p-8 text-center">No orders found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <ul className="space-y-4">
        {orders.map(o => (
          <li key={o.id} className="border p-4 rounded-lg">
            <p><strong>ID:</strong> {o.id}</p>
            <p><strong>Status:</strong> {o.status}</p>
            <p><strong>Total:</strong> ${o.total}</p>
            <p><strong>Date:</strong> {new Date(o.created_at).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
