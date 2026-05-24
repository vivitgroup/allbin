import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <p className="font-playfair font-black text-8xl mb-4" style={{ color: 'var(--bs-vivid)', opacity: 0.15 }}>404</p>
          <p className="text-5xl mb-6">🧵</p>
          <h1 className="font-black text-2xl mb-3" style={{ color: 'var(--bs-deep)' }}>
            الصفحة غير موجودة
          </h1>
          <p className="text-gray-500 mb-8">
            الصفحة التي تبحثين عنها لا وجود لها أو تم نقلها
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/"         className="btn-primary">الرئيسية</Link>
            <Link href="/products" className="btn-secondary">تصفح المنتجات</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
