'use client';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft, Tag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const subtotal = total();
  const shipping = subtotal >= 200 ? 0 : 25;
  const grand    = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 page-container">

        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--bs-deep)' }}>
            <ChevronLeft className="w-4 h-4" />
            المنتجات
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold" style={{ color: 'var(--bs-vivid)' }}>سلة التسوق</span>
        </div>

        <h1 className="font-black text-3xl mb-8" style={{ color: 'var(--bs-deep)' }}>
          سلة التسوق
          {items.length > 0 && <span className="text-lg font-medium text-gray-400 mr-2">({items.length} منتج)</span>}
        </h1>

        {items.length === 0 ? (
          <div className="card py-20 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--bs-deep)' }} />
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--bs-deep)' }}>سلتك فارغة</p>
            <p className="text-gray-400 mb-8">اكتشفي أجمل الأقمشة الفاخرة</p>
            <Link href="/products" className="btn-primary inline-flex">تسوق الآن</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="card p-4 sm:p-5 flex items-center gap-4">
                  {/* Swatch */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${item.selected_color?.hex || item.product.colors[0]?.hex || '#D41E2F'}, ${item.product.colors[1]?.hex || '#8B1A1A'})` }}
                  >
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 0.5px, transparent 0, transparent 8px)', backgroundSize: '8px 8px' }} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm sm:text-base leading-snug truncate" style={{ color: 'var(--bs-dark)' }}>{item.product.name}</p>
                    <p className="text-xs mt-0.5 mb-2" style={{ color: 'var(--bs-silver)' }}>
                      {item.selected_color?.name || item.product.category} · {item.product.price_per_meter} ر.س/م
                    </p>
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all hover:border-current"
                        style={{ borderColor: 'var(--bs-silver)', color: 'var(--bs-deep)' }}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold" style={{ color: 'var(--bs-deep)' }}>{item.meters}م</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all hover:border-current"
                        style={{ borderColor: 'var(--bs-silver)', color: 'var(--bs-deep)' }}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Price + delete */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-base sm:text-lg" style={{ color: 'var(--bs-vivid)' }}>
                      {(item.product.price_per_meter * item.meters).toFixed(0)} ر.س
                    </p>
                    <button onClick={() => removeItem(item.product.id)}
                      className="mt-1.5 p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-300 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 mt-2">
                <Trash2 className="w-3 h-3" /> حذف السلة بالكامل
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-black text-lg mb-5" style={{ color: 'var(--bs-deep)' }}>ملخص الطلب</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-500 truncate ml-2" style={{ maxWidth: '65%' }}>
                        {item.product.name} ({item.meters}م)
                      </span>
                      <span className="font-semibold flex-shrink-0">{(item.product.price_per_meter * item.meters).toFixed(0)} ر.س</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-5" style={{ borderColor: 'rgba(184,184,184,0.2)' }}>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>الإجمالي الفرعي</span>
                    <span>{subtotal.toFixed(0)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">الشحن</span>
                    {shipping === 0
                      ? <span className="font-bold text-green-600 flex items-center gap-1"><Tag className="w-3 h-3" />مجاني</span>
                      : <span>{shipping} ر.س</span>
                    }
                  </div>
                  {subtotal < 200 && (
                    <p className="text-xs mt-1 p-2.5 rounded-lg" style={{ background: 'rgba(212,30,47,0.06)', color: 'var(--bs-deep)' }}>
                      أضيفي {(200 - subtotal).toFixed(0)} ر.س للحصول على شحن مجاني
                    </p>
                  )}
                </div>

                <div className="flex justify-between font-black text-lg mb-5" style={{ color: 'var(--bs-deep)' }}>
                  <span>الإجمالي</span>
                  <span style={{ color: 'var(--bs-vivid)' }}>{grand.toFixed(0)} ر.س</span>
                </div>

                <Link href="/checkout" className="btn-primary w-full justify-center py-4 text-base font-bold">
                  إتمام الشراء ←
                </Link>
                <Link href="/products" className="btn-secondary w-full justify-center py-3 mt-3 text-sm">
                  مواصلة التسوق
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
