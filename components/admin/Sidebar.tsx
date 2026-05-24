'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Video, LogOut, ExternalLink, X, Edit3 } from 'lucide-react';

const MENU = [
  { href:'/dashboard',                 label:'الرئيسية',       icon:LayoutDashboard },
  { href:'/dashboard/site-editor',     label:'محرر الموقع',    icon:Edit3 },
  { href:'/dashboard/products',        label:'المنتجات',        icon:Package },
  { href:'/dashboard/orders',          label:'الطلبات',         icon:ShoppingCart },
  { href:'/dashboard/analytics',       label:'التحليلات',       icon:BarChart3 },
  { href:'/dashboard/streaming',       label:'البث المباشر',    icon:Video },
  { href:'/dashboard/settings',        label:'الإعدادات',       icon:Settings },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const isActive = (href: string) => href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 h-full flex flex-col" style={{ background: 'var(--bs-navy)' }}>
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor:'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/95 p-0.5 shadow-lg flex-shrink-0">
            <Image src="/logo.jpg" alt="Bin Siddiq Fabrics" width={40} height={40} className="w-full h-full object-contain"/>
          </div>
          <div>
            <p className="font-black text-white text-sm leading-none">Bin Siddiq</p>
            <p className="text-[10px] tracking-widest uppercase font-bold mt-0.5" style={{ color:'var(--bs-primary)' }}>ADMIN</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4"/>
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {MENU.map(item => {
          const Icon   = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-semibold"
              style={{
                background: active ? 'var(--bs-grad)' : 'transparent',
                color:      active ? 'white' : 'rgba(255,255,255,0.5)',
                boxShadow:  active ? '0 4px 14px rgba(245,166,35,0.35)' : 'none',
              }}>
              <Icon style={{ width:18, height:18, flexShrink:0 }}/>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t space-y-0.5" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/8"
          style={{ color:'rgba(255,255,255,0.4)' }}>
          <ExternalLink style={{ width:18, height:18 }}/><span>عرض الموقع</span>
        </Link>
        <button onClick={() => router.push('/login')}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium transition-all hover:bg-red-900/30"
          style={{ color:'rgba(255,255,255,0.4)' }}>
          <LogOut style={{ width:18, height:18 }}/><span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
