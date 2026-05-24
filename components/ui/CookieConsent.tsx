'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bs-cookie-consent');
    if (!consent) setTimeout(() => setShow(true), 2000);
  }, []);

  const accept = () => {
    localStorage.setItem('bs-cookie-consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('bs-cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-4 inset-x-4 lg:inset-x-auto lg:right-4 lg:max-w-sm z-[60] animate-float-up"
    >
      <div className="card p-4 shadow-2xl" style={{ borderTop: '3px solid var(--bs-vivid)' }}>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl flex-shrink-0">🍪</span>
          <div>
            <p className="font-black text-sm mb-1" style={{ color: 'var(--bs-deep)' }}>
              نستخدم ملفات الارتباط (Cookies)
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#7a6e68' }}>
              لتحسين تجربتك وتحليل الأداء. باستمرار التصفح توافقين على{' '}
              <Link href="/privacy" className="underline" style={{ color: 'var(--bs-vivid)' }}>
                سياسة الخصوصية
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={decline} className="btn-secondary flex-1 py-2 text-xs">
            رفض
          </button>
          <button onClick={accept} className="btn-primary flex-1 py-2 text-xs">
            موافق ✓
          </button>
        </div>
      </div>
    </div>
  );
}
