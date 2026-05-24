'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('App Error:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pearl px-4">
      <div className="card p-10 max-w-md w-full text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="font-black text-xl mb-2" style={{ color: 'var(--bs-deep)' }}>حدث خطأ غير متوقع</h2>
        <p className="text-gray-500 text-sm mb-6">
          {error.message || 'يرجى المحاولة مرة أخرى'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">إعادة المحاولة</button>
          <Link href="/"          className="btn-secondary">الصفحة الرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
