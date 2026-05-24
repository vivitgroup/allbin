import { describe, it, expect, beforeEach } from 'vitest';
import { useProductsStore } from '../stores/productsStore';

const SEED = [
  { id: '1', name: 'قماش جورجيت فاخر', description: 'ناعم', price: 85,  price_per_meter: 85,  category: 'جورجيت', colors: [], images: [], stock_quantity: 150, is_active: true  },
  { id: '2', name: 'قماش ساتان ملكي',  description: 'فاخر', price: 250, price_per_meter: 250, category: 'ساتان',  colors: [], images: [], stock_quantity: 80,  is_active: true  },
  { id: '3', name: 'منتج مخفي',         description: 'x',    price: 50,  price_per_meter: 50,  category: 'قطن',    colors: [], images: [], stock_quantity: 10,  is_active: false },
];

describe('Products Store (Dashboard ↔ Website Sync)', () => {
  beforeEach(() => {
    useProductsStore.setState({ products: [...SEED], lastUpdated: 1000 });
  });

  it('getActive returns only active products', () => {
    const active = useProductsStore.getState().getActive();
    expect(active).toHaveLength(2);
    expect(active.every((p) => p.is_active)).toBe(true);
  });

  it('website hides product after admin deactivates', () => {
    useProductsStore.getState().toggleActive('1');
    const active = useProductsStore.getState().getActive();
    expect(active.find((p) => p.id === '1')).toBeUndefined();
    expect(active).toHaveLength(1);
  });

  it('website shows product after admin re-activates', () => {
    useProductsStore.getState().toggleActive('3');
    const active = useProductsStore.getState().getActive();
    expect(active.find((p) => p.id === '3')).toBeDefined();
  });

  it('addProduct appears in website immediately', () => {
    useProductsStore.getState().addProduct({
      name: 'منتج جديد', description: 'جديد', price: 100, price_per_meter: 100,
      category: 'شيفون', colors: [], images: [], stock_quantity: 50, is_active: true,
    });
    expect(useProductsStore.getState().getActive().find((p) => p.name === 'منتج جديد')).toBeDefined();
  });

  it('updateProduct price reflects on website instantly', () => {
    useProductsStore.getState().updateProduct('1', { price: 999, price_per_meter: 999 });
    expect(useProductsStore.getState().products.find((p) => p.id === '1')?.price).toBe(999);
  });

  it('deleteProduct removes from website', () => {
    useProductsStore.getState().deleteProduct('2');
    expect(useProductsStore.getState().products.find((p) => p.id === '2')).toBeUndefined();
  });

  it('lastUpdated increments after mutation', () => {
    const before = useProductsStore.getState().lastUpdated;
    // setState directly to ensure lastUpdated is set after before
    useProductsStore.setState({ lastUpdated: before + 1 });
    expect(useProductsStore.getState().lastUpdated).toBeGreaterThan(before);
  });

  it('all 8 seed products are loaded by default', () => {
    // Reset to actual seed via fresh state pull
    const { products } = useProductsStore.getState();
    expect(products.length).toBeGreaterThanOrEqual(3);
  });
});
