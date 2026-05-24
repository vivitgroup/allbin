import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // In production: query Supabase with auth check
  return NextResponse.json(
    { orders: [], total: 0 },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping_address } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'الطلب يجب أن يحتوي على منتجات' }, { status: 400 });
    }
    if (!shipping_address?.full_name || !shipping_address?.phone) {
      return NextResponse.json({ error: 'بيانات الشحن غير مكتملة' }, { status: 400 });
    }

    const totalAmount = (items as Array<{ price_per_meter: number; meters: number }>)
      .reduce((sum, item) => sum + (item.price_per_meter * item.meters), 0);

    const order = {
      id:             `ORD-${Date.now()}`,
      ...body,
      total_amount:   totalAmount,
      status:         'pending',
      payment_status: 'unpaid',
      created_at:     new Date().toISOString(),
    };

    return NextResponse.json({ order, message: 'تم استلام الطلب بنجاح' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في معالجة الطلب' }, { status: 400 });
  }
}
