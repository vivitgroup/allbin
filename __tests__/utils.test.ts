import { describe, it, expect } from 'vitest';
import { cn, formatPrice, calculateFabric, ORDER_STATUS_MAP } from '../lib/utils';

describe('cn (className merger)', () => {
  it('merges class names correctly', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('handles conditional classes', () => {
    expect(cn('base', false && 'no', 'yes')).toBe('base yes');
  });
  it('merges tailwind conflicts correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('formatPrice', () => {
  it('returns a non-empty string', () => {
    const result = formatPrice(100);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
  it('contains currency indicator for SAR', () => {
    const result = formatPrice(100);
    // Arabic locale uses ر.س or similar
    expect(result).toMatch(/ر|SAR|SR/);
  });
  it('formats different amounts without error', () => {
    expect(() => formatPrice(0)).not.toThrow();
    expect(() => formatPrice(99999)).not.toThrow();
    expect(() => formatPrice(1.5)).not.toThrow();
  });
  it('zero produces valid output', () => {
    const result = formatPrice(0);
    expect(result).toBeTruthy();
  });
});

describe('calculateFabric', () => {
  it('returns correct structure', () => {
    const result = calculateFabric(165, 65, 'fitted');
    expect(result).toHaveProperty('meters');
    expect(result).toHaveProperty('size');
    expect(result).toHaveProperty('bmi');
  });

  it('loose style uses more fabric than fitted', () => {
    const fitted = calculateFabric(165, 65, 'fitted');
    const loose = calculateFabric(165, 65, 'loose');
    expect(loose.meters).toBeGreaterThan(fitted.meters);
  });

  it('calculates BMI correctly', () => {
    const result = calculateFabric(170, 70, 'fitted');
    const expected = 70 / Math.pow(1.70, 2);
    expect(result.bmi).toBeCloseTo(expected, 0);
  });

  it('assigns size XS for underweight BMI < 18.5', () => {
    const result = calculateFabric(170, 45, 'fitted'); // BMI ~15.6
    expect(result.size).toBe('XS');
  });

  it('assigns size M for normal weight BMI 22-25', () => {
    const result = calculateFabric(170, 70, 'fitted'); // BMI ~24.2
    expect(result.size).toBe('M');
  });

  it('assigns XXL for BMI > 32', () => {
    const result = calculateFabric(160, 90, 'fitted'); // BMI ~35
    expect(result.size).toBe('XXL');
  });

  it('meters is always positive', () => {
    const result = calculateFabric(140, 40, 'fitted');
    expect(result.meters).toBeGreaterThan(0);
  });

  it('meters is in 0.5 increments', () => {
    const result = calculateFabric(165, 65, 'fitted');
    expect(result.meters * 2 % 1).toBe(0);
  });

  it('mermaid uses more fabric than fitted', () => {
    const fitted = calculateFabric(165, 65, 'fitted').meters;
    const mermaid = calculateFabric(165, 65, 'mermaid').meters;
    expect(mermaid).toBeGreaterThanOrEqual(fitted);
  });

  it('all styles return positive meters', () => {
    ['fitted', 'semi-fitted', 'loose', 'mermaid'].forEach((style) => {
      expect(calculateFabric(165, 65, style).meters).toBeGreaterThan(0);
    });
  });
});

describe('ORDER_STATUS_MAP', () => {
  it('has all required statuses', () => {
    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].forEach((s) => {
      expect(ORDER_STATUS_MAP[s]).toBeDefined();
      expect(ORDER_STATUS_MAP[s].label).toBeTruthy();
      expect(ORDER_STATUS_MAP[s].color).toBeTruthy();
    });
  });
  it('pending has Arabic label معلق', () => {
    expect(ORDER_STATUS_MAP.pending.label).toBe('معلق');
  });
  it('delivered has green color class', () => {
    expect(ORDER_STATUS_MAP.delivered.color).toContain('green');
  });
  it('cancelled has red color class', () => {
    expect(ORDER_STATUS_MAP.cancelled.color).toContain('red');
  });
});
