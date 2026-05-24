/**
 * SITE STORE — Single source of truth
 * All changes from dashboard instantly reflect on website
 * Works on desktop AND mobile (persisted to localStorage)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ─────────────────────────────────────────────
export type MediaType = 'image' | 'video' | 'gradient';

export interface MediaItem {
  type:    MediaType;
  src:     string;     // base64, URL, or ''
  poster?: string;     // for video: thumbnail
}

export interface SectionContent {
  id:          string;
  sectionKey:  string;  // 'hero' | 'section2' | 'section3' | 'strip' | 'cta' ...
  active:      boolean;
  media:       MediaItem;
  heading:     string;
  subheading:  string;
  ctaText:     string;
  ctaLink:     string;
  badge:       string;
  bgGradient:  string;
  textAlign:   'right' | 'center' | 'left';
  textColor:   string;
  order:       number;
}

export interface SiteSettings {
  primaryColor:    string;
  navyColor:       string;
  fontHeading:     string;
  fontBody:        string;
  showChatWidget:  boolean;
  showWhatsApp:    boolean;
  showNewsletter:  boolean;
  whatsappNumber:  string;
  storeName:       string;
  storeTagline:    string;
}

interface SiteState {
  sections:    SectionContent[];
  settings:    SiteSettings;
  lastUpdated: number;
  // Section ops
  updateSection:  (id: string, updates: Partial<SectionContent>) => void;
  reorderSection: (id: string, newOrder: number) => void;
  toggleSection:  (id: string) => void;
  getSection:     (key: string) => SectionContent | undefined;
  getActiveSections: () => SectionContent[];
  // Settings ops
  updateSettings: (updates: Partial<SiteSettings>) => void;
}

// ── Default sections ───────────────────────────────────
const DEFAULT_SECTIONS: SectionContent[] = [
  {
    id: 'sec-strip',
    sectionKey: 'strip',
    active: true,
    order: 0,
    media: { type: 'gradient', src: '' },
    heading: '🎉 عرض خاص — اشتري 5 متر واحصلي على متر مجاناً',
    subheading: '',
    ctaText: 'تسوق الآن',
    ctaLink: '/products',
    badge: '',
    bgGradient: 'linear-gradient(90deg, #F5A623 0%, #D4880A 100%)',
    textAlign: 'center',
    textColor: '#ffffff',
  },
  {
    id: 'sec-hero',
    sectionKey: 'hero',
    active: true,
    order: 1,
    media: { type: 'gradient', src: '' },
    heading: 'BIN SIDDIQ\nFABRICS',
    subheading: 'أفضل الأقمشة الفاخرة في ينبع والمملكة — جورجيت، ساتان، شيفون، حرير وأكثر',
    ctaText: 'تسوق الآن',
    ctaLink: '/products',
    badge: '⭐ الأفضل في ينبع',
    bgGradient: 'linear-gradient(135deg, #1E2B45 0%, #2D4070 50%, #1E2B45 100%)',
    textAlign: 'right',
    textColor: '#ffffff',
  },
  {
    id: 'sec-banner1',
    sectionKey: 'banner1',
    active: true,
    order: 2,
    media: { type: 'gradient', src: '' },
    heading: 'مجموعة ترند 2025',
    subheading: 'أحدث الأقمشة الفاخرة بتصاميم عصرية',
    ctaText: 'استكشفي',
    ctaLink: '/products',
    badge: '🔥 جديد',
    bgGradient: 'linear-gradient(135deg, #F5A623 0%, #D4880A 100%)',
    textAlign: 'right',
    textColor: '#ffffff',
  },
  {
    id: 'sec-banner2',
    sectionKey: 'banner2',
    active: true,
    order: 3,
    media: { type: 'gradient', src: '' },
    heading: 'شحن مجاني',
    subheading: 'على جميع الطلبات فوق 200 ر.س',
    ctaText: 'اطلبي الآن',
    ctaLink: '/products',
    badge: '🚚 مجاني',
    bgGradient: 'linear-gradient(135deg, #1B6B45 0%, #0A3A20 100%)',
    textAlign: 'right',
    textColor: '#ffffff',
  },
  {
    id: 'sec-features',
    sectionKey: 'features',
    active: true,
    order: 4,
    media: { type: 'gradient', src: '' },
    heading: 'كل ما تحتاجينه',
    subheading: 'أدوات ذكية تجعل تجربة التسوق أسهل وأجمل',
    ctaText: '',
    ctaLink: '',
    badge: 'خدماتنا',
    bgGradient: 'var(--bs-pearl)',
    textAlign: 'center',
    textColor: 'var(--bs-navy)',
  },
  {
    id: 'sec-cta',
    sectionKey: 'cta',
    active: true,
    order: 5,
    media: { type: 'gradient', src: '' },
    heading: 'صممي فستانك قبل الشراء',
    subheading: 'جربي الألوان والموديلات على موديل واقعي — مجاناً',
    ctaText: 'مصمم الفستان',
    ctaLink: '/dress-viewer',
    badge: '',
    bgGradient: 'linear-gradient(135deg, #1E2B45 0%, #3D2800 50%, #D4880A 100%)',
    textAlign: 'center',
    textColor: '#ffffff',
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  primaryColor:    '#F5A623',
  navyColor:       '#1E2B45',
  fontHeading:     'Georgia, serif',
  fontBody:        "Segoe UI, Tahoma, Arial, sans-serif",
  showChatWidget:  true,
  showWhatsApp:    true,
  showNewsletter:  true,
  whatsappNumber:  '966500000000',
  storeName:       'BIN SIDDIQ FABRICS',
  storeTagline:    'PREMIUM QUALITY',
};

// ── Store ─────────────────────────────────────────────
export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      sections:    DEFAULT_SECTIONS,
      settings:    DEFAULT_SETTINGS,
      lastUpdated: Date.now(),

      updateSection: (id, updates) => set(s => ({
        sections:    s.sections.map(sec => sec.id === id ? { ...sec, ...updates } : sec),
        lastUpdated: Date.now(),
      })),

      reorderSection: (id, newOrder) => set(s => ({
        sections:    s.sections.map(sec => sec.id === id ? { ...sec, order: newOrder } : sec),
        lastUpdated: Date.now(),
      })),

      toggleSection: (id) => set(s => ({
        sections:    s.sections.map(sec => sec.id === id ? { ...sec, active: !sec.active } : sec),
        lastUpdated: Date.now(),
      })),

      getSection: (key) => get().sections.find(s => s.sectionKey === key),

      getActiveSections: () =>
        get().sections.filter(s => s.active).sort((a, b) => a.order - b.order),

      updateSettings: (updates) => set(s => ({
        settings:    { ...s.settings, ...updates },
        lastUpdated: Date.now(),
      })),
    }),
    {
      name:    'bs-site-v1',
      version: 1,
    }
  )
);
