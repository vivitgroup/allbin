import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'مستشارة الأقمشة الذكية سدى | بن صديق',
  description: 'تحدثي مع سدى — مستشارتنا الذكية للأقمشة. نصائح حول القماش المناسب، الألوان، الكميات، والمناسبات.',
};

const ChatFull = dynamic(() => import('@/components/chat/ChatFull'), { ssr: false });

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 page-container">
        <div className="text-center mb-8">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--bs-vivid)' }}>مساعدة فورية</p>
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: 'var(--bs-deep)' }}>
            سدى — مستشارتك الذكية ✂️
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">خبيرة أقمشة بخبرة 20 سنة في المملكة. اسأليها عن أي شيء!</p>
        </div>
        <ChatFull />
      </main>
      <Footer />
    </div>
  );
}
