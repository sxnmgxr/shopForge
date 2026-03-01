'use client';
import { useEffect, useState } from 'react';
import { categoryApi } from '@/lib/api';

interface Category { id: string; name: string; slug: string; }

export default function CategoryFilter({
  selected, onChange
}: { selected: string; onChange: (slug: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryApi.getAll().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="category-filter">
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-1">
        <li>
          <button onClick={() => onChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
              ${!selected ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            All Products
          </button>
        </li>
        {categories.map(cat => (
          <li key={cat.id}>
            <button
              data-testid={`category-${cat.slug}`}
              onClick={() => onChange(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${selected === cat.slug
                  ? 'bg-amber-100 text-amber-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'}`}>
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
