import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

type HeroSocialLink = Readonly<{
  href: string;
  icon: ReactNode;
  label: string;
}>;

type HeroSocialProps = Readonly<{
  className?: string;
  links: HeroSocialLink[];
}>;

export function HeroSocial({ className, links }: HeroSocialProps) {
  if (links.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-3 pt-2', className)} data-hero="social">
      {links.map((link) => (
        <Link
          key={link.label}
          aria-label={link.label}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'bg-background/95 text-foreground hover:bg-background h-12 w-12 shadow-md',
          )}
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          {link.icon}
        </Link>
      ))}
    </div>
  );
}
