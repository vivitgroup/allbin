import { NextRequest, NextResponse } from 'next/server';
import { createMoyasarPayment, verifyMoyasarPayment, sarsToHalalas } from '@/lib/payments/moyasar';

// POST /api/moyasar — Create payment
export async function POST(req: NextRequest) {
  try {
    const { amount, description, source, orderId, callbackUrl } = await req.json();

    if (!amount || amount <= 0)  return NextResponse.json({ error: 'مبلغ غير صحيح' }, { status: 400 });
    if (!source?.type)           return NextResponse.json({ error: 'طريقة الدفع مطلوبة' }, { status: 400 });
    if (!orderId)                return NextResponse.json({ error: 'رقم الطلب مطلوب' }, { status: 400 });

    const payment = await createMoyasarPayment({
      amount:       sarsToHalalas(amount),
      currency:     'SAR',
      description:  description || `طلب ${orderId} — بن صديق للأقمشة`,
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirm`,
      source,
      metadata: { orderId, store: 'bin-siddiq-fabric' },
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'خطأ في الدفع';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET /api/moyasar?id=xxx — Verify payment
export async function GET(req: NextRequest) {
  const paymentId = new URL(req.url).searchParams.get('id');
  if (!paymentId) return NextResponse.json({ error: 'payment ID مطلوب' }, { status: 400 });

  try {
    const payment = await verifyMoyasarPayment(paymentId);
    return NextResponse.json({ payment });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'خطأ في التحقق';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
