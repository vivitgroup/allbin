'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/Sidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bs-pearl)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-white"
          style={{ borderColor: 'rgba(184,184,184,0.2)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-black/5"
            style={{ color: 'var(--bs-deep)' }}
            aria-label="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white shadow-sm">
              <Image src="/logo.png" alt="بن صديق" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-sm" style={{ color: 'var(--bs-deep)' }}>لوحة التحكم</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
