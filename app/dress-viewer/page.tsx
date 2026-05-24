import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'مصمم الفستان التفاعلي | بن صديق للأقمشة',
  description: 'صممي فستانك بألوان وموديلات متعددة مع موديل 360° واقعي — جربي قبل الشراء',
};

const DressViewer = dynamic(() => import('@/components/dress-viewer/DressViewer'), { ssr: false });

export default function DressViewerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar/>
      <main className="flex-1 py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-10 px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'var(--bs-primary)' }}>مصمم تفاعلي</p>
          <h1 className="font-black mb-2" style={{ fontSize:'clamp(1.8rem,5vw,2.8rem)', color:'var(--bs-navy)', fontFamily:'Georgia,serif' }}>
            صممي فستانك ✨
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            اختاري لون البشرة والقماش والموديل — واسحبي الموديل لتدويره 360°
          </p>
        </div>
        <DressViewer/>
      </main>
      <Footer/>
    </div>
  );
}
