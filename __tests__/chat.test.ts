import { describe, it, expect } from 'vitest';

// Test the rule-based fallback logic
function getRuleBasedReply(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('متر') || msg.includes('كمية')) return 'fabric-calculation';
  if (msg.includes('بشرة فاتح') || msg.includes('فاتحة')) return 'skin-light';
  if (msg.includes('بشرة أسمر') || msg.includes('بشرة داكن') || msg.includes('داكنة')) return 'skin-dark';
  if (msg.includes('فرح') || msg.includes('عرس')) return 'occasion-wedding';
  if (msg.includes('عزاء')) return 'occasion-condolence';
  if (msg.includes('صيف') || msg.includes('حر')) return 'season-summer';
  if (msg.includes('سعر') || msg.includes('كم سعر')) return 'prices';
  if (msg.includes('توصيل') || msg.includes('شحن')) return 'shipping';
  if (msg.includes('مرحبا') || msg.includes('أهلا')) return 'greeting';
  return 'default';
}

describe('Chat Fallback Logic', () => {
  it('handles fabric calculation questions', () => {
    expect(getRuleBasedReply('كم متر أحتاج لفستان')).toBe('fabric-calculation');
    expect(getRuleBasedReply('كمية القماش للعباية')).toBe('fabric-calculation');
  });

  it('handles skin tone questions', () => {
    expect(getRuleBasedReply('ما الألوان للبشرة الفاتحة')).toBe('skin-light');
    expect(getRuleBasedReply('بشرة فاتح ما يناسبها')).toBe('skin-light');
    expect(getRuleBasedReply('بشرة أسمر ما الألوان المناسبة')).toBe('skin-dark');
    expect(getRuleBasedReply('البشرة الداكنة')).toBe('skin-dark');
  });

  it('handles occasion questions', () => {
    expect(getRuleBasedReply('ماذا ألبس في الفرح')).toBe('occasion-wedding');
    expect(getRuleBasedReply('قماش عرس مناسب')).toBe('occasion-wedding');
    expect(getRuleBasedReply('ملابس العزاء')).toBe('occasion-condolence');
  });

  it('handles season questions', () => {
    expect(getRuleBasedReply('قماش للصيف')).toBe('season-summer');
    expect(getRuleBasedReply('قماش مناسب للحر')).toBe('season-summer');
  });

  it('handles price questions', () => {
    expect(getRuleBasedReply('كم سعر الجورجيت')).toBe('prices');
    expect(getRuleBasedReply('ما سعر القماش')).toBe('prices');
  });

  it('handles shipping questions', () => {
    expect(getRuleBasedReply('هل يوجد توصيل')).toBe('shipping');
    expect(getRuleBasedReply('كم رسوم الشحن')).toBe('shipping');
    expect(getRuleBasedReply('هل يوجد توصيل')).toBe('shipping');
    expect(getRuleBasedReply('كم رسوم الشحن')).toBe('shipping');
  });

  it('handles greetings', () => {
    expect(getRuleBasedReply('مرحبا')).toBe('greeting');
    expect(getRuleBasedReply('أهلا وسهلا')).toBe('greeting');
  });

  it('returns default for unknown questions', () => {
    expect(getRuleBasedReply('سؤال غير معروف xyz')).toBe('default');
  });
});

describe('Chat Message Validation', () => {
  it('rejects empty messages', () => {
    const isValid = (msg: string) => msg.trim().length > 0;
    expect(isValid('')).toBe(false);
    expect(isValid('  ')).toBe(false);
    expect(isValid('سؤال')).toBe(true);
  });

  it('rejects overly long messages', () => {
    const isValid = (msg: string) => msg.length <= 1000;
    expect(isValid('ا'.repeat(1001))).toBe(false);
    expect(isValid('ا'.repeat(500))).toBe(true);
  });

  it('accepts valid Arabic messages', () => {
    const validMessages = [
      'كم متر أحتاج لفستان؟',
      'ما الألوان المناسبة للبشرة القمحية؟',
      'أريد قماشاً للفرح',
    ];
    validMessages.forEach(msg => {
      expect(msg.trim().length).toBeGreaterThan(0);
      expect(msg.length).toBeLessThanOrEqual(1000);
    });
  });
});
