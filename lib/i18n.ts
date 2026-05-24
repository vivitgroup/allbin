'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ar' | 'en';

interface I18nState {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'nav.home': 'الرئيسية', 'nav.products': 'المنتجات', 'nav.cart': 'السلة',
    'nav.orders': 'طلباتي', 'nav.profile': 'حسابي', 'nav.login': 'تسجيل دخول',
    'product.price': 'السعر', 'product.add_to_cart': 'أضف للسلة',
    'product.per_meter': 'للمتر', 'product.in_stock': 'متوفر',
    'cart.title': 'سلة التسوق', 'cart.checkout': 'إتمام الشراء',
    'cart.empty': 'سلتك فارغة', 'cart.total': 'المجموع',
    'checkout.title': 'إتمام الشراء', 'checkout.pay': 'ادفع الآن',
    'ai.title': 'حاسبة القماش الذكية', 'ai.calculate': 'احسبي القماش',
    'dress.skin_tone': 'لون البشرة', 'dress.fabric_color': 'لون القماش',
    'orders.title': 'طلباتي', 'orders.empty': 'لا توجد طلبات',
    'status.pending': 'معلق', 'status.processing': 'قيد التجهيز',
    'status.shipped': 'تم الشحن', 'status.delivered': 'تم التوصيل',
    'admin.dashboard': 'لوحة التحكم', 'admin.products': 'المنتجات',
    'admin.orders': 'الطلبات', 'admin.analytics': 'التحليلات',
    'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.delete': 'حذف',
    'common.search': 'بحث', 'common.loading': 'جاري التحميل...',
    'common.edit': 'تعديل', 'common.add': 'إضافة', 'common.back': 'رجوع',
  },
  en: {
    'nav.home': 'Home', 'nav.products': 'Products', 'nav.cart': 'Cart',
    'nav.orders': 'My Orders', 'nav.profile': 'My Account', 'nav.login': 'Login',
    'product.price': 'Price', 'product.add_to_cart': 'Add to Cart',
    'product.per_meter': 'per meter', 'product.in_stock': 'In Stock',
    'cart.title': 'Shopping Cart', 'cart.checkout': 'Checkout',
    'cart.empty': 'Your cart is empty', 'cart.total': 'Total',
    'checkout.title': 'Checkout', 'checkout.pay': 'Pay Now',
    'ai.title': 'Smart Fabric Calculator', 'ai.calculate': 'Calculate Fabric',
    'dress.skin_tone': 'Skin Tone', 'dress.fabric_color': 'Fabric Color',
    'orders.title': 'My Orders', 'orders.empty': 'No orders yet',
    'status.pending': 'Pending', 'status.processing': 'Processing',
    'status.shipped': 'Shipped', 'status.delivered': 'Delivered',
    'admin.dashboard': 'Dashboard', 'admin.products': 'Products',
    'admin.orders': 'Orders', 'admin.analytics': 'Analytics',
    'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
    'common.search': 'Search', 'common.loading': 'Loading...',
    'common.edit': 'Edit', 'common.add': 'Add', 'common.back': 'Back',
  },
};

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      dir: 'rtl',
      setLang: (lang) => set({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }),
      t: (key) => {
        const { lang } = get();
        return translations[lang][key] || key;
      },
    }),
    { name: 'i18n-storage' }
  )
);
