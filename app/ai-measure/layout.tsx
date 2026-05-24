import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'حاسبة القماش الذكية | Bin Siddiq Fabric',
  description: 'احسبي كمية القماش المناسبة لفستانك بدقة بناءً على طولك ووزنك وموديل الفستان.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
