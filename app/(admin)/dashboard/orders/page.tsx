'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { ORDER_STATUS_MAP } from '@/lib/utils';

const ORDERS = [
  { id: 'ORD-0821', customer: 'نورة الأحمدي', phone: '+966501234567', amount: 510, status: 'processing', date: '2024-07-10', items: 'ساتان ملكي 2م + جورجيت 1م' },
  { id: 'ORD-0820', customer: 'سارة المطيري', phone: '+966509876543', amount: 250, status: 'shipped', date: '2024-07-09', items: 'ساتان ملكي 1م' },
  { id: 'ORD-0819', customer: 'هند الزهراني', phone: '+966501122334', amount: 750, status: 'delivered', date: '2024-07-08', items: 'حرير طبيعي 1م + قطيفة 2م' },
  { id: 'ORD-0818', customer: 'ريم العتيبي', phone: '+966505544332', amount: 95, status: 'pending', date: '2024-07-08', items: 'كريب مبتكر 1م' },
  { id: 'ORD-0817', customer: 'منى الشمري', phone: '+966507788990', amount: 320, status: 'delivered', date: '2024-07-07', items: 'دانتيل فرنسي 1م' },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = ORDERS
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)
    .filter((o) => o.customer.includes(search) || o.id.includes(search));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">الطلبات</h1>
        <p className="text-gray-500 mt-1">{ORDERS.length} طلب إجمالي</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="ابحث باسم العميل أو رقم الطلب..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pr-9 py-2" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'bg-[#C41E3A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s === 'all' ? 'الكل' : ORDER_STATUS_MAP[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['رقم الطلب', 'العميل', 'الطلبات', 'المبلغ', 'الحالة', 'التاريخ', 'إجراءات'].map((h) => (
                  <th key={h} className="px-6 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((order) => {
                const st = ORDER_STATUS_MAP[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-[#C41E3A]">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.items}</td>
                    <td className="px-6 py-4 font-bold">{order.amount} ر.س</td>
                    <td className="px-6 py-4"><span className={`badge ${st.color}`}>{st.label}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.date).toLocaleDateString('ar-SA')}</td>
                    <td className="px-6 py-4">
                      <select className="text-sm border rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#C41E3A]" defaultValue={order.status}>
                        <option value="pending">معلق</option>
                        <option value="processing">قيد التجهيز</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التوصيل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
