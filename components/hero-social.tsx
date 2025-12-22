'use client';

import Link from 'next/link';

import AnimatedContent from '@/components/animation/animated-content';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

type HeroSocialLink = Readonly<{
  href: string;
  icon: ReactNode;
  label: string;
}>;

type HeroSocialProps = Readonly<{
  animationDelay?: number;
  animationDuration?: number;
  animationStagger?: number;
  animationDistance?: number;
  className?: string;
  links: HeroSocialLink[];
}>;

export function HeroSocial({
  animationDelay = 0,
  animationDuration = 0.45,
  animationStagger = 0.12,
  animationDistance = 24,
  className,
  links,
}: HeroSocialProps) {
  if (links.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-3 pt-6', className)} data-hero="social">
      {links.map((link, index) => {
        const delay = animationDelay + index * animationStagger;

        return (
          <AnimatedContent
            key={link.label}
            animateOpacity
            className="inline-flex"
            delay={delay}
            direction="vertical"
            distance={animationDistance}
            duration={animationDuration}
          >
            <Link
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
          </AnimatedContent>
        );
      })}
    </div>
  );
}
