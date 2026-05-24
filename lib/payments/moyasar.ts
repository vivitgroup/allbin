// ═══════════════════════════════════════════════════
//  MOYASAR PAYMENT GATEWAY — Saudi Arabia
//  Supports: Mada, Visa, Mastercard, Apple Pay, STC Pay
//  Docs: https://moyasar.com/docs
// ═══════════════════════════════════════════════════

export interface MoyasarPaymentRequest {
  amount:      number;       // Amount in halalas (SAR × 100)
  currency:    'SAR';
  description: string;
  callback_url: string;
  source: {
    type:   'creditcard' | 'applepay' | 'stcpay';
    name?:  string;
    number?: string;
    cvc?:   string;
    month?: string;
    year?:  string;
    token?: string;         // Apple Pay token
    mobile?: string;        // STC Pay mobile
  };
  metadata?: Record<string, string>;
}

export interface MoyasarPaymentResponse {
  id:          string;
  status:      'paid' | 'failed' | 'initiated' | 'authorized';
  amount:      number;
  currency:    string;
  description: string;
  message?:    string;
  source: {
    type:    string;
    company: string;
    name:    string;
    number:  string;
    message: string;
    transaction_url?: string;
  };
}

const MOYASAR_API  = 'https://api.moyasar.com/v1';
const MOYASAR_KEY  = process.env.MOYASAR_SECRET_KEY || '';
const MOYASAR_PUB  = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY || '';

// ── Create Payment ──────────────────────────────────
export async function createMoyasarPayment(
  payload: MoyasarPaymentRequest
): Promise<MoyasarPaymentResponse> {
  const res = await fetch(`${MOYASAR_API}/payments`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Basic ${Buffer.from(MOYASAR_KEY + ':').toString('base64')}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'فشل إنشاء الدفع');
  }

  return res.json();
}

// ── Verify Payment ──────────────────────────────────
export async function verifyMoyasarPayment(
  paymentId: string
): Promise<MoyasarPaymentResponse> {
  const res = await fetch(`${MOYASAR_API}/payments/${paymentId}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(MOYASAR_KEY + ':').toString('base64')}`,
    },
  });

  if (!res.ok) throw new Error('فشل التحقق من الدفع');
  return res.json();
}

// ── Refund Payment ──────────────────────────────────
export async function refundMoyasarPayment(
  paymentId: string,
  amount: number
): Promise<{ id: string; status: string }> {
  const res = await fetch(`${MOYASAR_API}/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Basic ${Buffer.from(MOYASAR_KEY + ':').toString('base64')}`,
    },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) throw new Error('فشل استرداد الدفع');
  return res.json();
}

// ── Helpers ─────────────────────────────────────────
export const sarsToHalalas = (sars: number) => Math.round(sars * 100);
export const halalsToSars  = (h: number)    => h / 100;

export { MOYASAR_PUB };
