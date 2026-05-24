'use client';
import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';
import { useProductsStore } from '@/stores/productsStore';
import { useCartStore } from '@/stores/cartStore';
import { trackAddToCart } from '@/components/pixels/PixelScripts';

const FABRIC_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='1'%3E%3Cpath d='M0 0 L100 100'/%3E%3Cpath d='M100 0 L0 100'/%3E%3Cpath d='M50 0 L50 100'/%3E%3Cpath d='M0 50 L100 50'/%3E%3C/g%3E%3C/svg%3E")`;

const CATEGORIES = ['الكل', 'جورجيت', 'ساتان', 'شيفون', 'قطن', 'كريب', 'حرير', 'قطيفة', 'دانتيل'];
const SORTS = [
  { id:'default', label:'الافتراضي' },
  { id:'price-asc', label:'السعر: الأقل' },
  { id:'price-desc', label:'السعر: الأعلى' },
  { id:'name', label:'الاسم' },
];

export default function ProductsPage() {
  const products = useProductsStore(s => s.getActive());
  const addItem  = useCartStore(s => s.addItem);
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('الكل');
  const [sort,    setSort]    = useState('default');
  const [added,   setAdded]   = useState<string|null>(null);

  let filtered = products.filter(p => {
    if (cat !== 'الكل' && p.category !== cat) return false;
    if (search && !p.name.includes(search) && !p.description.includes(search)) return false;
    return true;
  });

  if (sort === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'name')       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name, 'ar'));

  const quickAdd = (p: typeof products[0]) => {
    addItem(p, 1);
    trackAddToCart(p.name, p.price);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />

      {/* Hero with fabric texture */}
      <div className="relative overflow-hidden" style={{ minHeight:220 }}>
        <div className="absolute inset-0" style={{ background:'var(--bs-grad-hero)', backgroundImage:FABRIC_SVG }}/>
        {/* Animated fabric threads */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="absolute top-0 w-0.5 h-full"
                 style={{
                   left:`${10+i*12}%`,
                   background:`linear-gradient(to bottom, transparent, ${i%2===0?'#F5A623':'#fff'}, transparent)`,
                   animation:`fabricThread ${2+i*0.4}s ${i*0.3}s ease-in-out infinite alternate`,
                   opacity: 0.6,
                 }}/>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'var(--bs-primary)' }}>
            تشكيلتنا الكاملة
          </p>
          <h1 className="font-black text-white mb-4" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontFamily:'Georgia,serif' }}>
            متجر الأقمشة
          </h1>
          <p className="text-white/70 max-w-md mx-auto">+500 نوع من أرقى الأقمشة العالمية — اختاري وأضيفي للسلة</p>
        </div>
        <style>{`@keyframes fabricThread{from{transform:scaleY(0.9) translateY(-5%)}to{transform:scaleY(1.1) translateY(5%)}}`}</style>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b" style={{ borderColor:'var(--bs-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--bs-silver)' }}/>
              <input
                type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="ابحثي عن قماش..."
                className="input pr-9 py-2.5 text-sm"
                dir="rtl"
              />
            </div>
            {/* Category */}
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className="flex-shrink-0 text-xs px-3 py-2 rounded-lg font-bold transition-all"
                  style={{
                    background: cat===c ? 'var(--bs-grad)' : 'var(--bs-pearl)',
                    color:      cat===c ? 'white' : 'var(--bs-navy)',
                    boxShadow:  cat===c ? '0 2px 8px rgba(245,166,35,0.3)' : 'none',
                  }}>
                  {c}
                </button>
              ))}
            </div>
            {/* Sort */}
            <select className="input py-2.5 text-sm w-full sm:w-auto" value={sort} onChange={e=>setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <main className="flex-1 page-container">
        <p className="text-sm mb-5" style={{ color:'var(--bs-silver)' }}>
          {filtered.length} منتج{filtered.length !== products.length ? ` من ${products.length}` : ''}
        </p>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🧵</p>
            <p className="font-bold text-lg" style={{ color:'var(--bs-navy)' }}>لا توجد نتائج</p>
            <button onClick={() => { setSearch(''); setCat('الكل'); }} className="mt-4 btn-outline text-sm">
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="card overflow-hidden group">
                <Link href={`/products/${p.id}`}>
                  <div className="relative h-40 overflow-hidden"
                       style={{ background:`linear-gradient(135deg, ${p.colors?.[0]?.hex||'#F5A623'}, ${p.colors?.[1]?.hex||'#D4880A'})` }}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: FABRIC_SVG }}/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"/>
                    {p.colors?.[0] && (
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {p.colors.slice(0,3).map(c => (
                          <div key={c.hex} className="w-4 h-4 rounded-full border-2 border-white shadow"
                               style={{ background:c.hex }}/>
                        ))}
                      </div>
                    )}
                    <span className="absolute top-2 right-2 badge badge-orange text-[10px]">{p.category}</span>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${p.id}`}>
                    <h3 className="font-black text-sm mb-1 truncate hover:underline" style={{ color:'var(--bs-navy)' }}>
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-xs mb-3 line-clamp-2 text-gray-400">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base" style={{ color:'var(--bs-primary)' }}>
                      {p.price_per_meter}<span className="text-xs font-normal text-gray-400"> ر.س/م</span>
                    </span>
                    <button
                      onClick={() => quickAdd(p)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: added===p.id ? '#16a34a' : 'var(--bs-grad)' }}>
                      {added===p.id ? '✓' : <ShoppingCart className="w-3.5 h-3.5"/>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}
