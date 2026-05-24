'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

/* Real fabric/cutting video embeds from Pexels (free) */
const FABRIC_VIDEOS = [
  {
    src: 'https://player.vimeo.com/external/368320114.sd.mp4?s=4048df8de5a04b9f427ef52a1a98e2e02a7c02ad&profile_id=164&oauth2_token_id=57447761',
    poster: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
    label: 'قص القماش بدقة احترافية',
  },
  {
    src: 'https://player.vimeo.com/external/435070836.sd.mp4?s=a22a083f13e3abf0a8c4ee5fb4a9c4e4&profile_id=164&oauth2_token_id=57447761',
    poster: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80',
    label: 'ماكينة خياطة فاخرة',
  },
];

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vidIdx, setVidIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  /* cycle through fabric videos */
  useEffect(() => {
    const id = setTimeout(() => setVidIdx((v) => (v + 1) % FABRIC_VIDEOS.length), 14000);
    return () => clearTimeout(id);
  }, [vidIdx]);

  const vid = FABRIC_VIDEOS[vidIdx];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(420px, 65vh, 720px)' }}>

      {/* ── Video background ── */}
      <div className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          key={vid.src}
          src={vid.src}
          poster={vid.poster}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setLoaded(true)}
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: loaded ? 1 : 0 }}
        />
        {/* Fallback poster shown until video loads */}
        {!loaded && (
          <img
            src={vid.poster}
            alt="fabric"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* ── Overlay gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(20,5,5,0.55) 55%, rgba(20,5,5,0.92) 100%)',
        }}
      />

      {/* ── Video label badge ── */}
      <div className="absolute top-6 right-6">
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm text-white"
          style={{ background: 'rgba(227,24,55,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
          ✂️ {vid.label}
        </span>
      </div>

      {/* ── Video dots ── */}
      <div className="absolute top-6 left-6 flex gap-2">
        {FABRIC_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setVidIdx(i); setLoaded(false); }}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: i === vidIdx ? 'white' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 w-full">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] mb-3 text-white/80">
              ✂️ &nbsp;Premium Fabric Cutting — Bin Siddiq
            </p>
            <h2
              className="font-black text-white mb-4 leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Georgia, serif' }}
            >
              كل قطعة قماش <br />
              <span style={{ color: '#E31837' }}>قصة إبداع</span>
            </h2>
            <p className="text-white/70 mb-6 text-base md:text-lg leading-relaxed max-w-lg">
              أقمشة فاخرة مقصوصة بدقة متناهية — من أجود المصادر العالمية إلى يديكِ
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="font-bold text-white px-7 py-3.5 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #8B0000, #E31837)' }}
              >
                تسوق الآن ←
              </Link>
              <Link
                href="/dress-viewer"
                className="font-bold px-7 py-3.5 rounded-xl transition-all hover:bg-white/20 border border-white/30 backdrop-blur-sm"
                style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
              >
                صممي فستانك ✨
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sewing machine mini card ── */}
      <div
        className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <span className="text-2xl">🪡</span>
        <div className="text-white">
          <p className="text-xs font-bold">ماكينات خياطة احترافية</p>
          <p className="text-[10px] opacity-70">دقة في كل غرزة</p>
        </div>
      </div>
    </section>
  );
}
