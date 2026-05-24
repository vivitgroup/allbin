import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ORDER_STATUS_MAP } from '@/lib/utils';

const STATS = [
  { label:'المنتجات',  value:'147',  change:'+12',  up:true,  icon:Package,      color:'var(--bs-deep)' },
  { label:'الطلبات',   value:'1,284',change:'+8%',  up:true,  icon:ShoppingCart, color:'var(--bs-vivid)' },
  { label:'العملاء',   value:'3,621',change:'+15%', up:true,  icon:Users,        color:'#2563eb' },
  { label:'الإيرادات', value:'182K', change:'+23%', up:true,  icon:TrendingUp,   color:'#7c3aed' },
];

const ORDERS = [
  { id:'ORD-0821', customer:'نورة الأحمدي',  amount:510,  status:'processing', date:'2024-07-10' },
  { id:'ORD-0820', customer:'سارة المطيري',   amount:250,  status:'shipped',    date:'2024-07-09' },
  { id:'ORD-0819', customer:'هند الزهراني',   amount:750,  status:'delivered',  date:'2024-07-08' },
  { id:'ORD-0818', customer:'ريم العتيبي',    amount:95,   status:'pending',    date:'2024-07-08' },
  { id:'ORD-0817', customer:'منى الشمري',     amount:320,  status:'delivered',  date:'2024-07-07' },
];

export default function DashboardPage() {
  return (
    <div className="p-5 sm:p-8 max-w-7xl" style={{ background: 'var(--bs-pearl)', minHeight: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-black text-2xl sm:text-3xl" style={{ color: 'var(--bs-deep)' }}>لوحة التحكم</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--bs-silver)' }}>
          {new Date().toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                   style={{ background: `${s.color}18`, color: s.color }}>
                <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <div className="font-black text-2xl sm:text-3xl" style={{ color: 'var(--bs-dark)' }}>{s.value}</div>
            <div className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--bs-silver)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden bg-white">
        <div className="px-5 sm:px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(184,184,184,0.2)' }}>
          <h2 className="font-black text-base sm:text-lg" style={{ color: 'var(--bs-deep)' }}>آخر الطلبات</h2>
          <button className="text-xs sm:text-sm font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--bs-vivid)' }}>
            عرض الكل
          </button>
        </div>
        {/* Mobile: cards */}
        <div className="sm:hidden divide-y" style={{ borderColor: 'rgba(184,184,184,0.15)' }}>
          {ORDERS.map((o) => {
            const st = ORDER_STATUS_MAP[o.status];
            return (
              <div key={o.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--bs-vivid)' }}>{o.id}</span>
                  <span className={`badge ${st.color}`}>{st.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: 'var(--bs-dark)' }}>{o.customer}</span>
                  <span className="font-black" style={{ color: 'var(--bs-deep)' }}>{o.amount} ر.س</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'var(--bs-pearl)' }}>
              <tr>
                {['رقم الطلب','العميل','المبلغ','الحالة','التاريخ'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-right text-xs font-bold border-b" style={{ color: 'var(--bs-silver)', borderColor: 'rgba(184,184,184,0.2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => {
                const st = ORDER_STATUS_MAP[o.status];
                return (
                  <tr key={o.id} className="border-b hover:bg-black/[0.015] transition-colors" style={{ borderColor: 'rgba(184,184,184,0.12)' }}>
                    <td className="px-5 py-4 font-mono text-sm font-bold" style={{ color: 'var(--bs-vivid)' }}>{o.id}</td>
                    <td className="px-5 py-4 font-semibold text-sm" style={{ color: 'var(--bs-dark)' }}>{o.customer}</td>
                    <td className="px-5 py-4 font-black" style={{ color: 'var(--bs-deep)' }}>{o.amount} ر.س</td>
                    <td className="px-5 py-4"><span className={`badge ${st.color}`}>{st.label}</span></td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--bs-silver)' }}>{new Date(o.date).toLocaleDateString('ar-SA')}</td>
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
