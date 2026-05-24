import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { validationURL } = await req.json();
    if (!validationURL || !validationURL.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid validation URL' }, { status: 400 });
    }
    const merchantId = process.env.APPLE_PAY_MERCHANT_ID || 'merchant.com.binsiddiq';
    // Dev fallback — in production use Apple cert
    return NextResponse.json({
      epochTimestamp:            Date.now(),
      expiresAt:                 Date.now() + 3600000,
      merchantSessionIdentifier: `session-${Date.now()}`,
      merchantIdentifier:        merchantId,
      domainName:                'binsiddiq.com',
      displayName:               'بن صديق للأقمشة',
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Validation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
