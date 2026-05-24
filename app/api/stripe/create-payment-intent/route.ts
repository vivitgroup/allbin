import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    // In production: create real Stripe payment intent
    return NextResponse.json({
      clientSecret: `pi_test_${Date.now()}_secret_placeholder`,
      amount,
    });
  } catch {
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
