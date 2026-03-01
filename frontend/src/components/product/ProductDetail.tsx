'use client';
import Image from 'next/image';
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
  description: string;
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-96 bg-gray-100">
            <Image
              src={product.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              data-testid="product-image"
            />
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-2xl font-bold mb-4" data-testid="product-name">
            {product.name}
          </h1>
          <p className="text-sm text-amber-600 font-medium uppercase mb-2">
            {product.category_name}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
          <span className="text-3xl font-bold text-gray-900 mb-4" data-testid="product-price">
            ${product.price}
          </span>
          <p className="mb-6 text-gray-700 leading-relaxed" data-testid="product-description">
            {product.description}
          </p>
          <button
            onClick={() => addItem(product.id)}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600
                       text-white text-sm font-medium px-3 py-3 rounded-lg
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="add-to-cart-btn"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
