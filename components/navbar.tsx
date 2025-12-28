'use client';

import { Briefcase, Folder, Home, Mail, Sparkles, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import Dock, { type DockItemData } from '@/components/dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { href: '/about', label: 'About', icon: <User className="h-4 w-4" /> },
  { href: '/skills', label: 'Skills', icon: <Sparkles className="h-4 w-4" /> },
  { href: '/career', label: 'Career', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/projects', label: 'Projects', icon: <Folder className="h-4 w-4" /> },
  { href: '/contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const items: DockItemData[] = NAV_ITEMS.map((item) => {
    const isActive = pathname === item.href;

    return {
      ...item,
      onClick: () => router.push(item.href),
      className: cn(
        'transition-[box-shadow,border-color] duration-200',
        isActive ? 'border-primary ring-2 ring-primary/60' : '',
      ),
    };
  });

  const baseItemSize = isMobile ? 40 : 44;
  const magnification = isMobile ? 40 : 62;
  const distance = isMobile ? 120 : 170;
  const panelHeight = isMobile ? 60 : 64;
  const gapClassName = isMobile ? 'gap-2' : 'gap-3';
  const panelClassName = cn(
    gapClassName,
    isMobile ? 'w-full max-w-[360px] px-2 justify-between' : '',
  );

  return (
    <div className="pointer-events-none fixed top-[env(safe-area-inset-top)] right-0 left-0 z-40 flex justify-center py-4">
      <Dock
        baseItemSize={baseItemSize}
        className={panelClassName}
        containerClassName="pointer-events-auto"
        distance={distance}
        items={items}
        magnification={magnification}
        panelHeight={panelHeight}
        position="top"
      />
    </div>
  );
}
