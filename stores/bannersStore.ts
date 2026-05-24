import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Banner {
  id:       string;
  title:    string;
  sub:      string;
  cta:      string;
  href:     string;
  bg:       string;
  badge:    string;
  image?:   string;   // uploaded image URL or base64
  active:   boolean;
  position: 'hero' | 'sub1' | 'sub2' | 'sub3' | 'strip';
  textColor?: string;
}

interface BannersState {
  banners:     Banner[];
  lastUpdated: number;
  setBanners:  (b: Banner[]) => void;
  updateBanner:(id: string, updates: Partial<Banner>) => void;
  addBanner:   (b: Omit<Banner, 'id'>) => void;
  deleteBanner:(id: string) => void;
  getActive:   (pos?: Banner['position']) => Banner[];
}

const DEFAULTS: Banner[] = [
  { id:'b1', position:'hero', title:'مجموعة ترند 2025', sub:'أحدث الأقمشة الفاخرة بتصاميم عصرية', cta:'تسوق الآن', href:'/products', bg:'linear-gradient(135deg, #1E2B45 0%, #2D4070 100%)', badge:'🔥 جديد', image:'', active:true, textColor:'white' },
  { id:'b2', position:'sub1', title:'قماش ساتان ملكي', sub:'خصم 20% هذا الأسبوع فقط', cta:'اشتري الآن', href:'/products?cat=satin', bg:'linear-gradient(135deg, #F5A623 0%, #D4880A 100%)', badge:'%20 خصم', image:'', active:true, textColor:'white' },
  { id:'b3', position:'sub2', title:'شحن مجاني', sub:'على جميع الطلبات فوق 200 ر.س', cta:'اطلبي الآن', href:'/products', bg:'linear-gradient(135deg, #1B6B45 0%, #0A3A20 100%)', badge:'🚚 مجاني', image:'', active:true, textColor:'white' },
  { id:'b4', position:'strip', title:'🎉 عرض خاص — اشتري 5 متر واحصلي على متر مجاناً', sub:'', cta:'تسوق', href:'/products', bg:'var(--bs-grad)', badge:'', image:'', active:true, textColor:'white' },
];

export const useBannersStore = create<BannersState>()(
  persist(
    (set, get) => ({
      banners:     DEFAULTS,
      lastUpdated: Date.now(),
      setBanners:  (banners) => set({ banners, lastUpdated: Date.now() }),
      updateBanner:(id, updates) => set(s => ({
        banners: s.banners.map(b => b.id === id ? { ...b, ...updates } : b),
        lastUpdated: Date.now(),
      })),
      addBanner: (b) => set(s => ({
        banners: [...s.banners, { ...b, id: `ban-${Date.now()}` }],
        lastUpdated: Date.now(),
      })),
      deleteBanner: (id) => set(s => ({
        banners: s.banners.filter(b => b.id !== id),
        lastUpdated: Date.now(),
      })),
      getActive: (pos) => {
        const all = get().banners.filter(b => b.active);
        return pos ? all.filter(b => b.position === pos) : all;
      },
    }),
    { name: 'bs-banners-v1' }
  )
);
