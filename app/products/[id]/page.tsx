'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ShoppingCart, ArrowRight, Minus, Plus, Check, Tag, Truck } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useProductsStore } from '@/stores/productsStore';
import { FabricColor } from '@/types';

export default function ProductPage() {
  const { id } = useParams() as { id: string };
  const products = useProductsStore((s) => s.products);
  const product  = products.find((p) => p.id === id && p.is_active);

  const [selectedColor, setSelectedColor] = useState<FabricColor | null>(null);
  const [meters,  setMeters]  = useState(2);
  const [added,   setAdded]   = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const color = selectedColor ?? product?.colors[0] ?? null;

  if (!product) return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-6xl mb-4">🧵</p>
          <h1 className="font-black text-2xl mb-3" style={{ color: 'var(--bs-deep)' }}>المنتج غير متاح</h1>
          <p className="text-gray-500 mb-6">ربما تم حذفه أو إخفاؤه مؤقتاً</p>
          <Link href="/products" className="btn-primary inline-flex">تصفح المنتجات</Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const handleAdd = () => {
    addItem(product, meters, color ?? undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const lineTotal = (product.price_per_meter * meters).toFixed(0);

  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 page-container">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" aria-label="breadcrumb">
          <Link href="/"        className="hover:opacity-70 transition-opacity" style={{ color: 'var(--bs-silver)' }}>الرئيسية</Link>
          <span style={{ color: 'var(--bs-silver)' }}>/</span>
          <Link href="/products" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--bs-silver)' }}>المنتجات</Link>
          <span style={{ color: 'var(--bs-silver)' }}>/</span>
          <span className="font-semibold truncate" style={{ color: 'var(--bs-deep)' }}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Fabric Swatch ── */}
          <div className="space-y-3">
            <div
              className="aspect-square rounded-bs-lg relative overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(135deg, ${color?.hex ?? '#D41E2F'}, ${product.colors[1]?.hex ?? '#8B1A1A'})` }}
            >
              {/* Fabric texture */}
              <div className="absolute inset-0 opacity-[0.07]"
                   style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 0.5px, transparent 0, transparent 10px)', backgroundSize: '10px 10px' }} />
              {/* Shine */}
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)' }} />
              {/* Category label */}
              <div className="absolute top-4 right-4">
                <span className="badge badge-silver backdrop-blur-sm bg-white/80 text-xs font-bold">
                  {product.category}
                </span>
              </div>
              {/* Stock */}
              <div className="absolute bottom-4 left-4">
                <span className={`badge ${product.stock_quantity > 50 ? 'badge-green' : product.stock_quantity > 0 ? 'badge-yellow' : 'badge-red'}`}>
                  {product.stock_quantity > 50 ? '✓ متوفر' : product.stock_quantity > 0 ? `متبقي ${product.stock_quantity}م` : 'نفد المخزون'}
                </span>
              </div>
            </div>

            {/* Color thumbnails */}
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className="flex-1 h-12 rounded-xl relative overflow-hidden border-2 transition-all duration-200"
                  style={{
                    background:  `linear-gradient(135deg, ${c.hex}, ${c.hex}88)`,
                    borderColor: color?.hex === c.hex ? 'var(--bs-vivid)' : 'transparent',
                    boxShadow:   color?.hex === c.hex ? '0 0 0 1px var(--bs-vivid)' : 'none',
                    transform:   color?.hex === c.hex ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {color?.hex === c.hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--bs-vivid)' }}>{product.category}</p>
            <h1 className="font-black mb-2 leading-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'var(--bs-dark)' }}>
              {product.name}
            </h1>
            <p className="text-gray-500 leading-relaxed mb-6 text-base">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-black" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--bs-vivid)' }}>
                {product.price_per_meter}
              </span>
              <span className="text-base" style={{ color: 'var(--bs-silver)' }}>ر.س للمتر</span>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <p className="font-bold text-sm mb-3" style={{ color: 'var(--bs-deep)' }}>
                اللون: <span style={{ color: 'var(--bs-vivid)' }}>{color?.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c)}
                    className="w-10 h-10 rounded-full border-4 transition-all duration-200"
                    style={{
                      backgroundColor: c.hex,
                      borderColor:     color?.hex === c.hex ? 'var(--bs-vivid)' : 'rgba(184,184,184,0.4)',
                      transform:       color?.hex === c.hex ? 'scale(1.2)' : 'scale(1)',
                      boxShadow:       color?.hex === c.hex ? `0 0 0 2px white, 0 0 0 4px var(--bs-vivid)` : 'none',
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-bold text-sm mb-3" style={{ color: 'var(--bs-deep)' }}>الكمية (بالمتر)</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMeters(Math.max(0.5, meters - 0.5))}
                  className="w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold transition-all hover:border-current"
                  style={{ borderColor: 'rgba(184,184,184,0.4)', color: 'var(--bs-deep)' }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center min-w-[70px]">
                  <span className="font-black text-2xl" style={{ color: 'var(--bs-dark)' }}>{meters}</span>
                  <span className="text-sm mr-1" style={{ color: 'var(--bs-silver)' }}>متر</span>
                </div>
                <button
                  onClick={() => setMeters(meters + 0.5)}
                  className="w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold transition-all hover:border-current"
                  style={{ borderColor: 'rgba(184,184,184,0.4)', color: 'var(--bs-deep)' }}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="mr-2">
                  <p className="text-xs" style={{ color: 'var(--bs-silver)' }}>الإجمالي</p>
                  <p className="font-black text-lg" style={{ color: 'var(--bs-deep)' }}>{lineTotal} ر.س</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAdd}
                disabled={product.stock_quantity === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-bs font-black text-base text-white transition-all duration-300"
                style={{
                  background:  added ? '#16a34a' : 'var(--bs-grad)',
                  boxShadow:   added ? '0 4px 16px rgba(22,163,74,0.4)' : '0 4px 16px rgba(212,30,47,0.35)',
                  transform:   added ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                {added
                  ? <><Check className="w-5 h-5" strokeWidth={3} /> أضيف للسلة!</>
                  : <><ShoppingCart className="w-5 h-5" /> أضف للسلة</>}
              </button>
              <Link href="/ai-measure"
                className="btn-outline px-5 py-4 rounded-bs font-bold text-sm whitespace-nowrap">
                حاسبة القماش
              </Link>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: 'شحن مجاني فوق 200 ر.س' },
                { icon: Tag,   text: 'ضمان جودة أو استرداد' },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(184,184,184,0.1)' }}>
                  <t.icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--bs-vivid)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--bs-deep)' }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
