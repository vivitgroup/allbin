export default function AnalyticsPage() {
  const months  = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو'];
  const revenue = [45000, 52000, 48000, 61000, 55000, 72000, 68000];
  const maxRev  = Math.max(...revenue);

  return (
    <div className="p-5 sm:p-8" style={{ background:'var(--bs-pearl)', minHeight:'100%' }}>
      <h1 className="font-black text-2xl sm:text-3xl mb-1" style={{ color:'var(--bs-deep)' }}>التحليلات</h1>
      <p className="text-sm mb-8" style={{ color:'var(--bs-silver)' }}>تقرير الأداء لعام 2024</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Revenue Bar Chart */}
        <div className="card p-6 lg:col-span-2 bg-white">
          <h2 className="font-black text-base mb-5" style={{ color:'var(--bs-deep)' }}>الإيرادات الشهرية (ر.س)</h2>
          <div className="flex items-end gap-2 h-44 overflow-x-auto pb-2">
            {revenue.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-[36px]">
                <span className="text-[11px] font-bold" style={{ color:'var(--bs-deep)' }}>{(val/1000).toFixed(0)}K</span>
                <div
                  className="w-full rounded-t-xl transition-all hover:opacity-80"
                  style={{ height:`${(val/maxRev)*100}%`, minHeight:'8px', background:'var(--bs-grad)' }}
                  title={`${val.toLocaleString('ar')} ر.س`}
                />
                <span className="text-[10px]" style={{ color:'var(--bs-silver)' }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6 bg-white">
          <h2 className="font-black text-base mb-4" style={{ color:'var(--bs-deep)' }}>أكثر المنتجات مبيعاً</h2>
          <div className="space-y-4">
            {[
              { name:'قماش ساتان ملكي',   sales:142, pct:92 },
              { name:'قماش جورجيت فاخر',  sales:128, pct:83 },
              { name:'قماش حرير طبيعي',   sales:97,  pct:63 },
              { name:'قماش دانتيل فرنسي', sales:74,  pct:48 },
            ].map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-gray-800">{p.name}</span>
                  <span style={{ color:'var(--bs-silver)' }}>{p.sales} م</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(184,184,184,0.2)' }}>
                  <div className="h-full rounded-full" style={{ width:`${p.pct}%`, background:'var(--bs-grad)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="card p-6 bg-white">
          <h2 className="font-black text-base mb-4" style={{ color:'var(--bs-deep)' }}>توزيع الفئات</h2>
          <div className="space-y-3">
            {[
              { cat:'ساتان',   pct:32, color:'#D4AF37' },
              { cat:'جورجيت', pct:25, color:'var(--bs-vivid)' },
              { cat:'حرير',   pct:20, color:'#7e22ce' },
              { cat:'شيفون',  pct:15, color:'#1d4ed8' },
              { cat:'أخرى',   pct:8,  color:'var(--bs-silver)' },
            ].map((c) => (
              <div key={c.cat} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:c.color }} />
                <span className="text-sm flex-1 font-medium text-gray-700">{c.cat}</span>
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background:'rgba(184,184,184,0.2)' }}>
                  <div className="h-full rounded-full" style={{ width:`${c.pct}%`, background:c.color }} />
                </div>
                <span className="text-sm w-8 text-right font-bold" style={{ color:'var(--bs-deep)' }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
