import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | بن صديق للأقمشة',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 page-container max-w-3xl">
        <h1 className="font-black text-3xl mb-6" style={{ color: 'var(--bs-deep)' }}>سياسة الخصوصية</h1>
        <div className="card p-8 space-y-6 text-sm leading-relaxed" style={{ color: '#5a4a44' }}>
          <section>
            <h2 className="font-black text-lg mb-2" style={{ color: 'var(--bs-deep)' }}>1. المعلومات التي نجمعها</h2>
            <p>نجمع المعلومات التي تقدمينها عند: إنشاء حساب، إتمام طلب شراء، التواصل معنا، أو الاشتراك في النشرة الإلكترونية.</p>
          </section>
          <section>
            <h2 className="font-black text-lg mb-2" style={{ color: 'var(--bs-deep)' }}>2. كيف نستخدم المعلومات</h2>
            <p>نستخدم بياناتك لمعالجة الطلبات، التواصل معك، تحسين خدماتنا، وإرسال عروض مناسبة (بموافقتك).</p>
          </section>
          <section>
            <h2 className="font-black text-lg mb-2" style={{ color: 'var(--bs-deep)' }}>3. ملفات الارتباط (Cookies)</h2>
            <p>نستخدم ملفات الارتباط لتحليل الأداء (Google Analytics)، الإعلانات (Meta Pixel، TikTok Pixel، Snapchat Pixel)، وتحسين تجربة التسوق.</p>
          </section>
          <section>
            <h2 className="font-black text-lg mb-2" style={{ color: 'var(--bs-deep)' }}>4. الدفع والأمان</h2>
            <p>جميع معاملات الدفع تتم عبر بوابات معتمدة (Moyasar, Geidea) وفق معايير PCI DSS. لا نحتفظ ببيانات بطاقتك.</p>
          </section>
          <section>
            <h2 className="font-black text-lg mb-2" style={{ color: 'var(--bs-deep)' }}>5. حقوقك</h2>
            <p>يحق لكِ طلب حذف بياناتك أو تعديلها في أي وقت. تواصلي معنا على: info@binsiddiq.com</p>
          </section>
          <p className="text-xs pt-4 border-t" style={{ borderColor: 'rgba(184,184,184,0.2)', color: 'var(--bs-silver)' }}>
            آخر تحديث: يناير 2025 — بن صديق للأقمشة الفاخرة، ينبع، المملكة العربية السعودية
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
