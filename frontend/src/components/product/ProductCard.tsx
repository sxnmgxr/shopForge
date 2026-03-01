'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  rating: number;
  review_count: number;
  stock: number;
  category_name: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  return (
    <div className="card overflow-hidden group" data-testid="product-card">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          <Image
            src={product.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
            data-testid="product-image"
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">
          {product.category_name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-amber-600 transition-colors
                         line-clamp-2 mb-2" data-testid="product-name">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.review_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900" data-testid="product-price">
            ${product.price}
          </span>
          <button
            data-testid="add-to-cart-btn"
            onClick={() => addItem(product.id)}
            disabled={product.stock === 0}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600
                       text-white text-sm font-medium px-3 py-2 rounded-lg
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
