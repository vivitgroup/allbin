import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, FabricColor } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, meters: number, color?: FabricColor) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, meters, color) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id ? { ...i, meters: i.meters + meters } : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1, meters, selected_color: color }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: quantity <= 0
            ? get().items.filter((i) => i.product.id !== productId)
            : get().items.map((i) => i.product.id === productId ? { ...i, quantity } : i),
        }),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price_per_meter * i.meters, 0),
      itemCount: () => get().items.length,
    }),
    { name: 'cart-storage' }
  )
);
