'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useI18n } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const links = [
    { href: '/',             label: 'الرئيسية' },
    { href: '/products',     label: 'المنتجات' },
    { href: '/ai-measure',   label: 'حاسبة القماش' },
    { href: '/dress-viewer', label: 'مصمم الفستان' },
    { href: '/chat',         label: 'المساعد الذكي' },
    { href: '/orders',       label: 'طلباتي' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background:     scrolled ? 'rgba(244,239,232,0.97)' : 'rgba(244,239,232,0.98)',
          backdropFilter: 'blur(12px)',
          boxShadow:      scrolled ? '0 2px 20px rgba(139,0,0,0.12)' : '0 1px 0 rgba(184,184,184,0.25)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:shadow-md transition-all duration-200">
                <Image
                  src="/logo.jpg"
                  alt="Bin Siddiq Fabric"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="hidden xs:block">
                <p className="text-sm font-black leading-none" style={{ color:'var(--bs-deep)', fontFamily:'Georgia,serif' }}>
                  BIN SIDDIQ
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase font-bold" style={{ color:'var(--bs-vivid)' }}>
                  FABRIC
                </p>
              </div>
            </Link>

            {/* ── Desktop links ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 relative"
                  style={{
                    color:      isActive(l.href) ? 'var(--bs-vivid)' : '#5a4a44',
                    background: isActive(l.href) ? 'rgba(227,24,55,0.08)' : 'transparent',
                  }}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <span className="absolute bottom-0.5 right-3 left-3 h-0.5 rounded-full"
                          style={{ background:'var(--bs-grad)' }} />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="touch-target flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-black/5"
                style={{ color:'var(--bs-deep)' }}
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>

              <Link
                href="/cart"
                className="touch-target relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-black/5"
                style={{ color:'var(--bs-deep)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-black text-white rounded-full flex items-center justify-center px-1 animate-cart-pop"
                    style={{ background:'var(--bs-vivid)' }}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              <Link href="/login" className="hidden sm:flex btn-primary text-sm py-2 px-4 gap-1.5">
                دخول
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden touch-target flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-black/5"
                aria-label="القائمة"
              >
                {isOpen
                  ? <X className="w-5 h-5" style={{ color:'var(--bs-deep)' }} />
                  : <Menu className="w-5 h-5" style={{ color:'var(--bs-deep)' }} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden animate-menu border-t"
               style={{ borderColor:'rgba(184,184,184,0.3)', background:'rgba(244,239,232,0.99)' }}>
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    color:      isActive(l.href) ? 'var(--bs-vivid)' : '#3d2a24',
                    background: isActive(l.href) ? 'rgba(227,24,55,0.08)' : 'transparent',
                  }}
                >
                  {isActive(l.href) && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'var(--bs-vivid)' }} />
                  )}
                  {l.label}
                </Link>
              ))}
              <div className="pt-3 pb-2 border-t mt-2" style={{ borderColor:'rgba(184,184,184,0.25)' }}>
                <Link href="/login" className="btn-primary w-full justify-center py-3.5 text-base">
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 safe-bottom"
           style={{ background:'rgba(244,239,232,0.97)', backdropFilter:'blur(12px)', borderTop:'1px solid rgba(184,184,184,0.3)' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { href:'/',             icon:'🏠', label:'الرئيسية' },
            { href:'/products',     icon:'🧵', label:'المنتجات' },
            { href:'/dress-viewer', icon:'👗', label:'مصمم' },
            { href:'/ai-measure',   icon:'✨', label:'حاسبة' },
            { href:'/cart',         icon:'🛒', label:'السلة', badge: itemCount },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] transition-all"
              style={{ color: isActive(item.href) ? 'var(--bs-vivid)' : '#7a6e68' }}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="absolute top-0.5 right-1.5 w-4 h-4 text-[9px] font-black text-white rounded-full flex items-center justify-center"
                      style={{ background:'var(--bs-vivid)' }}>
                  {item.badge}
                </span>
              )}
              {isActive(item.href) && (
                <span className="absolute bottom-0.5 w-4 h-0.5 rounded-full" style={{ background:'var(--bs-vivid)' }} />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
}
