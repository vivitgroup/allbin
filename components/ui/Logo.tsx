'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm:  { img: 32,  text: 'text-sm'  },
  md:  { img: 44,  text: 'text-base' },
  lg:  { img: 64,  text: 'text-xl'  },
  xl:  { img: 100, text: 'text-2xl' },
};

export default function Logo({ size = 'md', showText = true, href = '/', className, animate = false }: LogoProps) {
  const s = sizes[size];

  const logo = (
    <div className={cn('flex items-center gap-3 group cursor-pointer', className)}>
      <div className={cn(
        'relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300',
        animate && 'group-hover:scale-105 group-hover:rotate-3',
      )} style={{ width: s.img, height: s.img }}>
        <Image
          src="/logo.png"
          alt="Bin Siddiq Fabric Logo"
          width={s.img}
          height={s.img}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {showText && (
        <div className={cn('leading-tight', s.text)}>
          <div className="font-black text-gray-900 tracking-tight">Bin Siddiq</div>
          <div className="font-medium text-[#C41E3A] text-xs tracking-widest uppercase">Fabric</div>
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href}>{logo}</Link>;
  return logo;
}
