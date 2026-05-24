import Link from 'next/link';
import NewsletterStrip from './NewsletterStrip';
import Image from 'next/image';

const NAV_LINKS = {
  'المتجر':  [['/', 'الرئيسية'], ['/products', 'المنتجات'], ['/cart', 'السلة'], ['/orders', 'طلباتي']],
  'الأدوات': [['/ai-measure', 'حاسبة القماش'], ['/dress-viewer', 'مصمم الفستان'], ['/chat', 'المساعد الذكي'], ['/roadmap', 'خارطة الطريق']],
  'الحساب':  [['/login', 'تسجيل الدخول'], ['/register', 'إنشاء حساب'], ['/dashboard', 'لوحة التحكم']],
};

const SOCIAL = [
  {
    name:  'Facebook',
    label: 'فيسبوك',
    href:  'https://web.facebook.com/profile.php?id=61590399539166',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name:  'Instagram',
    label: 'انستجرام',
    href:  'https://www.instagram.com/bin.siddiq.alnazawi?igsh=Nm42MG9qcXJsa2pk&utm_source=qr',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name:  'TikTok',
    label: 'تيك توك',
    href:  'https://www.tiktok.com/@bin.siddiq7?_r=1&_t=ZS-96bWONLBrwQ',
    color: '#010101',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.2 8.2 0 004.83 1.56V7a4.85 4.85 0 01-1.06-.31z"/>
      </svg>
    ),
  },
  {
    name:     'Snapchat',
    label:    'سناب شات',
    href:     'https://snapchat.com/t/C2cnELIj',
    color:    '#FFFC00',
    darkIcon: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M12.065.026C9.09.026 6.62 1.27 5.18 3.355c-.89 1.283-1.11 2.734-1.11 4.39 0 .43.025.855.07 1.275-.235.11-.49.17-.755.17-.41 0-.77-.15-1.06-.42-.11-.1-.23-.16-.36-.16-.285 0-.525.235-.525.525 0 .1.03.2.085.285.255.395.855.73 1.785.9.065.015.145.025.23.035-.24.72-.7 1.49-1.355 2.04-.44.375-.7.64-.7.95 0 .31.195.59.505.7.415.15.84.22 1.25.22.655 0 1.09-.21 1.35-.395.515.74 1.55 1.945 3.25 2.645.15.06.28.12.28.27 0 .23-.27.36-.47.47-.635.34-1.745.535-1.95 1.03-.08.185.02.4.21.49.13.06.27.09.41.09.195 0 .385-.065.54-.185.09-.07.185-.135.28-.2.425-.3.945-.485 1.695-.485.72 0 1.235.18 1.65.475.455.325 1.065.55 1.785.55.945 0 1.735-.41 2.11-.93.14-.19.28-.31.42-.31.15 0 .3.055.45.11.32.12.705.255 1.115.255.26 0 .525-.05.785-.165.235-.105.395-.325.395-.565 0-.305-.225-.535-.525-.66-.535-.225-1.355-.445-1.74-.86.06-.03.115-.07.175-.11 1.635-.72 2.64-1.89 3.15-2.63.265.185.7.395 1.355.395.41 0 .835-.07 1.25-.22.31-.11.505-.39.505-.7 0-.31-.26-.575-.7-.95-.655-.55-1.115-1.32-1.355-2.04.085-.01.165-.02.23-.035.93-.17 1.53-.505 1.785-.9a.51.51 0 00.085-.285c0-.29-.24-.525-.525-.525-.13 0-.25.06-.36.16-.29.27-.65.42-1.06.42-.265 0-.52-.06-.755-.17.045-.42.07-.845.07-1.275 0-1.685-.235-3.1-1.11-4.39C17.38 1.27 14.99.026 12.065.026z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
    <NewsletterStrip />
    <footer style={{ background: 'var(--bs-dark)' }} className="text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">

          {/* ── Brand Block ── */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/95 p-1 shadow-lg">
                <Image src="/logo.jpg" alt="بن صديق للأقمشة الفاخرة" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-black text-white text-lg leading-none">بن صديق للأقمشة</p>
                <p className="text-[11px] tracking-widest uppercase font-semibold mt-0.5" style={{ color: 'var(--bs-vivid)' }}>
                  FABRIC · PREMIUM QUALITY
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              أفضل الأقمشة الفاخرة في ينبع والمملكة العربية السعودية. جودة لا تُضاهى مع توصيل سريع لجميع المناطق.
            </p>

            <div className="text-xs space-y-1.5 mb-6 text-white/50">
              <p>📍 ينبع، المنطقة الغربية، المملكة العربية السعودية</p>
              <p>📧 info@binsiddiq.com</p>
              <p>📱 +966 50 000 0000</p>
              <p>🕐 السبت – الخميس: 9ص – 10م</p>
            </div>

            {/* ── Social Media Icons ── */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                تابعونا على السوشيال ميديا
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {SOCIAL.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — بن صديق للأقمشة`}
                    title={s.label}
                    className="group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {/* Hover bg */}
                    <span
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: s.color }}
                      aria-hidden="true"
                    />
                    {/* Icon */}
                    <span
                      className="relative z-10 transition-colors duration-200"
                      style={{ color: s.darkIcon ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.7)' }}
                    >
                      {s.icon}
                    </span>
                  </a>
                ))}
              </div>
              {/* Social usernames */}
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.name + '-text'}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Nav Links ── */}
          {Object.entries(NAV_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="font-black text-white text-sm mb-4 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                {title}
              </p>
              <ul className="space-y-2.5">
                {links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm transition-all duration-150 hover:text-white hover:translate-x-[-3px] inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p>© {new Date().getFullYear()} بن صديق للأقمشة الفاخرة — جميع الحقوق محفوظة</p>
          <p className="text-white/25 text-[10px]">ينبع · جدة · المملكة العربية السعودية</p>
        </div>
      </div>
    </footer>
    </>
  );
}
