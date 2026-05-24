'use client';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { ORDER_STATUS_MAP } from '@/lib/utils';

const MOCK_ORDERS = [
  { id: 'ORD-001', status: 'delivered', total_amount: 255, created_at: '2024-06-15T10:00:00Z', items: ['قماش جورجيت فاخر (3م)'] },
  { id: 'ORD-002', status: 'processing', total_amount: 500, created_at: '2024-07-01T14:30:00Z', items: ['قماش ساتان ملكي (2م)'] },
  { id: 'ORD-003', status: 'shipped', total_amount: 130, created_at: '2024-07-05T09:00:00Z', items: ['قماش شيفون (2م)'] },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-6">لا توجد طلبات بعد</p>
            <Link href="/products" className="btn-primary">تسوق الآن</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => {
              const status = ORDER_STATUS_MAP[order.status];
              return (
                <div key={order.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg">طلب #{order.id}</span>
                        <span className={`badge ${status.color}`}>{status.label}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{order.items.join(', ')}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-black text-brand">{order.total_amount}</p>
                        <p className="text-sm text-gray-500">ر.س</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
