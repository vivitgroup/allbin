'use client';

import { useState } from 'react';

export default function NewsletterStrip() {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState<'idle'|'loading'|'done'|'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 800)); // Replace with Resend API call
    setStatus('done');
    setEmail('');
  };

  return (
    <section className="py-12 px-4" style={{ background: 'white', borderTop: '1px solid rgba(184,184,184,0.15)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--bs-vivid)' }}>
          ابقي على اطلاع
        </p>
        <h3 className="font-black text-xl mb-2" style={{ color: 'var(--bs-deep)' }}>
          اشتركي في نشرتنا الإلكترونية
        </h3>
        <p className="text-sm mb-5" style={{ color: '#7a6e68' }}>
          عروض حصرية وأحدث الأقمشة مباشرة إلى بريدك الإلكتروني
        </p>

        {status === 'done' ? (
          <div className="p-4 rounded-xl text-green-700 font-bold text-sm" style={{ background: '#dcfce7' }}>
            ✓ تم الاشتراك بنجاح! شكراً لك 🌹
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              required
              className="input flex-1"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary px-5 py-3 text-sm font-bold flex-shrink-0"
            >
              {status === 'loading' ? '...' : 'اشتراك'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
