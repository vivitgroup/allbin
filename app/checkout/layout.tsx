import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'إتمام الشراء | بن صديق للأقمشة',
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
