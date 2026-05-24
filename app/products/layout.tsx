import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المنتجات | Bin Siddiq Fabric',
  description: 'تصفحي أكثر من 500 نوع قماش فاخر — جورجيت، ساتان، شيفون، حرير، قطن وأكثر. أسعار تنافسية وشحن سريع لجميع مناطق المملكة.',
  openGraph: {
    title:       'أقمشة فاخرة | Bin Siddiq Fabric',
    description: 'تشكيلة واسعة من أجود الأقمشة بأسعار مناسبة',
    type:        'website',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
