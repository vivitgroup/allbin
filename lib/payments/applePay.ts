// ═══════════════════════════════════════════════════
//  APPLE PAY — Web Implementation
//  Works via: Moyasar, Geidea, or Stripe
//  Requires: HTTPS + Apple Merchant Verification
// ═══════════════════════════════════════════════════

export interface ApplePayConfig {
  merchantId:          string;  // e.g. 'merchant.com.binsiddiq'
  merchantName:        string;  // 'بن صديق للأقمشة'
  countryCode:         string;  // 'SA'
  currencyCode:        string;  // 'SAR'
  amount:              number;
  orderDescription:    string;
  supportedNetworks:   string[];
  merchantCapabilities: string[];
}

// ── Check Apple Pay availability ───────────────────
export function isApplePayAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).ApplePaySession &&
    (window as any).ApplePaySession.canMakePayments();
}

// ── Check if user has cards ────────────────────────
export async function canMakeApplePayPayments(merchantId: string): Promise<boolean> {
  if (!isApplePayAvailable()) return false;
  try {
    return await (window as any).ApplePaySession.canMakePaymentsWithActiveCard(merchantId);
  } catch { return false; }
}

// ── Create Apple Pay Session ───────────────────────
export function createApplePaySession(
  config: ApplePayConfig,
  onValidateMerchant: (url: string) => Promise<unknown>,
  onPaymentAuthorized: (payment: unknown) => Promise<{ success: boolean; error?: string }>
) {
  const request: Record<string, unknown> = {
    countryCode:         config.countryCode,
    currencyCode:        config.currencyCode,
    merchantCapabilities: config.merchantCapabilities,
    supportedNetworks:   config.supportedNetworks,
    total: {
      label:  config.merchantName,
      amount: config.amount.toFixed(2),
      type:   'final',
    },
    lineItems: [
      { label: config.orderDescription, amount: config.amount.toFixed(2) },
    ],
    requiredBillingContactFields:  ['name', 'phone'],
    requiredShippingContactFields: ['name', 'phone', 'postalAddress'],
  };

  const session = new (window as any).ApplePaySession(14, request);

  session.onvalidatemerchant = async (event: { validationURL: string }) => {
    try {
      const merchantSession = await onValidateMerchant(event.validationURL);
      session.completeMerchantValidation(merchantSession);
    } catch {
      session.abort();
    }
  };

  session.onpaymentauthorized = async (event: { payment: unknown }) => {
    const result = await onPaymentAuthorized(event.payment);
    session.completePayment(
      result.success
        ? (window as any).ApplePaySession.STATUS_SUCCESS
        : (window as any).ApplePaySession.STATUS_FAILURE
    );
  };

  session.oncancel = () => {
    console.warn('Apple Pay cancelled');
  };

  return session;
}

// ── Default config for Bin Siddiq ─────────────────
export const defaultApplePayConfig: Omit<ApplePayConfig, 'amount' | 'orderDescription'> = {
  merchantId:          process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_ID || 'merchant.com.binsiddiq',
  merchantName:        'بن صديق للأقمشة الفاخرة',
  countryCode:         'SA',
  currencyCode:        'SAR',
  supportedNetworks:   ['mada', 'visa', 'masterCard', 'amex'],
  merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
};
