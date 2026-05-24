'use client';
import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Save, Upload, X, GripVertical, Image as ImageIcon, Layout } from 'lucide-react';
import { useBannersStore, Banner } from '@/stores/bannersStore';
import Image from 'next/image';

const POSITIONS = [
  { id:'hero',  label:'البانر الرئيسي (Hero)',        desc:'أكبر بانر — صورة كاملة الشاشة' },
  { id:'sub1',  label:'بانر جانبي 1',                desc:'نصف الشاشة — يسار' },
  { id:'sub2',  label:'بانر جانبي 2',                desc:'نصف الشاشة — يمين' },
  { id:'sub3',  label:'بانر صغير 3',                 desc:'ثلث الشاشة' },
  { id:'strip', label:'شريط إعلاني (Strip)',           desc:'شريط رفيع في أعلى الصفحة' },
];

const BG_PRESETS = [
  { label:'كحلي', bg:'linear-gradient(135deg, #1E2B45 0%, #2D4070 100%)' },
  { label:'برتقالي', bg:'linear-gradient(135deg, #F5A623 0%, #D4880A 100%)' },
  { label:'أخضر', bg:'linear-gradient(135deg, #1B6B45 0%, #0A3A20 100%)' },
  { label:'أحمر', bg:'linear-gradient(135deg, #8B0000 0%, #E31837 100%)' },
  { label:'بنفسجي', bg:'linear-gradient(135deg, #5C1A7A 0%, #3A0060 100%)' },
  { label:'رمادي فاخر', bg:'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)' },
];

const EMPTY: Omit<Banner,'id'> = {
  position:'hero', title:'', sub:'', cta:'تسوق الآن', href:'/products',
  bg:BG_PRESETS[0].bg, badge:'', image:'', active:true, textColor:'white',
};

export default function BannersAdminPage() {
  const { banners, updateBanner, addBanner, deleteBanner } = useBannersStore();
  const [editing, setEditing]   = useState<Banner | null>(null);
  const [isNew,   setIsNew]     = useState(false);
  const [saved,   setSaved]     = useState(false);
  const [preview, setPreview]   = useState<string | null>(null);

  const openNew = () => { setEditing({ id:'', ...EMPTY } as Banner); setIsNew(true); };
  const openEdit = (b: Banner) => { setEditing({ ...b }); setIsNew(false); };

  const handleSave = () => {
    if (!editing) return;
    if (isNew) addBanner(editing);
    else       updateBanner(editing.id, editing);
    setSaved(true);
    setEditing(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setEditing(prev => prev ? { ...prev, image: base64 } : prev);
    };
    reader.readAsDataURL(file);
  };

  const byPosition = (pos: string) => banners.filter(b => b.position === pos);

  return (
    <div className="p-5 sm:p-8" style={{ background:'var(--bs-pearl)', minHeight:'100%' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-black text-2xl sm:text-3xl mb-1" style={{ color:'var(--bs-navy)' }}>إدارة البانرات</h1>
          <p className="text-sm" style={{ color:'var(--bs-silver)' }}>التعديلات تظهر فوراً في الموقع بدون Refresh</p>
        </div>
        <div className="flex gap-3">
          {saved && (
            <div className="animate-float-up flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-sm">
              ✓ تم الحفظ
            </div>
          )}
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4"/> بانر جديد
          </button>
        </div>
      </div>

      {/* Layout preview card */}
      <div className="card bg-white p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5" style={{ color:'var(--bs-primary)' }}/>
          <h2 className="font-black text-base" style={{ color:'var(--bs-navy)' }}>تخطيط الصفحة الرئيسية</h2>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          {/* Hero */}
          <div className="h-16 rounded-lg flex items-center justify-center text-xs font-bold text-white"
               style={{ background:'var(--bs-grad-navy)' }}>
            🖼️ Hero Banner — {byPosition('hero').filter(b=>b.active).length} نشط
          </div>
          {/* Strip */}
          <div className="h-8 rounded flex items-center justify-center text-xs font-bold text-white"
               style={{ background:'var(--bs-grad)' }}>
            📢 Strip — {byPosition('strip').filter(b=>b.active).length} نشط
          </div>
          {/* Sub banners */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-emerald-600">
              Sub1 — {byPosition('sub1').filter(b=>b.active).length} نشط
            </div>
            <div className="h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-purple-600">
              Sub2 — {byPosition('sub2').filter(b=>b.active).length} نشط
            </div>
          </div>
        </div>
      </div>

      {/* Banner groups by position */}
      {POSITIONS.map(pos => {
        const posBanners = byPosition(pos.id);
        if (posBanners.length === 0 && pos.id !== 'hero') return null;
        return (
          <div key={pos.id} className="card bg-white mb-5">
            <div className="px-6 py-4 border-b flex items-center justify-between"
                 style={{ borderColor:'rgba(0,0,0,0.05)' }}>
              <div>
                <p className="font-black text-base" style={{ color:'var(--bs-navy)' }}>{pos.label}</p>
                <p className="text-xs" style={{ color:'var(--bs-silver)' }}>{pos.desc}</p>
              </div>
              <span className="badge badge-orange">{posBanners.length} بانر</span>
            </div>
            <div className="divide-y" style={{ borderColor:'rgba(0,0,0,0.04)' }}>
              {posBanners.map(b => (
                <div key={b.id} className="flex items-center gap-4 px-6 py-4">
                  {/* Color preview */}
                  <div className="w-16 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                       style={{ background: b.image ? 'transparent' : b.bg }}>
                    {b.image
                      ? <img src={b.image} alt="" className="w-full h-full object-cover rounded-lg"/>
                      : b.badge || '🖼️'
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color:'var(--bs-navy)' }}>{b.title || '—'}</p>
                    <p className="text-xs truncate" style={{ color:'var(--bs-silver)' }}>{b.sub || 'بدون عنوان فرعي'}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateBanner(b.id, { active: !b.active })}
                      className="p-2 rounded-lg transition-colors hover:bg-black/5"
                    >
                      {b.active
                        ? <Eye className="w-4 h-4 text-green-600"/>
                        : <EyeOff className="w-4 h-4" style={{ color:'var(--bs-silver)' }}/>
                      }
                    </button>
                    <button onClick={() => openEdit(b)}
                      className="p-2 rounded-lg text-sm font-bold transition-colors hover:bg-black/5"
                      style={{ color:'var(--bs-primary)' }}>
                      تعديل
                    </button>
                    <button onClick={() => deleteBanner(b.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-400"/>
                    </button>
                  </div>
                </div>
              ))}
              {posBanners.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm" style={{ color:'var(--bs-silver)' }}>لا يوجد بانرات لهذا الموقع</p>
                  <button onClick={openNew} className="mt-2 text-sm font-bold" style={{ color:'var(--bs-primary)' }}>
                    + أضف بانر
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background:'rgba(15,22,32,0.7)', backdropFilter:'blur(4px)' }}>
          <div className="card bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-float-up">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10"
                 style={{ borderColor:'rgba(0,0,0,0.06)' }}>
              <h3 className="font-black text-lg" style={{ color:'var(--bs-navy)' }}>
                {isNew ? 'بانر جديد' : 'تعديل البانر'}
              </h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-black/5">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Position */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>موضع البانر *</label>
                <select className="input"
                  value={editing.position}
                  onChange={e => setEditing({...editing, position: e.target.value as Banner['position']})}>
                  {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>صورة البانر (اختياري)</label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center transition-colors hover:border-orange-300"
                     style={{ borderColor:'rgba(245,166,35,0.4)', background:'rgba(245,166,35,0.04)' }}>
                  {editing.image ? (
                    <div className="relative">
                      <img src={editing.image} alt="" className="w-full h-32 object-cover rounded-lg mb-2"/>
                      <button onClick={() => setEditing({...editing, image:''})}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                        <X className="w-3 h-3 text-red-500"/>
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color:'var(--bs-primary)' }}/>
                      <p className="text-sm" style={{ color:'var(--bs-silver)' }}>اسحب صورة أو انقر للرفع</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" style={{ position: editing.image ? 'static' : 'absolute' }}/>
                  <label className="mt-2 btn-outline text-xs py-2 px-4 cursor-pointer inline-flex items-center gap-1">
                    <Upload className="w-3 h-3"/> {editing.image ? 'تغيير الصورة' : 'رفع صورة'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only"/>
                  </label>
                </div>
              </div>

              {/* Text fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>العنوان الرئيسي</label>
                  <input className="input" placeholder="مثال: مجموعة الصيف 2025"
                    value={editing.title} onChange={e => setEditing({...editing, title:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>الشارة (Badge)</label>
                  <input className="input" placeholder="مثال: 🔥 جديد"
                    value={editing.badge} onChange={e => setEditing({...editing, badge:e.target.value})}/>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>العنوان الفرعي</label>
                  <input className="input" placeholder="نص توضيحي..."
                    value={editing.sub} onChange={e => setEditing({...editing, sub:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>نص الزر (CTA)</label>
                  <input className="input" placeholder="تسوق الآن"
                    value={editing.cta} onChange={e => setEditing({...editing, cta:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>الرابط</label>
                  <input className="input" placeholder="/products"
                    value={editing.href} onChange={e => setEditing({...editing, href:e.target.value})}/>
                </div>
              </div>

              {/* Background */}
              {!editing.image && (
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>لون الخلفية</label>
                  <div className="flex gap-2 flex-wrap">
                    {BG_PRESETS.map(p => (
                      <button key={p.label} onClick={() => setEditing({...editing, bg:p.bg})}
                        className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                        style={{
                          background: p.bg,
                          borderColor: editing.bg===p.bg ? '#000' : 'transparent',
                        }} title={p.label}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={editing.active}
                    onChange={e => setEditing({...editing, active:e.target.checked})} className="sr-only"/>
                  <div className="w-12 h-6 rounded-full transition-all duration-300"
                       style={{ background:editing.active?'var(--bs-primary)':'#d1d5db' }}>
                    <div className="w-5 h-5 bg-white rounded-full shadow m-0.5 transition-all duration-300"
                         style={{ transform:editing.active?'translateX(24px)':'translateX(0)' }}/>
                  </div>
                </div>
                <span className="font-semibold text-sm" style={{ color:'var(--bs-navy)' }}>
                  {editing.active ? 'نشط — يظهر في الموقع' : 'مخفي — لا يظهر في الموقع'}
                </span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex gap-3 justify-end"
                 style={{ borderColor:'rgba(0,0,0,0.06)' }}>
              <button onClick={() => setEditing(null)} className="btn-secondary">إلغاء</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4"/> {isNew ? 'إضافة البانر' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
