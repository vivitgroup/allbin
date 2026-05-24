'use client';

import { useState, useRef } from 'react';
import {
  Eye, EyeOff, Upload, Video, Image as ImageIcon,
  Palette, Type, Link as LinkIcon, Save, RefreshCw,
  ChevronUp, ChevronDown, Layers, Settings2, X,
  Monitor, Smartphone, Check
} from 'lucide-react';
import { useSiteStore, SectionContent, MediaType } from '@/stores/siteStore';

const SECTION_LABELS: Record<string, string> = {
  strip:    '📢 الشريط الإعلاني',
  hero:     '🖼️ القسم الرئيسي (Hero)',
  banner1:  '📌 البانر الجانبي 1',
  banner2:  '📌 البانر الجانبي 2',
  features: '⚡ قسم المميزات',
  cta:      '🎯 قسم الدعوة (CTA)',
};

const GRADIENT_PRESETS = [
  { label:'كحلي',     val:'linear-gradient(135deg, #1E2B45 0%, #2D4070 100%)' },
  { label:'برتقالي',  val:'linear-gradient(135deg, #F5A623 0%, #D4880A 100%)' },
  { label:'أخضر',     val:'linear-gradient(135deg, #1B6B45 0%, #0A3A20 100%)' },
  { label:'أحمر',     val:'linear-gradient(135deg, #8B0000 0%, #C41E2A 100%)' },
  { label:'بنفسجي',   val:'linear-gradient(135deg, #5C1A7A 0%, #3A0060 100%)' },
  { label:'داكن دافئ',val:'linear-gradient(135deg, #1E2B45 0%, #3D2800 50%, #D4880A 100%)' },
];

const FONT_PRESETS = [
  'Georgia, serif',
  "Segoe UI, Arial, sans-serif",
  "'Times New Roman', serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
];

export default function SiteEditorPage() {
  const { sections, settings, updateSection, toggleSection, reorderSection, updateSettings, lastUpdated } = useSiteStore();
  const [active, setActive]   = useState<string | null>(null);
  const [saved,  setSaved]    = useState(false);
  const [view,   setView]     = useState<'desktop'|'mobile'>('desktop');
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const editing = sections.find(s => s.id === active);

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>, type: MediaType) => {
    const file = e.target.files?.[0];
    if (!file || !active) return;
    const reader = new FileReader();
    reader.onload = ev => {
      updateSection(active, {
        media: { type, src: ev.target?.result as string }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const up   = (sec: SectionContent) => sec.order > 0 && reorderSection(sec.id, sec.order - 1);
  const down = (sec: SectionContent) => reorderSection(sec.id, sec.order + 1);

  return (
    <div className="flex h-full" style={{ background: 'var(--bs-pearl)', minHeight: '100vh' }}>

      {/* ── Left: Section List ── */}
      <div className="w-72 flex-shrink-0 bg-white border-r overflow-y-auto"
           style={{ borderColor: 'var(--bs-border)' }}>
        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b" style={{ borderColor: 'var(--bs-border)' }}>
          <h2 className="font-black text-base" style={{ color: 'var(--bs-navy)' }}>
            <Layers className="inline w-4 h-4 ml-1" style={{ color: 'var(--bs-primary)' }}/>
            أقسام الموقع
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--bs-silver)' }}>
            التعديلات تنعكس فوراً على الموقع
          </p>
        </div>

        <div className="p-3 space-y-2">
          {sorted.map(sec => (
            <div
              key={sec.id}
              className="rounded-xl border overflow-hidden cursor-pointer transition-all"
              style={{
                borderColor: active === sec.id ? 'var(--bs-primary)' : 'var(--bs-border)',
                background:  active === sec.id ? 'rgba(245,166,35,0.05)' : 'white',
                opacity:     sec.active ? 1 : 0.5,
              }}
              onClick={() => setActive(sec.id === active ? null : sec.id)}
            >
              {/* Preview thumbnail */}
              {sec.media.src ? (
                <div className="h-16 relative overflow-hidden">
                  {sec.media.type === 'video'
                    ? <video src={sec.media.src} className="w-full h-full object-cover" muted/>
                    : <img src={sec.media.src} alt="" className="w-full h-full object-cover"/>
                  }
                  <div className="absolute inset-0 bg-black/30"/>
                </div>
              ) : (
                <div className="h-10 flex items-center justify-center"
                     style={{ background: sec.bgGradient }}>
                  <span className="text-white text-xs font-bold opacity-80">
                    {sec.heading?.slice(0, 20) || '—'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate" style={{ color: 'var(--bs-navy)' }}>
                    {SECTION_LABELS[sec.sectionKey] || sec.sectionKey}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={e => { e.stopPropagation(); up(sec); }}
                    className="p-1 rounded hover:bg-black/5"><ChevronUp className="w-3 h-3 text-gray-400"/></button>
                  <button onClick={e => { e.stopPropagation(); down(sec); }}
                    className="p-1 rounded hover:bg-black/5"><ChevronDown className="w-3 h-3 text-gray-400"/></button>
                  <button onClick={e => { e.stopPropagation(); toggleSection(sec.id); }}
                    className="p-1 rounded hover:bg-black/5">
                    {sec.active
                      ? <Eye className="w-3.5 h-3.5 text-green-500"/>
                      : <EyeOff className="w-3.5 h-3.5 text-gray-400"/>
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Site Settings shortcut */}
          <button
            onClick={() => setActive('__settings__')}
            className="w-full rounded-xl border px-3 py-3 text-right flex items-center gap-2 transition-all hover:border-orange-300"
            style={{
              borderColor: active === '__settings__' ? 'var(--bs-primary)' : 'var(--bs-border)',
              background:  active === '__settings__' ? 'rgba(245,166,35,0.05)' : 'white',
            }}
          >
            <Settings2 className="w-4 h-4" style={{ color: 'var(--bs-primary)' }}/>
            <span className="text-xs font-black" style={{ color: 'var(--bs-navy)' }}>⚙️ إعدادات الموقع</span>
          </button>
        </div>
      </div>

      {/* ── Right: Editor Panel ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-6 py-3"
             style={{ borderColor: 'var(--bs-border)' }}>
          <h1 className="font-black text-lg" style={{ color: 'var(--bs-navy)' }}>
            محرر الموقع الكامل
          </h1>
          <div className="flex items-center gap-3">
            {/* Preview mode toggle */}
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--bs-border)' }}>
              <button onClick={() => setView('desktop')}
                className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ background: view === 'desktop' ? 'var(--bs-navy)' : 'white', color: view === 'desktop' ? 'white' : 'var(--bs-silver)' }}>
                <Monitor className="w-3.5 h-3.5"/> ديسكتوب
              </button>
              <button onClick={() => setView('mobile')}
                className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ background: view === 'mobile' ? 'var(--bs-navy)' : 'white', color: view === 'mobile' ? 'white' : 'var(--bs-silver)' }}>
                <Smartphone className="w-3.5 h-3.5"/> موبايل
              </button>
            </div>
            {saved && (
              <div className="flex items-center gap-1 text-xs font-bold text-green-600 animate-float-up">
                <Check className="w-4 h-4"/> محفوظ!
              </div>
            )}
            <button onClick={handleSave} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Save className="w-4 h-4"/> حفظ
            </button>
            <a href="/" target="_blank" className="btn-secondary text-sm py-2 px-3 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5"/> عرض الموقع
            </a>
          </div>
        </div>

        <div className="p-6">
          {/* No section selected */}
          {!active && (
            <div className="text-center py-20">
              <Layers className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--bs-primary)', opacity: 0.5 }}/>
              <p className="font-black text-lg" style={{ color: 'var(--bs-navy)' }}>اختر قسماً للتعديل</p>
              <p className="text-sm mt-1" style={{ color: 'var(--bs-silver)' }}>
                انقر على أي قسم من القائمة الجانبية لتعديل محتواه وصوره وفيديوهاته
              </p>
            </div>
          )}

          {/* Settings editor */}
          {active === '__settings__' && (
            <div className="max-w-2xl space-y-6 animate-float-up">
              <h2 className="font-black text-xl" style={{ color: 'var(--bs-navy)' }}>⚙️ إعدادات الموقع العامة</h2>

              <div className="card bg-white p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>اسم المتجر</label>
                    <input className="input" value={settings.storeName}
                      onChange={e => updateSettings({ storeName: e.target.value })}/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>الشعار الفرعي</label>
                    <input className="input" value={settings.storeTagline}
                      onChange={e => updateSettings({ storeTagline: e.target.value })}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>
                      <Palette className="inline w-4 h-4 ml-1"/>اللون الأساسي
                    </label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.primaryColor}
                        onChange={e => updateSettings({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border-0"/>
                      <input className="input flex-1" value={settings.primaryColor}
                        onChange={e => updateSettings({ primaryColor: e.target.value })}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>
                      اللون الثانوي (كحلي)
                    </label>
                    <div className="flex gap-2">
                      <input type="color" value={settings.navyColor}
                        onChange={e => updateSettings({ navyColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border-0"/>
                      <input className="input flex-1" value={settings.navyColor}
                        onChange={e => updateSettings({ navyColor: e.target.value })}/>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>
                      <Type className="inline w-4 h-4 ml-1"/>خط العناوين
                    </label>
                    <select className="input" value={settings.fontHeading}
                      onChange={e => updateSettings({ fontHeading: e.target.value })}>
                      {FONT_PRESETS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                    </select>
                    <p className="mt-1 text-sm" style={{ fontFamily: settings.fontHeading, color: 'var(--bs-navy)' }}>
                      مثال: Bin Siddiq Fabrics
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>خط النص</label>
                    <select className="input" value={settings.fontBody}
                      onChange={e => updateSettings({ fontBody: e.target.value })}>
                      {FONT_PRESETS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-navy)' }}>رقم واتساب</label>
                  <input className="input" placeholder="966500000000" value={settings.whatsappNumber}
                    onChange={e => updateSettings({ whatsappNumber: e.target.value })} dir="ltr"/>
                </div>

                <div className="space-y-3">
                  {([
                    ['showChatWidget',  'عرض المساعد الذكي (Chat)'],
                    ['showWhatsApp',    'عرض زر واتساب'],
                    ['showNewsletter',  'عرض اشتراك النشرة البريدية'],
                  ] as [keyof typeof settings, string][]).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" checked={settings[key] as boolean}
                          onChange={e => updateSettings({ [key]: e.target.checked })} className="sr-only"/>
                        <div className="w-11 h-6 rounded-full transition-all"
                             style={{ background: settings[key] ? 'var(--bs-primary)' : '#d1d5db' }}>
                          <div className="w-5 h-5 bg-white rounded-full shadow m-0.5 transition-all"
                               style={{ transform: settings[key] ? 'translateX(20px)' : 'translateX(0)' }}/>
                        </div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--bs-navy)' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section editor */}
          {editing && active !== '__settings__' && (
            <div className="max-w-2xl animate-float-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-xl" style={{ color: 'var(--bs-navy)' }}>
                  {SECTION_LABELS[editing.sectionKey] || editing.sectionKey}
                </h2>
                <button onClick={() => setActive(null)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-700"/>
                </button>
              </div>

              <div className="space-y-5">

                {/* ── MEDIA UPLOAD ── */}
                <div className="card bg-white p-5">
                  <h3 className="font-black text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--bs-navy)' }}>
                    <ImageIcon className="w-4 h-4" style={{ color: 'var(--bs-primary)' }}/>
                    الصورة أو الفيديو
                  </h3>

                  {/* Current media preview */}
                  {editing.media.src && (
                    <div className="relative mb-4 rounded-xl overflow-hidden" style={{ height: 160 }}>
                      {editing.media.type === 'video' ? (
                        <video src={editing.media.src} className="w-full h-full object-cover" autoPlay muted loop playsInline/>
                      ) : (
                        <img src={editing.media.src} alt="" className="w-full h-full object-cover"/>
                      )}
                      <button
                        onClick={() => updateSection(editing.id, { media: { type: 'gradient', src: '' } })}
                        className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-red-50">
                        <X className="w-4 h-4 text-red-500"/>
                      </button>
                      <div className="absolute bottom-2 right-2 text-xs font-bold px-2 py-1 rounded bg-black/60 text-white">
                        {editing.media.type === 'video' ? '🎥 فيديو' : '🖼️ صورة'}
                      </div>
                    </div>
                  )}

                  {/* Upload buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-orange-400"
                           style={{ borderColor: 'rgba(245,166,35,0.4)' }}>
                      <ImageIcon className="w-6 h-6" style={{ color: 'var(--bs-primary)' }}/>
                      <span className="text-xs font-bold" style={{ color: 'var(--bs-navy)' }}>رفع صورة</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP</span>
                      <input type="file" accept="image/*" className="sr-only"
                        onChange={e => handleMedia(e, 'image')}/>
                    </label>
                    <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-blue-400"
                           style={{ borderColor: 'rgba(30,43,69,0.3)' }}>
                      <Video className="w-6 h-6" style={{ color: 'var(--bs-navy)' }}/>
                      <span className="text-xs font-bold" style={{ color: 'var(--bs-navy)' }}>رفع فيديو</span>
                      <span className="text-[10px] text-gray-400">MP4, WebM (Max 50MB)</span>
                      <input type="file" accept="video/*" className="sr-only"
                        onChange={e => handleMedia(e, 'video')}/>
                    </label>
                  </div>
                </div>

                {/* ── TEXT CONTENT ── */}
                <div className="card bg-white p-5 space-y-4">
                  <h3 className="font-black text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--bs-navy)' }}>
                    <Type className="w-4 h-4" style={{ color: 'var(--bs-primary)' }}/>
                    النصوص
                  </h3>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--bs-silver)' }}>العنوان الرئيسي</label>
                    <textarea
                      className="input resize-none min-h-[60px]"
                      value={editing.heading}
                      onChange={e => updateSection(editing.id, { heading: e.target.value })}
                      placeholder="العنوان الرئيسي للقسم..."
                    />
                    <p className="text-[10px] mt-1 text-gray-400">استخدم \n للسطر الجديد</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--bs-silver)' }}>العنوان الفرعي</label>
                    <textarea
                      className="input resize-none min-h-[50px]"
                      value={editing.subheading}
                      onChange={e => updateSection(editing.id, { subheading: e.target.value })}
                      placeholder="نص توضيحي..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--bs-silver)' }}>نص الزر</label>
                      <input className="input" value={editing.ctaText}
                        onChange={e => updateSection(editing.id, { ctaText: e.target.value })} placeholder="تسوق الآن"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 flex items-center gap-1" style={{ color: 'var(--bs-silver)' }}>
                        <LinkIcon className="w-3 h-3"/> رابط الزر
                      </label>
                      <input className="input" value={editing.ctaLink} dir="ltr"
                        onChange={e => updateSection(editing.id, { ctaLink: e.target.value })} placeholder="/products"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--bs-silver)' }}>الشارة (Badge)</label>
                    <input className="input" value={editing.badge}
                      onChange={e => updateSection(editing.id, { badge: e.target.value })} placeholder="🔥 جديد"/>
                  </div>
                </div>

                {/* ── DESIGN ── */}
                <div className="card bg-white p-5 space-y-4">
                  <h3 className="font-black text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--bs-navy)' }}>
                    <Palette className="w-4 h-4" style={{ color: 'var(--bs-primary)' }}/>
                    التصميم
                  </h3>

                  {/* Background gradient (only when no image) */}
                  {!editing.media.src && (
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: 'var(--bs-silver)' }}>لون الخلفية</label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {GRADIENT_PRESETS.map(g => (
                          <button key={g.label} onClick={() => updateSection(editing.id, { bgGradient: g.val })}
                            className="w-9 h-9 rounded-lg border-2 transition-all hover:scale-110"
                            style={{
                              background: g.val,
                              borderColor: editing.bgGradient === g.val ? 'var(--bs-navy)' : 'transparent',
                            }} title={g.label}/>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text color */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--bs-silver)' }}>لون النص</label>
                    <div className="flex gap-2">
                      <input type="color" value={editing.textColor === 'var(--bs-navy)' ? '#1E2B45' : editing.textColor}
                        onChange={e => updateSection(editing.id, { textColor: e.target.value })}
                        className="w-10 h-10 rounded border-0 cursor-pointer"/>
                      {['#ffffff','#1E2B45','#F5A623','#0F1620'].map(c => (
                        <button key={c} onClick={() => updateSection(editing.id, { textColor: c })}
                          className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                          style={{ background: c, borderColor: editing.textColor === c ? 'var(--bs-primary)' : '#e5e7eb' }}/>
                      ))}
                    </div>
                  </div>

                  {/* Text alignment */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--bs-silver)' }}>محاذاة النص</label>
                    <div className="flex gap-2">
                      {(['right','center','left'] as const).map(a => (
                        <button key={a} onClick={() => updateSection(editing.id, { textAlign: a })}
                          className="flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all"
                          style={{
                            borderColor: editing.textAlign === a ? 'var(--bs-primary)' : 'var(--bs-border)',
                            background:  editing.textAlign === a ? 'rgba(245,166,35,0.08)' : 'white',
                            color:       editing.textAlign === a ? 'var(--bs-navy)' : 'var(--bs-silver)',
                          }}>
                          {a === 'right' ? 'يمين ←' : a === 'center' ? '| وسط' : '→ يسار'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── VISIBILITY ── */}
                <div className="card bg-white p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" checked={editing.active}
                        onChange={() => toggleSection(editing.id)} className="sr-only"/>
                      <div className="w-11 h-6 rounded-full transition-all"
                           style={{ background: editing.active ? 'var(--bs-primary)' : '#d1d5db' }}>
                        <div className="w-5 h-5 bg-white rounded-full shadow m-0.5 transition-all"
                             style={{ transform: editing.active ? 'translateX(20px)' : 'translateX(0)' }}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-black" style={{ color: 'var(--bs-navy)' }}>
                        {editing.active ? '✅ القسم مرئي في الموقع' : '❌ القسم مخفي'}
                      </p>
                      <p className="text-xs text-gray-400">يظهر على الديسكتوب والموبايل</p>
                    </div>
                  </label>
                </div>

                <button onClick={handleSave} className="btn-primary w-full py-4 font-black text-base justify-center flex gap-2">
                  <Save className="w-5 h-5"/> حفظ التعديلات على {SECTION_LABELS[editing.sectionKey]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
