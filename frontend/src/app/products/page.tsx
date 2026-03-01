'use client';
import { useState } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryFilter from '@/components/product/CategoryFilter';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort]       = useState('created_at');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            data-testid="search-input"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          data-testid="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-auto"
        >
          <option value="created_at">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filter */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <CategoryFilter selected={category} onChange={setCategory} />
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid
            search={search}
            category={category}
            sort={sort === 'price_asc' ? 'price' : sort === 'price_desc' ? 'price' : sort}
            order={sort === 'price_asc' ? 'ASC' : 'DESC'}
          />
        </div>
      </div>
    </div>
  );
}
