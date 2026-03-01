'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

export default function CartPage() {
  const { items, total, fetchCart, updateItem, removeItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchCart(); }, []);

  if (!user) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
      <p className="text-gray-500 mb-6">You need to be logged in to view your cart.</p>
      <Link href="/auth/login" className="btn-primary">Sign In</Link>
    </div>
  );

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started.</p>
      <Link href="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4" data-testid="cart-items">
          {items.map((item) => (
            <div key={item.product_id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-amber-600 font-bold mt-1">${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateItem(item.product_id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.product_id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-7 h-7 rounded-full border flex items-center justify-center
                               hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    data-testid="remove-item-btn"
                    onClick={() => removeItem(item.product_id)}
                    className="ml-auto text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-72">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span data-testid="cart-total">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              data-testid="checkout-btn"
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <Link href="/products" className="btn-secondary w-full text-center block mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
