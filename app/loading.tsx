'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loading() {
  const [phase, setPhase] = useState(0);
  // 0=logo, 1=scissors anim, 2=text reveal, 3=bar fill
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
      style={{ background: 'linear-gradient(160deg, #0F1620 0%, #1E2B45 50%, #0F1620 100%)' }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.15), transparent 70%)',
          animation: 'glow-pulse 3s ease-in-out infinite',
        }} />
      </div>

      {/* Logo — shows for 5 seconds */}
      <div
        className="relative transition-all duration-700"
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
        }}
      >
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full opacity-30 blur-xl"
               style={{ background: 'var(--bs-primary)', animation: 'glow-pulse 2s ease-in-out infinite' }} />
          {/* Logo */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5 p-4 backdrop-blur-sm"
               style={{ border: '1px solid rgba(245,166,35,0.3)' }}>
            <Image
              src="/logo.jpg"
              alt="Bin Siddiq Fabrics"
              width={224}
              height={224}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Brand text */}
      <div
        className="text-center mt-6 transition-all duration-700"
        style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <p className="text-white tracking-[0.35em] uppercase font-black text-lg"
           style={{ fontFamily: 'Georgia, serif' }}>
          BIN SIDDIQ FABRICS
        </p>
        <p className="tracking-[0.5em] uppercase text-sm mt-1 font-semibold"
           style={{ color: 'var(--bs-primary)' }}>
          PREMIUM QUALITY
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="mt-8 transition-all duration-500"
        style={{ opacity: phase >= 2 ? 1 : 0, width: '160px' }}
      >
        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all ease-out"
            style={{
              width: phase >= 3 ? '100%' : phase >= 2 ? '60%' : '20%',
              background: 'var(--bs-grad)',
              transitionDuration: '4000ms',
            }}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5 mt-4">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full"
               style={{ background: 'var(--bs-primary)', animation: `loadingDot 1.4s ${i*0.25}s ease-in-out infinite` }} />
        ))}
      </div>

      <style>{`@keyframes loadingDot{0%,80%,100%{transform:scale(0.6);opacity:0.35;}40%{transform:scale(1.2);opacity:1;}}`}</style>
    </div>
  );
}
