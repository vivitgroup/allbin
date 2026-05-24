'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ShoppingCart, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useSiteStore } from '@/stores/siteStore';

// ── Natural body proportions — realistic woman model ──────────
// Viewbox: 200 × 480, natural proportions
// Head:shoulder:hip:leg = 1:1.5:1.6:2.1

const SKIN_TONES = [
  { name:'fair',   hex:'#FDDBB4', shadow:'#E8C49A', lip:'#C0706A', eye:'#5A3520', label:'فاتح جداً' },
  { name:'light',  hex:'#F0C898', shadow:'#D4A870', lip:'#B8605A', eye:'#4A2A18', label:'فاتح'       },
  { name:'wheat',  hex:'#D4956A', shadow:'#B87A50', lip:'#9A3838', eye:'#3A2010', label:'قمحي'        },
  { name:'olive',  hex:'#C07850', shadow:'#9A5C35', lip:'#8B2828', eye:'#2A1A0A', label:'زيتوني'      },
  { name:'brown',  hex:'#8B5030', shadow:'#6A3A1A', lip:'#7A1818', eye:'#1A0E06', label:'بني'         },
  { name:'dark',   hex:'#5A3020', shadow:'#3D1A0A', lip:'#4A0808', eye:'#100806', label:'أسمر'        },
];

const FABRICS = [
  { id:'1',  name:'أحمر ملكي',     hex:'#D41E2F', dark:'#8B1A1A', price:85,  cat:'جورجيت' },
  { id:'2',  name:'ذهبي فاخر',     hex:'#D4AF37', dark:'#A08020', price:250, cat:'ساتان'  },
  { id:'3',  name:'كحلي ليلي',     hex:'#1E3A5F', dark:'#0A1E3A', price:65,  cat:'شيفون'  },
  { id:'4',  name:'فضي لامع',      hex:'#B8B8B8', dark:'#808080', price:120, cat:'ساتان'  },
  { id:'5',  name:'برغندي',         hex:'#800020', dark:'#4A0010', price:180, cat:'قطيفة'  },
  { id:'6',  name:'أسود كلاسيك',   hex:'#1A1A1A', dark:'#050505', price:65,  cat:'شيفون'  },
  { id:'7',  name:'وردي فوشيا',    hex:'#E91E8C', dark:'#A0126A', price:95,  cat:'جورجيت' },
  { id:'8',  name:'زيتوني',         hex:'#556B2F', dark:'#2F3D1A', price:95,  cat:'كريب'   },
  { id:'9',  name:'برتقالي دافئ',  hex:'#F5A623', dark:'#D4880A', price:85,  cat:'جورجيت' },
  { id:'10', name:'تيل زمردي',     hex:'#1B7B6B', dark:'#0A4040', price:95,  cat:'كريب'   },
  { id:'11', name:'بنفسجي',         hex:'#7B3F9E', dark:'#4A1A6A', price:120, cat:'ساتان'  },
  { id:'12', name:'أبيض عاجي',     hex:'#F8F4EE', dark:'#D4C9B0', price:220, cat:'حرير'   },
];

const STYLES = [
  { id:'aline',   label:'A-Line',        emoji:'👗', paths:{
    dress:'M78,140 C68,145 62,155 60,175 C55,210 52,250 50,290 C48,325 47,345 47,365 L153,365 C153,345 152,325 150,290 C148,250 145,210 140,175 C138,155 132,145 122,140 Z',
    bodice:'M78,140 C68,145 62,155 60,175 C58,188 58,198 60,205 C70,212 85,216 100,216 C115,216 130,212 140,205 C142,198 142,188 140,175 C138,155 132,145 122,140 Z',
    neckline:'M85,140 Q100,148 115,140',
  }},
  { id:'fitted',  label:'Bodycon',        emoji:'✨', paths:{
    dress:'M80,140 C72,145 66,155 64,175 C62,210 61,250 62,290 C63,325 64,345 65,365 L135,365 C136,345 137,325 138,290 C139,250 138,210 136,175 C134,155 128,145 120,140 Z',
    bodice:'M80,140 C72,145 66,155 64,175 C62,188 63,198 66,205 C76,212 88,215 100,215 C112,215 124,212 134,205 C137,198 138,188 136,175 C134,155 128,145 120,140 Z',
    neckline:'M86,140 Q100,147 114,140',
  }},
  { id:'mermaid', label:'حورية البحر',   emoji:'🌊', paths:{
    dress:'M80,140 C72,145 66,155 64,175 C62,210 62,248 64,270 C60,295 56,320 62,345 C68,355 78,362 100,365 C122,362 132,355 138,345 C144,320 140,295 136,270 C138,248 138,210 136,175 C134,155 128,145 120,140 Z',
    bodice:'M80,140 C72,145 66,155 64,175 C62,188 63,198 66,205 C76,212 88,215 100,215 C112,215 124,212 134,205 C137,198 138,188 136,175 C134,155 128,145 120,140 Z',
    neckline:'M86,140 Q100,147 114,140',
  }},
  { id:'balloon', label:'Balloon Hem',    emoji:'🎀', paths:{
    dress:'M78,140 C68,145 62,155 60,175 C56,210 52,246 50,265 C54,285 60,305 56,335 C52,355 48,362 48,365 L152,365 C152,362 148,355 144,335 C140,305 146,285 150,265 C148,246 144,210 140,175 C138,155 132,145 122,140 Z',
    bodice:'M78,140 C68,145 62,155 60,175 C58,188 58,198 60,205 C70,212 85,216 100,216 C115,216 130,212 140,205 C142,198 142,188 140,175 C138,155 132,145 122,140 Z',
    neckline:'M85,140 Q100,148 115,140',
  }},
  { id:'empire',  label:'Empire Waist',   emoji:'👑', paths:{
    dress:'M78,140 C68,145 62,153 60,165 C58,175 58,185 60,192 C70,200 85,204 100,204 C115,204 130,200 140,192 C142,185 142,175 140,165 C138,153 132,145 122,140 Z M56,195 C54,220 50,250 48,280 C46,310 45,338 45,365 L155,365 C155,338 154,310 152,280 C150,250 146,220 144,195 C132,202 118,206 100,206 C82,206 68,202 56,195 Z',
    bodice:'M78,140 C68,145 62,153 60,165 C58,175 58,185 60,192 C70,200 85,204 100,204 C115,204 130,200 140,192 C142,185 142,175 140,165 C138,153 132,145 122,140 Z',
    neckline:'M85,140 Q100,148 115,140',
  }},
  { id:'wrap',    label:'Wrap Dress',     emoji:'🌸', paths:{
    dress:'M82,140 C72,145 65,155 62,175 C58,210 55,250 54,290 C53,325 53,345 54,365 L146,365 C147,345 147,325 146,290 C145,250 142,210 138,175 C135,155 128,145 118,140 Z',
    bodice:'M82,140 C72,145 65,155 62,175 C60,188 60,198 63,205 C73,212 86,216 100,216 C114,216 127,212 137,205 C140,198 140,188 138,175 C135,155 128,145 118,140 Z',
    neckline:'M82,140 Q100,152 118,140',
  }},
];

export default function DressViewer() {
  const [skin,     setSkin]     = useState(SKIN_TONES[2]);
  const [fabric,   setFabric]   = useState(FABRICS[0]);
  const [style,    setStyle]    = useState(STYLES[0]);
  const [meters,   setMeters]   = useState(3);
  const [morphKey, setMorphKey] = useState(0);
  const [added,    setAdded]    = useState(false);

  // 360° rotation state
  const [angle,     setAngle]     = useState(0);
  const [dragging,  setDragging]  = useState(false);
  const [startX,    setStartX]    = useState(0);
  const [startAngle,setStartAngle]= useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const addItem = useCartStore(s => s.addItem);
  const settings = useSiteStore(s => s.settings);

  useEffect(() => { setMorphKey(k => k + 1); }, [fabric, style]);

  // ── Mouse drag for 360° rotation ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.clientX);
    setStartAngle(angle);
    e.preventDefault();
  }, [angle]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx    = e.clientX - startX;
    const dAngle = (dx / 2) % 360;
    setAngle(startAngle + dAngle);
  }, [dragging, startX, startAngle]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  // Touch support
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true);
    setStartX(e.touches[0].clientX);
    setStartAngle(angle);
  }, [angle]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    const dx     = e.touches[0].clientX - startX;
    const dAngle = (dx / 2) % 360;
    setAngle(startAngle + dAngle);
  }, [dragging, startX, startAngle]);

  // 3D perspective: angle → scaleX compression
  const norm   = ((angle % 360) + 360) % 360;
  const isFront = norm < 90 || norm > 270;
  const scaleX = Math.abs(Math.cos((norm * Math.PI) / 180));
  const showBack = norm >= 90 && norm <= 270;

  const handleAdd = () => {
    addItem({
      id: fabric.id, name: `قماش ${fabric.name} — ${fabric.cat}`,
      description: '', price: fabric.price, price_per_meter: fabric.price,
      category: fabric.cat, colors: [{ name: fabric.name, hex: fabric.hex }],
      images: [], stock_quantity: 100, is_active: true,
    }, meters, { name: fabric.name, hex: fabric.hex });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const paths = style.paths;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

        {/* ═══ MODEL VIEWER ═══ */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden select-none"
            style={{
              aspectRatio: '5/8',
              background:   `linear-gradient(160deg, #f5f0eb 0%, #ede6de 100%)`,
              cursor:       dragging ? 'grabbing' : 'grab',
              boxShadow:    '0 20px 60px rgba(30,43,69,0.18)',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onMouseUp}
          >
            {/* Grid bg */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
              <defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E2B45" strokeWidth="0.5"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#g)"/>
            </svg>

            {/* Glow */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none transition-all duration-700 opacity-20"
                 style={{ background: `radial-gradient(ellipse at 50% 90%, ${fabric.hex}, transparent 70%)` }}/>

            {/* SVG Model — 360° */}
            <svg
              ref={svgRef}
              viewBox="0 0 200 480"
              className="w-full h-full"
              key={`model-${morphKey}`}
              style={{
                transform:    `scaleX(${isFront ? scaleX : -scaleX})`,
                transition:    dragging ? 'none' : 'transform 0.05s ease',
                filter:        `drop-shadow(2px 8px 20px rgba(30,43,69,0.2))`,
              }}
            >
              <defs>
                {/* Dress gradient */}
                <linearGradient id="dG" x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%"   stopColor={showBack ? fabric.dark : fabric.hex}/>
                  <stop offset="40%"  stopColor={fabric.dark}/>
                  <stop offset="100%" stopColor={showBack ? fabric.hex : fabric.dark} stopOpacity="0.9"/>
                </linearGradient>
                {/* Skin gradient */}
                <linearGradient id="sG" x1="30%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%"   stopColor={skin.hex}/>
                  <stop offset="100%" stopColor={skin.shadow}/>
                </linearGradient>
                {/* Hair */}
                <linearGradient id="hG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#3D2008"/>
                  <stop offset="100%" stopColor="#1A0A02"/>
                </linearGradient>
                {/* Fabric shimmer */}
                <linearGradient id="sh" x1="0%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%"  stopColor="white" stopOpacity="0.18"/>
                  <stop offset="100%"stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <filter id="ss"><feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#00000030"/></filter>
              </defs>

              {/* ── Hair (back layer) ── */}
              <ellipse cx="100" cy="42" rx="30" ry="36" fill="url(#hG)"/>
              {/* Long hair sides */}
              <path d="M70,55 Q52,95 55,145 Q57,165 65,175 Q60,150 62,115 Q64,88 70,72 Z" fill="url(#hG)" opacity="0.9"/>
              <path d="M130,55 Q148,95 145,145 Q143,165 135,175 Q140,150 138,115 Q136,88 130,72 Z" fill="url(#hG)" opacity="0.9"/>

              {/* ── Neck ── */}
              <rect x="94" y="70" width="12" height="26" rx="5" fill="url(#sG)"/>

              {/* ── Head — realistic oval ── */}
              <ellipse cx="100" cy="46" rx="24" ry="27" fill="url(#sG)"/>

              {/* Cheeks */}
              <ellipse cx="82"  cy="52" rx="8" ry="6" fill={skin.hex} opacity="0.28"/>
              <ellipse cx="118" cy="52" rx="8" ry="6" fill={skin.hex} opacity="0.28"/>

              {/* Eyes */}
              <ellipse cx="91"  cy="46" rx="4.5" ry="5" fill={skin.eye}/>
              <ellipse cx="109" cy="46" rx="4.5" ry="5" fill={skin.eye}/>
              <ellipse cx="91"  cy="46" rx="2.5" ry="3" fill="#0A0806"/>
              <ellipse cx="109" cy="46" rx="2.5" ry="3" fill="#0A0806"/>
              <circle  cx="92.5" cy="44.5" r="1.5"  fill="white" opacity="0.85"/>
              <circle  cx="110.5"cy="44.5" r="1.5"  fill="white" opacity="0.85"/>
              {/* Lash lines */}
              <path d="M86,41 Q91,38.5 95,41" stroke="#0A0806" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              <path d="M105,41 Q109,38.5 114,41" stroke="#0A0806" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              {/* Eyebrows */}
              <path d="M85,38.5 Q91,36 96,38" stroke="#2A1505" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M104,38 Q109,36 115,38.5" stroke="#2A1505" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              {/* Nose */}
              <path d="M97,54 Q100,58 103,54" stroke={skin.shadow} strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round"/>
              {/* Lips */}
              <path d="M91.5,60.5 Q96,65 100,63 Q104,65 108.5,60.5 Q104,58 100,59.5 Q96,58 91.5,60.5 Z" fill={skin.lip}/>
              <path d="M91.5,60.5 Q100,63.5 108.5,60.5" stroke={skin.lip} strokeWidth="0.7" fill="none" opacity="0.4"/>

              {/* Hair front */}
              <path d="M76,28 Q82,14 100,12 Q118,14 124,28 Q118,19 100,17 Q82,19 76,28 Z" fill="url(#hG)"/>

              {/* ── Shoulders ── */}
              <path d="M70,115 Q55,118 48,130 Q44,140 46,150 Q54,145 60,140 Q65,132 72,128 Z" fill="url(#sG)"/>
              <path d="M130,115 Q145,118 152,130 Q156,140 154,150 Q146,145 140,140 Q135,132 128,128 Z" fill="url(#sG)"/>

              {/* ── Arms (natural feminine proportions) ── */}
              {/* Left arm */}
              <path d="M70,118 Q53,128 46,155 Q42,172 44,188 Q48,182 52,170 Q56,155 63,140 Q67,130 70,122 Z" fill="url(#sG)"/>
              {/* Right arm */}
              <path d="M130,118 Q147,128 154,155 Q158,172 156,188 Q152,182 148,170 Q144,155 137,140 Q133,130 130,122 Z" fill="url(#sG)"/>
              {/* Hands */}
              <ellipse cx="44"  cy="192" rx="8" ry="10" fill="url(#sG)"/>
              <ellipse cx="156" cy="192" rx="8" ry="10" fill="url(#sG)"/>

              {/* ── DRESS ── */}
              <g key={`dress-${morphKey}`} className="animate-dress-morph">
                <path d={paths.dress}   fill="url(#dG)" filter="url(#ss)"/>
                <path d={paths.dress}   fill="url(#sh)"/>
                <path d={paths.bodice}  fill={fabric.dark} opacity="0.15"/>
                <path d={paths.neckline}stroke={fabric.hex} strokeWidth="1.8" fill="none" opacity="0.5"/>
                {/* Subtle fold lines */}
                <path d="M88,210 Q90,240 88,270 M112,210 Q110,240 112,270"
                      stroke={fabric.dark} strokeWidth="0.8" fill="none" opacity="0.18"/>
              </g>

              {/* ── Legs (natural length) ── */}
              <rect x="88" y="362" width="11" height="40" rx="5" fill="url(#sG)"/>
              <rect x="101"y="362" width="11" height="40" rx="5" fill="url(#sG)"/>

              {/* ── Shoes ── */}
              <ellipse cx="93"  cy="405" rx="10" ry="6" fill="#1E2B45"/>
              <ellipse cx="107" cy="405" rx="10" ry="6" fill="#1E2B45"/>
              <rect x="87"  y="401" width="3" height="8" rx="1.5" fill="#1E2B45" opacity="0.7"/>
              <rect x="109" y="401" width="3" height="8" rx="1.5" fill="#1E2B45" opacity="0.7"/>
            </svg>

            {/* ── Info pill ── */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-xl px-3.5 py-2 shadow"
                 style={{ border: '2px solid var(--bs-primary)' }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white shadow"
                     style={{ background: skin.hex, flexShrink: 0 }}/>
                <div>
                  <p className="text-[9px] text-gray-400 leading-none">البشرة</p>
                  <p className="text-xs font-black leading-none" style={{ color: 'var(--bs-navy)' }}>{skin.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-[9px] text-gray-400 leading-none text-left">القماش</p>
                  <p className="text-xs font-black leading-none text-left" style={{ color: 'var(--bs-navy)' }}>{fabric.name}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-white shadow"
                     style={{ background: fabric.hex, flexShrink: 0 }}/>
              </div>
            </div>

            {/* ── 360 hint ── */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
              <RotateCcw className="w-3 h-3 text-white opacity-70"/>
              <span className="text-white text-[10px] font-medium opacity-70">360°</span>
            </div>
          </div>

          {/* Rotation controls */}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setAngle(a => a - 45)} className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all hover:shadow"
                    style={{ borderColor: 'var(--bs-primary)', color: 'var(--bs-primary)' }}>
              <ChevronRight className="w-4 h-4"/>
            </button>
            <div className="flex-1 text-center">
              <p className="text-sm font-black" style={{ color: 'var(--bs-navy)' }}>
                {(fabric.price * meters).toFixed(0)} <span className="text-gray-400 text-xs font-normal">ر.س</span>
              </p>
              <p className="text-xs text-gray-400">{meters} متر من {fabric.name}</p>
            </div>
            <button onClick={() => setAngle(a => a + 45)} className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--bs-grad)' }}>
              <ChevronLeft className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* ═══ CONTROLS ═══ */}
        <div className="space-y-6">

          {/* Skin */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--bs-grad)' }}/>
              <h3 className="font-black text-sm sm:text-base" style={{ color: 'var(--bs-navy)' }}>لون البشرة</h3>
            </div>
            <div className="flex gap-2.5 sm:gap-3 flex-wrap">
              {SKIN_TONES.map(t => (
                <button key={t.name} onClick={() => setSkin(t)} className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 relative"
                       style={{
                         background: t.hex,
                         transform:  skin.name === t.name ? 'scale(1.22)' : 'scale(1)',
                         boxShadow:  skin.name === t.name
                           ? `0 0 0 3px white, 0 0 0 5px var(--bs-primary), 0 4px 12px ${t.hex}66`
                           : `0 2px 6px ${t.hex}55`,
                       }}>
                    {skin.name === t.name && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3}/>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-semibold"
                        style={{ color: skin.name === t.name ? 'var(--bs-navy)' : '#9BA5B4' }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fabrics */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--bs-silver)' }}/>
              <h3 className="font-black text-sm sm:text-base" style={{ color: 'var(--bs-navy)' }}>لون القماش</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5">
              {FABRICS.map(f => (
                <button key={f.id} onClick={() => setFabric(f)} className="flex flex-col items-center gap-1">
                  <div className="w-full aspect-square rounded-xl relative overflow-hidden transition-all duration-200"
                       style={{
                         background:  `linear-gradient(135deg, ${f.hex}, ${f.dark})`,
                         transform:   fabric.id === f.id ? 'scale(1.1)' : 'scale(1)',
                         boxShadow:   fabric.id === f.id
                           ? `0 0 0 2.5px white, 0 0 0 4.5px var(--bs-primary), 0 4px 12px ${f.hex}44`
                           : `0 2px 5px ${f.hex}33`,
                       }}>
                    {fabric.id === f.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3}/>
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-center leading-tight truncate w-full"
                        style={{ color: fabric.id === f.id ? 'var(--bs-navy)' : '#9BA5B4', fontWeight: fabric.id === f.id ? 700 : 400 }}>
                    {f.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--bs-grad)' }}/>
              <h3 className="font-black text-sm sm:text-base" style={{ color: 'var(--bs-navy)' }}>موديل الفستان</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s)}
                  className="p-2.5 sm:p-3 rounded-xl border-2 text-right transition-all"
                  style={{
                    borderColor: style.id === s.id ? 'var(--bs-primary)' : 'var(--bs-border)',
                    background:  style.id === s.id ? 'rgba(245,166,35,0.06)' : 'white',
                    transform:   style.id === s.id ? 'scale(1.02)' : 'scale(1)',
                  }}>
                  <p className="font-black text-xs sm:text-sm" style={{ color: style.id === s.id ? 'var(--bs-navy)' : '#374151' }}>
                    {s.emoji} {s.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Meters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--bs-silver)' }}/>
              <h3 className="font-black text-sm sm:text-base" style={{ color: 'var(--bs-navy)' }}>الكمية (متر)</h3>
            </div>
            <div className="card-pearl p-4 rounded-xl">
              <input type="range" min={1} max={10} step={0.5} value={meters}
                onChange={e => setMeters(Number(e.target.value))}
                className="w-full mb-2.5" style={{ accentColor: 'var(--bs-primary)' }}/>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">1م</span>
                <span className="font-black text-2xl" style={{ color: 'var(--bs-navy)' }}>{meters}م</span>
                <span className="text-xs text-gray-400">10م</span>
              </div>
              <Link href="/ai-measure"
                className="flex items-center justify-center gap-1.5 text-xs mt-3 py-2 rounded-lg font-medium transition-colors"
                style={{ color: 'var(--bs-primary)', background: 'rgba(245,166,35,0.08)' }}>
                <Sparkles className="w-3.5 h-3.5"/>
                مش عارفة الكمية؟ استخدمي الحاسبة الذكية
              </Link>
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-black text-white transition-all duration-300"
              style={{
                background:  added ? '#16a34a' : 'var(--bs-grad)',
                boxShadow:   `0 4px 16px ${added ? 'rgba(22,163,74,0.4)' : 'rgba(245,166,35,0.4)'}`,
                transform:   added ? 'scale(0.97)' : 'scale(1)',
              }}>
              {added
                ? <><Check className="w-5 h-5" strokeWidth={3}/> أضيف للسلة!</>
                : <><ShoppingCart className="w-5 h-5"/> أضف للسلة</>
              }
            </button>
            <Link href="/cart"
              className="px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl font-bold text-sm border-2 transition-all hover:opacity-80"
              style={{ borderColor: 'var(--bs-border)', color: '#555', background: 'rgba(155,165,180,0.1)' }}>
              🛒
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
