'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { CheckCircle, CreditCard, Truck, Shield, Lock, ChevronLeft, Phone, MessageSquare } from 'lucide-react';
import { trackInitiateCheckout, trackPurchase } from '@/components/pixels/PixelScripts';

const STEPS = [
  { n:1, label:'تسجيل الدخول',  icon:Phone    },
  { n:2, label:'بيانات الشحن',  icon:Truck    },
  { n:3, label:'طريقة الدفع',   icon:CreditCard},
  { n:4, label:'التأكيد',        icon:CheckCircle },
];

const PAYMENT_METHODS = [
  { id:'mada',  label:'مدى',                  sub:'مباشرة من حسابك البنكي', note:'جميع بنوك المملكة', color:'#00a651' },
  { id:'visa',  label:'فيزا / ماستر',          sub:'Visa · Mastercard',      note:'SSL 256-bit', color:'#1a1f71' },
  { id:'apple', label:'Apple Pay',             sub:'سريع وآمن',              note:'جهاز Apple', color:'#000' },
  { id:'stc',   label:'STC Pay',               sub:'محفظة STC',              note:'مدفوعات فورية', color:'#7b2d8b' },
  { id:'cod',   label:'الدفع عند الاستلام',    sub:'نقداً عند الوصول',       note:'متاح في ينبع', color:'#16a34a' },
];

const CITIES = ['ينبع','جدة','مكة المكرمة','المدينة المنورة','الرياض','الدمام','الخبر','تبوك','أبها','القصيم','حائل'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [step,    setStep]    = useState(1);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Step 1: Phone OTP
  const [phone,    setPhone]    = useState('');
  const [otp,      setOtp]      = useState(['','','','','','']);
  const [otpSent,  setOtpSent]  = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);

  // Step 2: Shipping
  const [form, setForm] = useState({ name:'', email:'', address:'', city:'', notes:'' });

  // Step 3: Payment
  const [payment, setPayment] = useState('mada');

  const subtotal = total();
  const shipping  = subtotal >= 200 ? 0 : 25;
  const grand     = subtotal + shipping;

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  const sendOtp = async () => {
    if (!/^05\d{8}$/.test(phone) && !/^966\d{9}$/.test(phone)) {
      setOtpError('أدخل رقم جوال سعودي صحيح (05XXXXXXXX)');
      return;
    }
    setOtpError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    setOtpSent(true);
    setOtpTimer(60);
    setLoading(false);
    // In production: send real OTP via SMS + WhatsApp
    console.warn('OTP sent to:', phone, '— Dev OTP: 123456');
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if (code === '123456' || code.length === 6) { // In production: verify with backend
      setStep(2);
    } else {
      setOtpError('الرمز غير صحيح، حاول مرة أخرى');
    }
  };

  const handleOtpInput = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx+1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx-1]?.focus();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setStep(4);
    try {
      const res  = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id:i.product.id, product_name:i.product.name, price_per_meter:i.product.price_per_meter, meters:i.meters })),
          shipping_address: { full_name:form.name, phone, address:form.address, city:form.city, email:form.email, notes:form.notes },
          payment_method: payment,
          total_amount: grand,
        }),
      });
      const data = await res.json();
      setOrderId(data.order?.id || `ORD-${Date.now().toString().slice(-6)}`);
      trackPurchase(grand, 'SAR', items.map(i => ({ item_name:i.product.name })));
      await new Promise(r => setTimeout(r, 1500));
      clearCart();
      setDone(true);
    } catch { setStep(3); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar/>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="card max-w-sm w-full p-10 text-center animate-float-up">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-spin-in"
               style={{ background:'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            <CheckCircle className="w-10 h-10 text-white"/>
          </div>
          <Image src="/logo.jpg" alt="" width={64} height={64} className="mx-auto mb-4 rounded-xl object-contain bg-white/10 p-1"/>
          <h1 className="font-black text-2xl mb-2" style={{ color:'var(--bs-navy)' }}>تم تأكيد طلبك! 🎉</h1>
          <p className="text-gray-400 mb-3 text-sm">ستصلك رسالة تأكيد على رقم {phone}</p>
          <div className="p-3 rounded-xl mb-6" style={{ background:'rgba(245,166,35,0.08)' }}>
            <p className="text-xs text-gray-400">رقم الطلب</p>
            <p className="font-mono font-black text-xl" style={{ color:'var(--bs-primary)' }}>{orderId}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="btn-primary flex-1 justify-center text-sm">مواصلة التسوق</Link>
            <Link href="/orders" className="btn-secondary flex-1 justify-center text-sm">طلباتي</Link>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar/>
      <main className="flex-1 page-container max-w-5xl">
        {/* Back */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/cart" className="flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color:'var(--bs-silver)' }}>
            <ChevronLeft className="w-3.5 h-3.5"/> السلة
          </Link>
          <span style={{ color:'var(--bs-silver)' }}>/</span>
          <span className="font-semibold" style={{ color:'var(--bs-navy)' }}>إتمام الشراء</span>
        </div>

        <h1 className="font-black text-2xl sm:text-3xl mb-8" style={{ color:'var(--bs-navy)' }}>إتمام الشراء</h1>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300"
                     style={{
                       background: step > s.n ? '#16a34a' : step === s.n ? 'var(--bs-grad)' : 'rgba(155,165,180,0.2)',
                       color:      step >= s.n ? 'white' : 'var(--bs-silver)',
                       boxShadow:  step === s.n ? '0 4px 12px rgba(245,166,35,0.35)' : 'none',
                     }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className="text-xs font-semibold hidden sm:block"
                      style={{ color: step >= s.n ? 'var(--bs-navy)' : 'var(--bs-silver)' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 rounded-full transition-all duration-500"
                     style={{ background: step > s.n ? '#16a34a' : 'rgba(155,165,180,0.3)' }}/>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">

            {/* ── STEP 1: Phone OTP ── */}
            {step === 1 && (
              <div className="card p-6 sm:p-8 animate-float-up bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="w-5 h-5" style={{ color:'var(--bs-primary)' }}/>
                  <h2 className="font-black text-xl" style={{ color:'var(--bs-navy)' }}>تسجيل الدخول برقم الجوال</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6">سيتم إرسال رمز تحقق عبر SMS والواتساب</p>

                {!otpSent ? (
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>رقم الجوال *</label>
                    <div className="flex gap-3 mb-4">
                      <div className="flex items-center px-3 rounded-xl border font-bold text-sm"
                           style={{ borderColor:'var(--bs-border)', background:'var(--bs-pearl)', color:'var(--bs-navy)' }}>
                        🇸🇦 +966
                      </div>
                      <input
                        type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                        placeholder="05XXXXXXXX" className="input flex-1"
                        maxLength={10} dir="ltr"
                      />
                    </div>
                    {otpError && <p className="text-red-500 text-sm mb-3">{otpError}</p>}
                    <button onClick={sendOtp} disabled={loading||!phone}
                      className="btn-primary w-full py-4 text-base font-black justify-center flex gap-2">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>جاري الإرسال...</>
                        : <><MessageSquare className="w-5 h-5"/>إرسال رمز التحقق</>
                      }
                    </button>
                    <p className="text-xs text-center mt-3 text-gray-400">
                      سيصلك رمز عبر SMS وواتساب على نفس الرقم
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      تم إرسال رمز التحقق إلى <strong>{phone}</strong> عبر SMS والواتساب
                    </p>
                    <div className="flex gap-2 justify-center mb-4" dir="ltr">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="tel" maxLength={1} value={d}
                          onChange={e => handleOtpInput(e.target.value, i)}
                          className="w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all"
                          style={{
                            borderColor: d ? 'var(--bs-primary)' : 'var(--bs-border)',
                            background:  d ? 'rgba(245,166,35,0.06)' : 'white',
                            color: 'var(--bs-navy)',
                          }}
                        />
                      ))}
                    </div>
                    {otpError && <p className="text-red-500 text-sm text-center mb-3">{otpError}</p>}
                    <button onClick={verifyOtp}
                      className="btn-primary w-full py-4 font-black text-base justify-center mb-3">
                      تحقق وتابع →
                    </button>
                    <p className="text-xs text-center text-gray-400">
                      لم يصلك الرمز؟{' '}
                      {otpTimer > 0
                        ? <span>أعد الإرسال بعد {otpTimer} ثانية</span>
                        : <button onClick={sendOtp} className="font-bold underline" style={{ color:'var(--bs-primary)' }}>أعد الإرسال</button>
                      }
                    </p>
                    <p className="text-xs text-center text-gray-300 mt-1">
                      رمز تجريبي: 123456
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Shipping ── */}
            {step === 2 && (
              <div className="card p-6 sm:p-8 animate-float-up bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5" style={{ color:'var(--bs-primary)' }}/>
                  <h2 className="font-black text-xl" style={{ color:'var(--bs-navy)' }}>بيانات الشحن</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>الاسم الكامل *</label>
                    <input className="input" placeholder="مثال: نورة أحمد الشمري"
                      value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>المدينة *</label>
                    <select className="input" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}>
                      <option value="">اختاري المدينة</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>البريد الإلكتروني</label>
                    <input className="input" type="email" placeholder="example@email.com"
                      value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>العنوان التفصيلي *</label>
                    <input className="input" placeholder="الحي، اسم الشارع، رقم المبنى..."
                      value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-navy)' }}>ملاحظات (اختياري)</label>
                    <textarea className="input min-h-[80px] resize-none" placeholder="أي تعليمات إضافية للتوصيل..."
                      value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-secondary px-6 py-4">← رجوع</button>
                  <button onClick={() => { trackInitiateCheckout(grand, items.length); setStep(3); }}
                    disabled={!form.name || !form.city || !form.address}
                    className="btn-primary flex-1 py-4 text-base font-black justify-center">
                    التالي: طريقة الدفع ←
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && (
              <div className="card p-6 sm:p-8 animate-float-up bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-5 h-5" style={{ color:'var(--bs-primary)' }}/>
                  <h2 className="font-black text-xl" style={{ color:'var(--bs-navy)' }}>طريقة الدفع الآمنة</h2>
                </div>
                <div className="space-y-3 mb-5">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: payment===m.id ? 'var(--bs-primary)' : 'var(--bs-border)',
                        background:  payment===m.id ? 'rgba(245,166,35,0.04)' : 'white',
                      }}>
                      <input type="radio" name="pay" value={m.id} checked={payment===m.id}
                        onChange={e=>setPayment(e.target.value)} className="sr-only"/>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-white text-xs"
                           style={{ background:m.color }}>{m.id==='mada'?'mada':m.id==='cod'?'💵':m.id==='apple'?'🍎':m.id==='stc'?'STC':'💳'}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm" style={{ color:'var(--bs-navy)' }}>{m.label}</p>
                        <p className="text-xs text-gray-400">{m.sub} · <span className="text-green-600">{m.note}</span></p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                           style={{ borderColor: payment===m.id ? 'var(--bs-primary)' : 'var(--bs-silver)' }}>
                        {payment===m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background:'var(--bs-primary)' }}/>}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl mb-5"
                     style={{ background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.2)' }}>
                  <Shield className="w-4 h-4 flex-shrink-0" style={{ color:'var(--bs-primary)' }}/>
                  <div>
                    <p className="text-xs font-bold" style={{ color:'var(--bs-navy)' }}>مدفوعاتك محمية بالكامل</p>
                    <p className="text-[10px] text-gray-400">SSL 256-bit · PCI DSS · Moyasar + Geidea</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary px-6 py-4">← رجوع</button>
                  <button onClick={handleConfirm} disabled={loading}
                    className="btn-primary flex-1 py-4 text-base font-black justify-center">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>جاري المعالجة...</>
                      : `تأكيد وادفع ${grand.toFixed(0)} ر.س`
                    }
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Processing ── */}
            {step === 4 && (
              <div className="card p-12 text-center animate-float-up bg-white">
                <div className="w-16 h-16 mx-auto mb-5">
                  <div className="w-full h-full rounded-full border-4 animate-spin"
                       style={{ borderColor:'rgba(245,166,35,0.2)', borderTopColor:'var(--bs-primary)' }}/>
                </div>
                <p className="font-black text-lg" style={{ color:'var(--bs-navy)' }}>جاري معالجة طلبك...</p>
                <p className="text-sm text-gray-400 mt-2">لا تغلق الصفحة</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card p-5 h-fit sticky top-24 bg-white">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.jpg" alt="" width={32} height={32} className="rounded-lg object-contain bg-white/10 p-0.5 w-8 h-8"/>
              <h3 className="font-black text-base" style={{ color:'var(--bs-navy)' }}>ملخص الطلب</h3>
            </div>
            <div className="space-y-2.5 mb-4">
              {items.map(i => (
                <div key={i.product.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0"
                       style={{ background:`linear-gradient(135deg, ${i.selected_color?.hex||'#F5A623'}, #D4880A)` }}/>
                  <span className="text-xs flex-1 truncate text-gray-500">{i.product.name} ({i.meters}م)</span>
                  <span className="text-xs font-bold flex-shrink-0 text-gray-700">{(i.product.price_per_meter*i.meters).toFixed(0)} ر.س</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1.5 text-sm" style={{ borderColor:'var(--bs-border)' }}>
              <div className="flex justify-between text-gray-400"><span>المجموع</span><span>{subtotal.toFixed(0)} ر.س</span></div>
              <div className="flex justify-between text-gray-400">
                <span>الشحن</span>
                <span className={shipping===0?'text-green-600 font-bold':''}>{shipping===0?'مجاني 🎉':`${shipping} ر.س`}</span>
              </div>
            </div>
            <div className="flex justify-between font-black text-lg mt-3 pt-3 border-t"
                 style={{ borderColor:'var(--bs-border)', color:'var(--bs-navy)' }}>
              <span>الإجمالي</span>
              <span style={{ color:'var(--bs-primary)' }}>{grand.toFixed(0)} ر.س</span>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
