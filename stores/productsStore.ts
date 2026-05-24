import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

const SEED_PRODUCTS: Product[] = [
  { id: '1', name: 'قماش جورجيت فاخر',   description: 'قماش ناعم ومريح مثالي للفساتين الرسمية. يتميز بملمسه الناعم وسقوطه الجميل.', price: 85,  price_per_meter: 85,  category: 'جورجيت', colors: [{ name: 'أحمر', hex: '#D41E2F' }, { name: 'أسود', hex: '#1A1A1A' }], images: [], stock_quantity: 150, is_active: true },
  { id: '2', name: 'قماش ساتان ملكي',     description: 'لامع وفاخر للمناسبات الخاصة والأعراس.',                                        price: 250, price_per_meter: 250, category: 'ساتان',  colors: [{ name: 'ذهبي', hex: '#D4AF37' }, { name: 'أبيض', hex: '#F5F5F5' }], images: [], stock_quantity: 80,  is_active: true },
  { id: '3', name: 'قماش شيفون شفاف',     description: 'خفيف ومريح مناسب للصيف والمناسبات النهارية.',                                  price: 65,  price_per_meter: 65,  category: 'شيفون',  colors: [{ name: 'كحلي', hex: '#1E3A5F' }, { name: 'وردي', hex: '#FFB6C1' }], images: [], stock_quantity: 200, is_active: true },
  { id: '4', name: 'قماش قطن مصري',       description: 'قطن 100% طبيعي فاخر مريح طوال اليوم.',                                         price: 45,  price_per_meter: 45,  category: 'قطن',    colors: [{ name: 'أبيض', hex: '#FFFFFF' }, { name: 'بيج',  hex: '#F5DEB3' }], images: [], stock_quantity: 300, is_active: true },
  { id: '5', name: 'قماش كريب مبتكر',     description: 'مناسب لجميع المناسبات بنعومة استثنائية.',                                       price: 95,  price_per_meter: 95,  category: 'كريب',   colors: [{ name: 'زيتوني', hex: '#556B2F' }, { name: 'برغندي', hex: '#800020' }], images: [], stock_quantity: 120, is_active: true },
  { id: '6', name: 'قماش حرير طبيعي',     description: 'أرقى الحرير الطبيعي من أفضل المصادر.',                                          price: 450, price_per_meter: 450, category: 'حرير',   colors: [{ name: 'فضي', hex: '#B8B8B8' }, { name: 'ذهبي', hex: '#D4AF37' }], images: [], stock_quantity: 50,  is_active: true },
  { id: '7', name: 'قماش قطيفة ملكية',    description: 'فخامة لا مثيل لها للمناسبات الراقية.',                                          price: 180, price_per_meter: 180, category: 'قطيفة', colors: [{ name: 'أحمر داكن', hex: '#8B0000' }, { name: 'أزرق ملكي', hex: '#4169E1' }], images: [], stock_quantity: 60, is_active: true },
  { id: '8', name: 'قماش دانتيل فرنسي',   description: 'دانتيل فرنسي أصيل للفساتين العرائس.',                                           price: 320, price_per_meter: 320, category: 'دانتيل', colors: [{ name: 'أبيض عاجي', hex: '#FFFFF0' }], images: [], stock_quantity: 40, is_active: true },
];

interface ProductsState {
  products: Product[];
  lastUpdated: number;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleActive: (id: string) => void;
  getActive: () => Product[];
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      lastUpdated: Date.now(),
      addProduct: (p) => set((s) => ({
        products: [...s.products, { ...p, id: `prod-${Date.now()}` }],
        lastUpdated: Date.now(),
      })),
      updateProduct: (id, updates) => set((s) => ({
        products: s.products.map((p) => p.id === id ? { ...p, ...updates } : p),
        lastUpdated: Date.now(),
      })),
      deleteProduct: (id) => set((s) => ({
        products: s.products.filter((p) => p.id !== id),
        lastUpdated: Date.now(),
      })),
      toggleActive: (id) => set((s) => ({
        products: s.products.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p),
        lastUpdated: Date.now(),
      })),
      getActive: () => get().products.filter((p) => p.is_active),
    }),
    { name: 'bs-products-store' }
  )
);
