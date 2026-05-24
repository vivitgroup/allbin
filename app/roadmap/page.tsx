import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'خارطة الطريق | بن صديق للأقمشة',
  robots: { index: false },
};

const PHASES = [
  {
    phase: 'المرحلة الأولى',
    label: 'مكتملة ✅',
    color: '#16a34a',
    bg: '#dcfce710',
    items: [
      { done:true,  text:'موقع إلكتروني كامل (Next.js 14 App Router)',              priority:'' },
      { done:true,  text:'متجر أقمشة مع تصفية وبحث حي',                             priority:'' },
      { done:true,  text:'مصمم الفستان التفاعلي مع موديل SVG وألوان البشرة',        priority:'' },
      { done:true,  text:'حاسبة القماش الذكية (AI API)',                              priority:'' },
      { done:true,  text:'لوحة تحكم المسؤول — CRUD كامل مع مزامنة فورية',           priority:'' },
      { done:true,  text:'4 بيكسلات: Google Analytics + Meta + TikTok + Snapchat',  priority:'' },
      { done:true,  text:'Moyasar + Geidea + Apple Pay + مدى + STC Pay',             priority:'' },
      { done:true,  text:'المساعد الذكي "سدى" — 100+ سؤال وإجابة',                  priority:'' },
      { done:true,  text:'SEO 100% — ينبع وجدة والمملكة + JSON-LD + sitemap',       priority:'' },
      { done:true,  text:'واتساب + Cookie Consent + نشرة إلكترونية',                 priority:'' },
      { done:true,  text:'Loading animation — حركة المقص وحروف BS',                  priority:'' },
      { done:true,  text:'172 اختبار تلقائي شامل (Vitest)',                           priority:'' },
    ],
  },
  {
    phase: 'المرحلة الثانية',
    label: 'قريباً 🔜',
    color: '#D41E2F',
    bg: 'rgba(212,30,47,0.05)',
    items: [
      { done:false, text:'Tabby / Tamara — تقسيط بدون فوائد (الأكثر طلباً في السعودية)', priority:'عالي' },
      { done:false, text:'نظام مراجعات وتقييمات المنتجات من العملاء مع صور',              priority:'عالي' },
      { done:false, text:'قائمة المفضلة (Wishlist) مع مشاركة على سوشيال ميديا',           priority:'عالي' },
      { done:false, text:'ربط Supabase حقيقي — auth + database + realtime',               priority:'عالي' },
      { done:false, text:'نظام نقاط الولاء — كل 100 ر.س = 10 نقاط قابلة للاسترداد',     priority:'متوسط' },
      { done:false, text:'Push Notifications — إشعارات الطلبات والعروض الحصرية',          priority:'متوسط' },
      { done:false, text:'PWA كاملة — تثبيت على الموبايل كتطبيق بدون متجر',               priority:'متوسط' },
      { done:false, text:'نظام كوبون الخصم والعروض الترويجية المجدولة',                    priority:'متوسط' },
      { done:false, text:'تتبع الشحن في الوقت الحقيقي مع رقم التتبع',                     priority:'متوسط' },
      { done:false, text:'ميزة "طلب عينة قماش" — توصيل مجاني للعينات',                    priority:'منخفض' },
    ],
  },
  {
    phase: 'المرحلة الثالثة',
    label: 'مستقبلاً 🔮',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.05)',
    items: [
      { done:false, text:'تطبيق موبايل iOS + Android (React Native)',                     priority:'عالي' },
      { done:false, text:'AI Virtual Try-On — تجربة الفستان بصورة العميل الحقيقية',       priority:'عالي' },
      { done:false, text:'بث مباشر Shopping — شراء مباشر أثناء البث',                    priority:'عالي' },
      { done:false, text:'برنامج المؤثرين — عمولة أفيلييت للمؤثرات',                     priority:'متوسط' },
      { done:false, text:'متجر الجملة B2B للخياطين والمحلات التجارية',                   priority:'متوسط' },
      { done:false, text:'AI Color Matching — اقتراح ألوان من صورة الزي المطلوب',        priority:'متوسط' },
      { done:false, text:'AR Preview — تجربة القماش بكاميرا الموبايل',                   priority:'متوسط' },
      { done:false, text:'خدمة الاشتراك الشهري — صندوق أقمشة مفاجأة',                    priority:'منخفض' },
      { done:false, text:'توسع خليجي — الكويت، الإمارات، قطر، البحرين',                 priority:'منخفض' },
      { done:false, text:'Marketplace — منصة للخياطين المحليين في ينبع وجدة',            priority:'منخفض' },
    ],
  },
];

const PRIORITY_COLOR: Record<string,string> = {
  'عالي':   '#D41E2F',
  'متوسط':  '#D4AF37',
  'منخفض':  '#B8B8B8',
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 page-container max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color:'var(--bs-vivid)' }}>
            خطة التطوير
          </p>
          <h1 className="font-black mb-3" style={{ fontSize:'clamp(1.8rem,5vw,3rem)', color:'var(--bs-deep)' }}>
            خارطة الطريق 🗺️
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            رؤيتنا لتطوير منصة بن صديق للأقمشة — من متجر رقمي متكامل إلى منصة أزياء عربية رائدة
          </p>
        </div>

        <div className="space-y-6">
          {PHASES.map((phase) => (
            <div key={phase.phase} className="card overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b"
                   style={{ background:phase.bg, borderColor:`${phase.color}20` }}>
                <h2 className="font-black text-lg" style={{ color:phase.color }}>{phase.phase}</h2>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background:`${phase.color}15`, color:phase.color }}>
                  {phase.label}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor:'rgba(184,184,184,0.1)' }}>
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-black/[0.015] transition-colors">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                         style={{ background:item.done ? '#16a34a' : 'rgba(184,184,184,0.25)' }}>
                      <span className="text-[11px] font-black" style={{ color:item.done?'white':'#9ca3af' }}>
                        {item.done ? '✓' : '○'}
                      </span>
                    </div>
                    <p className="text-sm flex-1 leading-relaxed"
                       style={{ color:item.done?'#15803d':'var(--bs-dark)', fontWeight:item.done?600:400 }}>
                      {item.text}
                    </p>
                    {item.priority && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background:`${PRIORITY_COLOR[item.priority]}12`, color:PRIORITY_COLOR[item.priority] }}>
                        {item.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="px-6 py-3 border-t" style={{ borderColor:'rgba(184,184,184,0.15)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">التقدم</span>
                  <span className="text-xs font-bold" style={{ color:phase.color }}>
                    {phase.items.filter(i=>i.done).length}/{phase.items.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(184,184,184,0.2)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width:`${(phase.items.filter(i=>i.done).length/phase.items.length)*100}%`, background:phase.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-8 text-center"
             style={{ background:'linear-gradient(135deg, var(--bs-dark), #3D0808)', borderColor:'transparent' }}>
          <p className="font-black text-xl text-white mb-2">اقتراح ميزة جديدة؟</p>
          <p className="text-white/60 text-sm mb-5">نستمع دائماً لعملائنا — شاركينا أفكارك</p>
          <a href="https://wa.me/966500000000?text=اقتراح لموقع بن صديق: "
             target="_blank" rel="noopener noreferrer"
             className="btn-primary inline-flex">
            📩 تواصل معنا عبر واتساب
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
