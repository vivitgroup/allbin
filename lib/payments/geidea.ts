// ═══════════════════════════════════════════════════
//  GEIDEA PAYMENT GATEWAY — Saudi Arabia
//  Supports: Mada, Visa, Mastercard, Apple Pay
//  Partners: Al Rajhi Bank, SNB
//  Docs: https://developers.geidea.net
// ═══════════════════════════════════════════════════

const GEIDEA_API     = 'https://api.merchant.geidea.net/payment-intent/api/v2';
const MERCHANT_KEY   = process.env.GEIDEA_MERCHANT_KEY    || '';
const MERCHANT_PW    = process.env.GEIDEA_MERCHANT_PASSWORD || '';
const MERCHANT_ID    = process.env.GEIDEA_MERCHANT_ID      || '';

export interface GeideaOrderRequest {
  amount:        number;           // SAR decimal e.g. 85.00
  currency:      'SAR';
  merchantRefId: string;           // Your order ID
  callbackUrl:   string;
  returnUrl:     string;
  language?:     'ar' | 'en';
  customer?: {
    name:  string;
    email: string;
    phone: string;
  };
  paymentMethods?: ('mada' | 'visa' | 'mastercard' | 'applepay')[];
}

// ── Generate HMAC Signature ────────────────────────
async function generateSignature(
  merchantKey: string,
  amount: string,
  currency: string,
  merchantRefId: string,
  timestamp: string
): Promise<string> {
  const message = merchantKey + amount + currency + merchantRefId + timestamp;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(MERCHANT_PW);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Create Geidea Session ──────────────────────────
export async function createGeideaSession(order: GeideaOrderRequest) {
  const timestamp    = new Date().toISOString();
  const amountStr    = order.amount.toFixed(2);
  const signature    = await generateSignature(
    MERCHANT_KEY, amountStr, order.currency, order.merchantRefId, timestamp
  );

  const res = await fetch(`${GEIDEA_API}/session`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${MERCHANT_KEY}:${MERCHANT_PW}`).toString('base64')}`,
    },
    body: JSON.stringify({
      ...order,
      merchantId:  MERCHANT_ID,
      timestamp,
      signature,
      language:    order.language || 'ar',
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.responseMessage || 'فشل إنشاء جلسة الدفع');
  }

  return res.json(); // { sessionId, checkoutUrl }
}

// ── Verify Geidea Payment ──────────────────────────
export async function verifyGeideaPayment(orderId: string) {
  const res = await fetch(`${GEIDEA_API}/orders/${orderId}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${MERCHANT_KEY}:${MERCHANT_PW}`).toString('base64')}`,
    },
  });

  if (!res.ok) throw new Error('فشل التحقق من الدفع');
  return res.json();
}
