'use client';
import Link from 'next/link';
import { ShoppingBag, Shield, Truck, RefreshCw } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-amber-500">ShopForge</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of products from top brands. Quality guaranteed, fast delivery.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg px-8 py-3">
              Shop Now
            </Link>
            <Link href="/auth/register" className="btn-secondary text-lg px-8 py-3">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck,      title: 'Free Shipping',    desc: 'On orders over $50' },
            { icon: Shield,     title: 'Secure Payment',   desc: '100% secure checkout' },
            { icon: RefreshCw,  title: 'Easy Returns',     desc: '30-day return policy' },
            { icon: ShoppingBag,title: '24/7 Support',     desc: 'Always here to help' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-4">
              <Icon className="text-amber-500 w-8 h-8 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products" className="text-amber-600 hover:text-amber-700 font-medium">
              View All →
            </Link>
          </div>
          <ProductGrid limit={8} />
        </div>
      </section>
    </div>
  );
}
