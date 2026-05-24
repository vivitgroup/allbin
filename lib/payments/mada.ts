// ═══════════════════════════════════════════════════
//  MADA PAYMENT — Saudi Arabia
//  Note: Mada is a NETWORK not a gateway.
//  Use via: Moyasar, Geidea, or HyperPay
//  This file handles Mada-specific validation
// ═══════════════════════════════════════════════════

// Mada BINs (Bank Identification Numbers)
// These are the first 6 digits of Mada cards
const MADA_BINS = new Set([
  '400861','400862','400863','403024','403026','403040','407197','407395','407520',
  '409201','410685','410686','412565','420132','422817','422818','422819','428331',
  '428671','428672','428673','431361','432328','434107','439954','440533','440647',
  '440795','445564','446393','446404','446405','446406','446672','455708','457865',
  '458456','462220','468540','468541','468542','468543','476068','480209','480210',
  '480211','480212','480213','484783','486094','486095','486096','504300','508160',
  '515079','521076','524130','524514','529741','530060','531095','535825','535989',
  '536023','543085','543357','549760','554180','557606','558848','588848','588849',
  '588850','588982','588983','589005','589206','604906','636120','968201','968202',
  '968203','968204','968205','968206','968207','968208','968209','968210','968211',
]);

export function isMadaCard(cardNumber: string): boolean {
  const bin = cardNumber.replace(/\s/g, '').slice(0, 6);
  return MADA_BINS.has(bin);
}

export function getMadaBank(cardNumber: string): string {
  const bin = cardNumber.replace(/\s/g, '').slice(0, 6);
  const bankMap: Record<string, string> = {
    '400861': 'Al Rajhi Bank',    '400862': 'Al Rajhi Bank',
    '407197': 'Riyad Bank',       '407395': 'Riyad Bank',
    '409201': 'Saudi National Bank', '431361': 'Saudi National Bank',
    '432328': 'Banque Saudi Fransi', '504300': 'NCB / Alinma',
    '968201': 'Al Rajhi Bank',    '968202': 'Riyad Bank',
  };
  return bankMap[bin] || 'بنك سعودي';
}

// Format Mada card number for display
export function formatMadaCard(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

// Validate Mada card expiry
export function validateExpiry(month: string, year: string): boolean {
  const now    = new Date();
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  return expiry > now;
}

// Luhn check for card validation
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (isEven) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}
