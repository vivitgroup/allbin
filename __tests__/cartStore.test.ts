import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../stores/cartStore';
import { Product } from '../types';

const mockProduct: Product = {
  id: 'p1',
  name: 'قماش جورجيت فاخر',
  description: 'ناعم ومريح',
  price: 85,
  price_per_meter: 85,
  category: 'جورجيت',
  colors: [{ name: 'أحمر', hex: '#C41E3A' }],
  images: [],
  stock_quantity: 150,
  is_active: true,
};

const mockProduct2: Product = { ...mockProduct, id: 'p2', name: 'ساتان ملكي', price_per_meter: 250 };

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts empty', () => {
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('adds an item', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].meters).toBe(2);
  });

  it('accumulates meters for duplicate product', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().addItem(mockProduct, 1.5);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].meters).toBe(3.5);
  });

  it('adds different products separately', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().addItem(mockProduct2, 3);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('removes an item', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().removeItem('p1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().addItem(mockProduct2, 1);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(mockProduct, 2);   // 85 * 2 = 170
    useCartStore.getState().addItem(mockProduct2, 1);  // 250 * 1 = 250
    expect(useCartStore.getState().total()).toBe(420);
  });

  it('itemCount reflects number of cart items', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().addItem(mockProduct2, 1);
    expect(useCartStore.getState().itemCount()).toBe(2);
  });

  it('stores selected color', () => {
    const color = { name: 'أحمر', hex: '#C41E3A' };
    useCartStore.getState().addItem(mockProduct, 2, color);
    expect(useCartStore.getState().items[0].selected_color).toEqual(color);
  });
});
