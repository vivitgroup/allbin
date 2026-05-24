import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt     = 'بن صديق للأقمشة الفاخرة';
export const size    = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1C0A0A 0%, #3D0808 35%, #8B0000 65%, #E31837 100%)',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 0, transparent 12px)',
          backgroundSize: '12px 12px',
        }} />

        {/* BS large text */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: 180, fontWeight: 900, fontStyle: 'italic', color: '#8B0000', lineHeight: 1, opacity: 0.95 }}>B</span>
          <span style={{ fontSize: 160, fontWeight: 900, fontStyle: 'italic', color: '#C0C0C0', lineHeight: 1, opacity: 0.85, marginTop: '-20px' }}>S</span>
        </div>

        {/* Brand name */}
        <p style={{ fontSize: 52, fontWeight: 900, color: 'white', letterSpacing: '8px', margin: '0 0 8px' }}>
          BIN SIDDIQ
        </p>
        <p style={{ fontSize: 28, fontWeight: 400, color: '#E31837', letterSpacing: '12px', margin: '0 0 32px' }}>
          FABRIC
        </p>

        {/* Tagline */}
        <p style={{ fontSize: 24, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          أفضل الأقمشة الفاخرة في ينبع والمملكة العربية السعودية
        </p>

        {/* URL */}
        <p style={{ position: 'absolute', bottom: 32, fontSize: 18, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
          binsiddiq.com
        </p>
      </div>
    ),
    { ...size }
  );
}
