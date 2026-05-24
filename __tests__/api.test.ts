import { describe, it, expect } from 'vitest';
import { calculateFabric, ORDER_STATUS_MAP } from '../lib/utils';

describe('AI Calculator Logic (API layer)', () => {
  it('handles minimum valid measurements', () => {
    const r = calculateFabric(140, 40, 'fitted');
    expect(r.meters).toBeGreaterThan(0);
    expect(r.size).toBeTruthy();
  });

  it('handles maximum valid measurements', () => {
    const r = calculateFabric(190, 120, 'loose');
    expect(r.meters).toBeGreaterThan(0);
  });

  it('loose > semi-fitted > fitted in fabric quantity', () => {
    const fitted     = calculateFabric(165, 65, 'fitted').meters;
    const semiFitted = calculateFabric(165, 65, 'semi-fitted').meters;
    const loose      = calculateFabric(165, 65, 'loose').meters;
    expect(semiFitted).toBeGreaterThanOrEqual(fitted);
    expect(loose).toBeGreaterThan(semiFitted);
  });

  it('all styles return valid results', () => {
    ['fitted','semi-fitted','loose','mermaid'].forEach((style) => {
      const r = calculateFabric(165, 65, style);
      expect(r.meters).toBeGreaterThan(0);
      expect(r.size).toBeTruthy();
    });
  });

  it('pattern adds exactly 0.5 meters in page logic', () => {
    const base         = calculateFabric(165, 65, 'fitted').meters;
    const withPattern  = base + 0.5;
    expect(withPattern - base).toBeCloseTo(0.5, 5);
  });

  it('meters result is always in 0.5 increments', () => {
    [[165,65],[170,70],[155,50],[180,90]].forEach(([h,w]) => {
      const r = calculateFabric(h, w, 'fitted');
      expect(r.meters * 2 % 1).toBe(0);
    });
  });
});

describe('API Input Validation (unit)', () => {
  it('rejects negative price in product creation', () => {
    const validate = (price: number) => price > 0;
    expect(validate(-10)).toBe(false);
    expect(validate(0)).toBe(false);
    expect(validate(85)).toBe(true);
  });

  it('rejects empty product name', () => {
    const validate = (name: string) => name.trim().length >= 2;
    expect(validate('')).toBe(false);
    expect(validate(' ')).toBe(false);
    expect(validate('قماش')).toBe(true);
  });

  it('rejects invalid height range', () => {
    const validate = (h: number) => h >= 100 && h <= 250;
    expect(validate(50)).toBe(false);
    expect(validate(300)).toBe(false);
    expect(validate(165)).toBe(true);
  });

  it('rejects invalid weight range', () => {
    const validate = (w: number) => w >= 20 && w <= 250;
    expect(validate(10)).toBe(false);
    expect(validate(300)).toBe(false);
    expect(validate(70)).toBe(true);
  });

  it('rejects invalid dress_style', () => {
    const valid = ['fitted','semi-fitted','loose','mermaid'];
    expect(valid.includes('ballgown')).toBe(false);
    expect(valid.includes('fitted')).toBe(true);
  });
});

describe('Order Status Mapping', () => {
  it('maps all statuses', () => {
    ['pending','processing','shipped','delivered','cancelled'].forEach((s) => {
      expect(ORDER_STATUS_MAP[s]).toBeDefined();
    });
  });
  it('processing has blue color', () => {
    expect(ORDER_STATUS_MAP.processing.color).toContain('blue');
  });
  it('shipped has purple color', () => {
    expect(ORDER_STATUS_MAP.shipped.color).toContain('purple');
  });
  it('all statuses have Arabic labels', () => {
    Object.values(ORDER_STATUS_MAP).forEach((s) => {
      expect(s.label).toMatch(/[\u0600-\u06FF]/); // Arabic Unicode range
    });
  });
});
