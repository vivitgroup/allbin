import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'حاسبة القماش الذكية | Bin Siddiq Fabric',
  description: 'احسبي كمية القماش المناسبة لفستانك بدقة — أدخلي طولك ووزنك وموديل الفستان.',
};

const AICalculator = dynamic(() => import('@/components/ai-measure/AICalculator'), {
  loading: () => (
    <div className="flex items-center justify-center py-32">
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
           style={{ borderColor: 'var(--bs-silver)', borderTopColor: 'var(--bs-vivid)' }} />
    </div>
  ),
  ssr: false,
});

export default function AIMeasurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--bs-vivid)' }}>
            مدعوم بالذكاء الاصطناعي
          </p>
          <h1 className="font-playfair font-black mb-3" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: 'var(--bs-deep)' }}>
            حاسبة القماش الذكية
          </h1>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            أدخلي مقاساتك واعرفي كمية القماش اللازمة لفستانك بدقة تامة
          </p>
        </div>
        <AICalculator />
      </main>
      <Footer />
    </div>
  );
}
