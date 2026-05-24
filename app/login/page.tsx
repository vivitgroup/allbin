'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 700));
    if (email === 'admin@binsiddiq.com' && password === 'admin123') {
      router.push('/dashboard');
    } else if (email && password.length >= 6) {
      router.push('/');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, var(--bs-dark) 0%, #3D0E0E 40%, #8B1A1A 100%)' }}>
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 12px)', backgroundSize: '12px 12px' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-15"
             style={{ background: 'radial-gradient(circle, #D41E2F, transparent)', filter: 'blur(60px)' }} />
        <div className="relative text-center text-white">
          <div className="text-6xl mb-8 animate-scissors inline-block">✂️</div>
          <h2 className="font-playfair font-black text-4xl mb-4 leading-tight">
            Bin Siddiq<br/>
            <span style={{ color: '#D4AF37', fontWeight: 400, fontSize: '1.5rem', letterSpacing: '0.2em' }}>FABRIC</span>
          </h2>
          <p className="text-white/60 max-w-sm text-base leading-relaxed">
            أفضل الأقمشة الفاخرة في المملكة العربية السعودية
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-[420px] flex flex-col items-center justify-center p-6 sm:p-8"
           style={{ background: 'var(--bs-pearl)' }}>
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-xl ring-2 p-1.5 mb-3 hover:scale-105 transition-transform"
                 style={{ boxShadow: '0 8px 32px rgba(139,26,26,0.2)' }}>
              <Image src="/logo.jpg" alt="Bin Siddiq Fabric" className="w-full h-full object-contain" width={48} height={48} priority />
            </div>
            <p className="font-black text-xl" style={{ color: 'var(--bs-deep)' }}>Bin Siddiq Fabric</p>
          </Link>

          <div className="card p-7 sm:p-8">
            <h1 className="font-black text-2xl mb-1.5" style={{ color: 'var(--bs-deep)' }}>مرحباً بك</h1>
            <p className="text-sm mb-7" style={{ color: 'var(--bs-silver)' }}>سجلي دخولك للمتابعة</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-deep)' }}>البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bs-silver)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="input pr-10" placeholder="example@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--bs-deep)' }}>كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bs-silver)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="input pr-10 pl-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                    style={{ color: 'var(--bs-silver)' }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl text-sm font-medium"
                     style={{ background: 'rgba(212,30,47,0.08)', color: 'var(--bs-deep)', border: '1px solid rgba(212,30,47,0.2)' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base justify-center mt-2">
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري الدخول...</span>
                  : 'تسجيل الدخول'}
              </button>
            </form>

            <div className="mt-5 p-4 rounded-xl text-center" style={{ background: 'var(--bs-pearl)' }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--bs-deep)' }}>بيانات الدخول للتجربة:</p>
              <code className="text-xs block px-3 py-2 rounded-lg bg-white shadow-sm font-mono" style={{ color: 'var(--bs-dark)' }}>
                admin@binsiddiq.com · admin123
              </code>
            </div>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--bs-silver)' }}>
              ليس لديك حساب؟{' '}
              <Link href="/register" className="font-bold hover:opacity-70 transition-opacity" style={{ color: 'var(--bs-vivid)' }}>
                إنشاء حساب
              </Link>
            </p>
          </div>

          <Link href="/" className="block text-center mt-5 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--bs-deep)' }}>
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
