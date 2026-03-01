'use client';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, logout, fetchMe } = useAuthStore();
  const { itemCount, fetchCart }  = useCartStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchMe();
      fetchCart();
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-500" data-testid="logo">
          ShopForge
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-900 font-medium"
                data-testid="nav-products">
            Products
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-amber-500"
                data-testid="cart-icon">
            <ShoppingCart className="w-6 h-6" />
            {itemCount() > 0 && (
              <span data-testid="cart-count"
                className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs
                           rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount()}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' ? (
                <Link href="/admin" className="p-2 text-gray-600 hover:text-amber-500"
                      data-testid="admin-link" title="Admin">
                  <Package className="w-5 h-5" />
                </Link>
              ) : (
                <Link href="/orders" className="p-2 text-gray-600 hover:text-amber-500"
                      data-testid="orders-link" title="My Orders">
                  <Package className="w-5 h-5" />
                </Link>
              )}
              <span className="text-sm font-medium text-gray-700" data-testid="user-name">
                {user.name.split(' ')[0]}
              </span>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500"
                      data-testid="logout-button" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/auth/login"
                  className="flex items-center gap-1 text-gray-600 hover:text-amber-500 font-medium"
                  data-testid="login-link">
              <User className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
