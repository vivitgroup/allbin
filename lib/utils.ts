import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateFabric(
  heightCm: number,
  weightKg: number,
  style: string
): { meters: number; size: string; bmi: number } {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const dressLength = heightCm * 0.65;
  let baseMeters = (dressLength / 100) * 2;

  const multipliers: Record<string, number> = {
    fitted: 1.0,
    'semi-fitted': 1.2,
    loose: 1.5,
    mermaid: 1.35,
  };
  baseMeters *= multipliers[style] || 1.0;

  const meters = Math.ceil(baseMeters * 2) / 2;

  let size = 'M';
  if (bmi < 18.5) size = 'XS';
  else if (bmi < 22) size = 'S';
  else if (bmi < 25) size = 'M';
  else if (bmi < 28) size = 'L';
  else if (bmi < 32) size = 'XL';
  else size = 'XXL';

  return { meters, size, bmi: parseFloat(bmi.toFixed(1)) };
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:    { label: 'معلق',       color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'قيد التجهيز', color: 'bg-blue-100 text-blue-700'   },
  shipped:    { label: 'تم الشحن',   color: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'تم التوصيل', color: 'bg-green-100 text-green-700'  },
  cancelled:  { label: 'ملغي',       color: 'bg-red-100 text-red-700'      },
};
