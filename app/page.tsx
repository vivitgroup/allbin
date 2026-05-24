'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Calculator, Sparkles, Star, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useSiteStore } from '@/stores/siteStore';
import { useProductsStore } from '@/stores/productsStore';

const ChatWidget     = dynamic(() => import('@/components/chat/ChatWidget'),     { ssr: false });
const WhatsAppButton = dynamic(() => import('@/components/ui/WhatsAppButton'),   { ssr: false });
const CookieConsent  = dynamic(() => import('@/components/ui/CookieConsent'),    { ssr: false });

const FABRIC_PAT = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const TRUST = [
  { icon: Truck,     label: 'شحن مجاني +200 ر.س',   sub: 'لجميع مناطق المملكة' },
  { icon: Shield,    label: 'ضمان جودة 100%',         sub: 'أو استرداد كامل' },
  { icon: RefreshCw, label: 'إرجاع مجاني 14 يوم',    sub: 'سياسة مرنة' },
  { icon: Star,      label: '+500 نوع قماش',          sub: 'يتجدد أسبوعياً' },
];

const FEATURES = [
  { icon: '🧮', title: 'حاسبة القماش',    desc: 'احسبي الكمية بدقة', href: '/ai-measure'   },
  { icon: '👗', title: 'مصمم الفستان',    desc: 'جربي قبل الشراء',   href: '/dress-viewer' },
  { icon: '🤖', title: 'المساعد الذكي',   desc: 'خبيرتك الشخصية',    href: '/chat'         },
  { icon: '🧵', title: 'تشكيلة الأقمشة', desc: '+500 نوع فاخر',     href: '/products'     },
];

const CAROUSEL_ITEMS = [
  { emoji: '✂️', title: 'قص احترافي',    sub: 'بيد الحرفية',         bg: 'linear-gradient(135deg,#1E2B45,#2D4070)' },
  { emoji: '🧵', title: 'خيوط فاخرة',    sub: 'من أجود المصادر',     bg: 'linear-gradient(135deg,#F5A623,#D4880A)' },
  { emoji: '👗', title: 'تصاميم 2025',    sub: 'أحدث صيحات الموضة',  bg: 'linear-gradient(135deg,#1B6B45,#0A3A20)' },
  { emoji: '🌟', title: 'جودة ملكية',    sub: 'لا تُضاهى',           bg: 'linear-gradient(135deg,#5C1A7A,#3A0060)' },
  { emoji: '🚚', title: 'توصيل سريع',    sub: 'لجميع المناطق',       bg: 'linear-gradient(135deg,#1E2B45,#3D5A9A)' },
  { emoji: '💎', title: 'حرير طبيعي',    sub: 'الفخامة الحقيقية',    bg: 'linear-gradient(135deg,#C9922A,#8B6000)' },
];

/* ── Reusable Section Media Component ── */
function SectionMedia({ src, type, bg, children, minH = '100%' }: {
  src: string; type: string; bg: string; children: React.ReactNode; minH?: string;
}) {
  return (
    <div className="relative w-full h-full" style={{ minHeight: minH, background: src ? 'transparent' : bg }}>
      {src && type === 'image' && (
        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover"/>
      )}
      {src && type === 'video' && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          style={{ pointerEvents: 'none' }}
        >
          <source src={src} type="video/mp4"/>
          <source src={src} type="video/webm"/>
        </video>
      )}
      {src && <div className="absolute inset-0 bg-black/40"/>}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

/* ── Banner Card ── */
function BannerCard({ sectionKey, className = '', style = {} }: { sectionKey: string; className?: string; style?: React.CSSProperties }) {
  const sec = useSiteStore(s => s.getSection(sectionKey));
  if (!sec || !sec.active) return null;
  return (
    <Link href={sec.ctaLink || '/'} className={`block rounded-2xl overflow-hidden ${className}`} style={style}>
      <SectionMedia src={sec.media.src} type={sec.media.type} bg={sec.bgGradient} minH="100%">
        <div
          className="flex flex-col justify-end h-full p-5 sm:p-6 min-h-[inherit]"
          style={{ textAlign: sec.textAlign as any }}
        >
          {sec.badge && (
            <span className="inline-block text-xs font-black px-3 py-1 rounded-full mb-2 bg-white/20 backdrop-blur-sm"
                  style={{ color: sec.textColor }}>
              {sec.badge}
            </span>
          )}
          {sec.heading && (
            <h3 className="font-black leading-tight mb-1"
                style={{ color: sec.textColor, fontSize: 'clamp(1rem,2.5vw,1.4rem)' }}>
              {sec.heading}
            </h3>
          )}
          {sec.subheading && (
            <p className="text-sm mb-3" style={{ color: sec.textColor, opacity: 0.8 }}>
              {sec.subheading}
            </p>
          )}
          {sec.ctaText && (
            <span className="inline-flex items-center gap-1 text-xs font-black px-4 py-2 rounded-lg bg-white/15 border border-white/20 w-fit"
                  style={{ color: sec.textColor }}>
              {sec.ctaText} <ChevronLeft className="w-3 h-3"/>
            </span>
          )}
        </div>
      </SectionMedia>
    </Link>
  );
}

export default function HomePage() {
  const heroSec    = useSiteStore(s => s.getSection('hero'));
  const stripSec   = useSiteStore(s => s.getSection('strip'));
  const ctaSec     = useSiteStore(s => s.getSection('cta'));
  const settings   = useSiteStore(s => s.settings);
  const products   = useProductsStore(s => s.getActive());
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: 'l'|'r') =>
    carouselRef.current?.scrollBy({ left: dir === 'l' ? -260 : 260, behavior: 'smooth' });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bs-pearl)' }}>
      <Navbar />

      {/* ── STRIP BANNER ── */}
      {stripSec?.active && stripSec.heading && (
        <div
          className="py-2.5 px-4 text-sm font-bold text-center"
          style={{ background: stripSec.media.src ? 'transparent' : stripSec.bgGradient, color: stripSec.textColor }}
        >
          {stripSec.heading}
          {stripSec.ctaText && (
            <Link href={stripSec.ctaLink || '/'} className="mr-3 underline underline-offset-2 text-inherit">
              {stripSec.ctaText}
            </Link>
          )}
        </div>
      )}

      <main className="flex-1">

        {/* ═══════ SECTION 1: HERO (full-height) ═══════ */}
        <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
          <SectionMedia
            src={heroSec?.media.src || ''}
            type={heroSec?.media.type || 'gradient'}
            bg={heroSec?.bgGradient || 'var(--bs-grad-hero)'}
            minH="92vh"
          >
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ backgroundImage: FABRIC_PAT }}
            />
            <div className="relative flex flex-col" style={{ minHeight: '92vh' }}>
              {/* Main content */}
              <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">

                  {/* Text block */}
                  <div className="lg:col-span-3 space-y-5">
                    {/* Logo */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/90 p-1.5 shadow-2xl"
                         style={{ border: '2px solid rgba(245,166,35,0.4)' }}>
                      <Image src="/logo.jpg" alt={settings.storeName} width={96} height={96}
                             className="w-full h-full object-contain" priority/>
                    </div>

                    {heroSec?.badge && (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black"
                            style={{ background: 'rgba(245,166,35,0.15)', color: '#FFD580', border: '1px solid rgba(245,166,35,0.3)' }}>
                        {heroSec.badge}
                      </span>
                    )}

                    <h1
                      className="font-black text-white leading-none"
                      style={{
                        fontSize:    'clamp(2.5rem,7vw,5rem)',
                        fontFamily:  settings.fontHeading,
                        whiteSpace:  'pre-line',
                      }}
                    >
                      {(heroSec?.heading || 'BIN SIDDIQ\nFABRICS').split('\n').map((line, i) => (
                        <span key={i} style={{ display: 'block', color: i === 1 ? 'var(--bs-primary)' : 'white' }}>
                          {line}
                        </span>
                      ))}
                    </h1>

                    {heroSec?.subheading && (
                      <p className="text-white/70 max-w-lg" style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)', lineHeight: 1.8, fontFamily: settings.fontBody }}>
                        {heroSec.subheading}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link href={heroSec?.ctaLink || '/products'}
                            className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 font-black">
                        {heroSec?.ctaText || 'تسوق الآن'} <ChevronLeft className="w-4 h-4"/>
                      </Link>
                      <Link href="/dress-viewer"
                            className="flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-white transition-all hover:bg-white/20"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                        ✨ صممي فستانك
                      </Link>
                    </div>
                  </div>

                  {/* Banner grid */}
                  <div className="lg:col-span-2 space-y-3">
                    <BannerCard sectionKey="banner1" style={{ height: 180 }}/>
                    <div className="grid grid-cols-2 gap-3">
                      <BannerCard sectionKey="banner2" style={{ height: 120 }}/>
                      <Link href="/products"
                        className="rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-4 group"
                        style={{ height: 120, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                        <Star className="w-6 h-6 mb-1.5 text-yellow-400 group-hover:scale-110 transition-transform"/>
                        <p className="font-black text-white text-xs">+500 قماش</p>
                        <p className="text-white/60 text-[10px] mt-0.5">تسوق الآن</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust bar */}
              <div className="mt-auto" style={{ background: 'rgba(10,15,25,0.65)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(245,166,35,0.18)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                  {TRUST.map(t => (
                    <div key={t.label} className="flex items-center gap-2.5">
                      <t.icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--bs-primary)' }}/>
                      <div>
                        <p className="text-white text-xs font-bold leading-none">{t.label}</p>
                        <p className="text-white/40 text-[10px]">{t.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionMedia>
        </section>

        {/* ═══════ SECTION 2: HORIZONTAL CAROUSEL ═══════ */}
        <section className="py-10 sm:py-14 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--bs-primary)' }}>اكتشفي</p>
              <h2 className="font-black text-xl sm:text-2xl" style={{ color: 'var(--bs-navy)', fontFamily: settings.fontHeading }}>
                عالم الأقمشة
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel('r')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all hover:shadow-md"
                style={{ borderColor: 'var(--bs-primary)', color: 'var(--bs-primary)' }}>
                <ChevronRight className="w-4 h-4"/>
              </button>
              <button onClick={() => scrollCarousel('l')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90"
                style={{ background: 'var(--bs-grad)' }}>
                <ChevronLeft className="w-4 h-4"/>
              </button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-3 sm:gap-4 px-4 sm:px-6 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CAROUSEL_ITEMS.map((item, i) => (
              <div key={i} className="flex-shrink-0 snap-start rounded-2xl overflow-hidden relative cursor-pointer group"
                   style={{ width: 'clamp(160px, 40vw, 200px)', height: 'clamp(220px, 50vw, 260px)', background: item.bg }}>
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: FABRIC_PAT }}/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="text-4xl sm:text-5xl mb-3">{item.emoji}</div>
                  <h3 className="font-black text-white text-sm sm:text-base mb-1">{item.title}</h3>
                  <p className="text-white/70 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ SECTION 3: FEATURES ═══════ */}
        <section className="py-12 sm:py-16" style={{ background: 'var(--bs-pearl)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--bs-primary)' }}>خدماتنا</p>
              <h2 className="font-black mb-2" style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', color: 'var(--bs-navy)', fontFamily: settings.fontHeading }}>
                {'كل ما تحتاجينه'}
              </h2>
              <div className="brand-divider mx-auto"/>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {FEATURES.map(f => (
                <Link key={f.href} href={f.href}
                  className="card p-5 sm:p-7 text-center group block hover:no-underline">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 inline-block">
                    {f.icon}
                  </div>
                  <h3 className="font-black text-sm sm:text-base mb-1.5" style={{ color: 'var(--bs-navy)' }}>{f.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{f.desc}</p>
                  <span className="text-xs font-bold" style={{ color: 'var(--bs-primary)' }}>ابدئي الآن ←</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 4: PRODUCTS HORIZONTAL ═══════ */}
        <section className="py-12 sm:py-16 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--bs-primary)' }}>الأكثر مبيعاً</p>
              <h2 className="font-black text-xl sm:text-2xl" style={{ color: 'var(--bs-navy)' }}>منتجات مميزة</h2>
            </div>
            <Link href="/products" className="text-sm font-bold flex items-center gap-1 hover:opacity-70"
                  style={{ color: 'var(--bs-navy)' }}>
              الكل <ChevronLeft className="w-3.5 h-3.5"/>
            </Link>
          </div>
          <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 overflow-x-auto pb-3 snap-x"
               style={{ scrollbarWidth: 'none' }}>
            {products.slice(0, 8).map(p => (
              <Link key={p.id} href={`/products/${p.id}`}
                className="card flex-shrink-0 overflow-hidden hover:no-underline snap-start"
                style={{ width: 'clamp(160px,40vw,220px)' }}>
                <div className="relative overflow-hidden"
                     style={{ height: 120, background: `linear-gradient(135deg, ${p.colors?.[0]?.hex||'#F5A623'}, ${p.colors?.[1]?.hex||'#D4880A'})` }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: FABRIC_PAT }}/>
                  <span className="absolute bottom-2 right-2 badge badge-orange text-[9px]">{p.category}</span>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-black text-xs sm:text-sm truncate mb-1" style={{ color: 'var(--bs-navy)' }}>{p.name}</h3>
                  <span className="font-black text-sm sm:text-base" style={{ color: 'var(--bs-primary)' }}>
                    {p.price_per_meter}<span className="text-[10px] font-normal text-gray-400"> ر.س/م</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════ SECTION 5: CTA ═══════ */}
        {ctaSec?.active && (
          <section>
            <SectionMedia
              src={ctaSec.media.src}
              type={ctaSec.media.type}
              bg={ctaSec.bgGradient}
              minH="320px"
            >
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: FABRIC_PAT }}/>
              <div className="relative max-w-2xl mx-auto px-4 py-16 sm:py-20 text-center">
                <Image src="/logo.jpg" alt={settings.storeName} width={72} height={72}
                       className="mx-auto mb-5 rounded-2xl object-contain p-1.5"
                       style={{ background: 'rgba(255,255,255,0.1)' }}/>
                <h2 className="font-black mb-4" style={{
                  fontSize: 'clamp(1.6rem,4vw,2.8rem)',
                  fontFamily: settings.fontHeading,
                  color: ctaSec.textColor,
                }}>
                  {ctaSec.heading}
                </h2>
                {ctaSec.subheading && (
                  <p className="mb-8 text-sm sm:text-base" style={{ color: ctaSec.textColor, opacity: 0.75 }}>
                    {ctaSec.subheading}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/dress-viewer" className="btn-primary px-7 sm:px-8 py-3.5 sm:py-4 font-black text-sm sm:text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5"/> مصمم الفستان
                  </Link>
                  <Link href="/ai-measure" className="btn-navy px-7 sm:px-8 py-3.5 sm:py-4 font-black text-sm sm:text-base flex items-center gap-2">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5"/> حاسبة القماش
                  </Link>
                </div>
              </div>
            </SectionMedia>
          </section>
        )}

      </main>

      <Footer/>
      {settings.showChatWidget  && <ChatWidget/>}
      {settings.showWhatsApp    && <WhatsAppButton/>}
      <CookieConsent/>
    </div>
  );
}
