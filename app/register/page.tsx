'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('كلمتا المرور غير متطابقتان'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-pearl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-xl p-1.5 mx-auto hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="بن صديق للأقمشة" width={80} height={80} className="w-full h-full object-contain" priority />
            </div>
          </Link>
          <h1 className="font-black text-2xl" style={{ color: 'var(--bs-deep)' }}>إنشاء حساب جديد</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--bs-silver)' }}>انضمي لآلاف العميلات السعيدات</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" placeholder="الاسم الكامل *" value={form.name}     onChange={(e) => setForm({...form, name: e.target.value})}     required />
            <input className="input" type="email" placeholder="البريد الإلكتروني *"    value={form.email}    onChange={(e) => setForm({...form, email: e.target.value})}    required />
            <input className="input" type="password" placeholder="كلمة المرور *"         value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
            <input className="input" type="password" placeholder="تأكيد كلمة المرور *"   value={form.confirm}  onChange={(e) => setForm({...form, confirm: e.target.value})}  required />
            {error && <p className="text-sm p-3 rounded-xl" style={{ background: 'rgba(212,30,47,0.08)', color: 'var(--bs-deep)' }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base justify-center">
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>
          <p className="text-center text-sm mt-5" style={{ color: 'var(--bs-silver)' }}>
            لديك حساب؟{' '}
            <Link href="/login" className="font-bold hover:opacity-70 transition-opacity" style={{ color: 'var(--bs-vivid)' }}>تسجيل الدخول</Link>
          </p>
        </div>

        <Link href="/" className="block text-center mt-5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--bs-deep)' }}>
          ← العودة للمتجر
        </Link>
      </div>
    </div>
  );
}
