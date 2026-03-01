'use client';
import { useEffect, useState } from 'react';
import { productApi } from '@/lib/api';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

interface Props {
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: string;
}

export default function ProductGrid({ limit = 12, search, category, sort, order }: Props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAll({ limit, search, category, sort, order });
        setProducts(res.data.data);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit, search, category, sort, order]);

  if (loading) return (
    <div className="flex justify-center py-20" data-testid="products-loading">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500" data-testid="products-error">{error}</div>
  );

  if (!products.length) return (
    <div className="text-center py-20 text-gray-500" data-testid="products-empty">
      No products found.
    </div>
  );

  return (
    <div data-testid="product-grid"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product: { id: string }) => (
        <ProductCard key={product.id} product={product as never} />
      ))}
    </div>
  );
}
