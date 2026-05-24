import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'مصمم الفستان التفاعلي | Bin Siddiq Fabric',
  description: 'صممي فستانك قبل الشراء — اختاري اللون والموديل وشوفي النتيجة على موديل تفاعلي.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
