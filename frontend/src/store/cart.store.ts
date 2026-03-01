import { create } from 'zustand';
import { cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      const res = await cartApi.get();
      set({ items: res.data.data.items, total: res.data.data.total });
    } catch {
      set({ items: [], total: 0 });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      await cartApi.addItem(productId, quantity);
      await get().fetchCart();
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add item');
    }
  },

  updateItem: async (productId, quantity) => {
    try {
      await cartApi.updateItem(productId, quantity);
      await get().fetchCart();
    } catch {
      toast.error('Failed to update cart');
    }
  },

  removeItem: async (productId) => {
    try {
      await cartApi.removeItem(productId);
      await get().fetchCart();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clear();
      set({ items: [], total: 0 });
    } catch {
      toast.error('Failed to clear cart');
    }
  },

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
