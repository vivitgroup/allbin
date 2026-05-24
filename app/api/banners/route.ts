import { NextRequest, NextResponse } from 'next/server';

let BANNERS = [
  { id:'b1', title:'خصم 20% على الساتان الملكي', sub:'عرض محدود — أسبوع فقط', cta:'تسوق الآن', href:'/products?cat=satin', bg:'linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)', badge:'🎉 عرض خاص', active:true },
  { id:'b2', title:'مجموعة الصيف الجديدة', sub:'أقمشة شيفون وجورجيت خفيفة', cta:'استكشفي', href:'/products?season=summer', bg:'linear-gradient(135deg, #2D6A9F 0%, #1a3d60 100%)', badge:'☀️ صيف 2025', active:true },
  { id:'b3', title:'شحن مجاني لينبع وجدة', sub:'على جميع الطلبات هذا الأسبوع', cta:'اطلبي الآن', href:'/products', bg:'linear-gradient(135deg, #8B0000 0%, #E31837 100%)', badge:'🚚 مجاني', active:true },
];

export async function GET() {
  return NextResponse.json(BANNERS);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    BANNERS = body;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    BANNERS = BANNERS.map((b: any) => (b.id === id ? { ...b, ...updates } : b));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
