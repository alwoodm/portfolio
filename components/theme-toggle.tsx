'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => setIsAnimating(false), 500);
    return () => globalThis.clearTimeout(timeoutId);
  }, [isAnimating]);

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
    setIsAnimating(true);
  };

  return (
    <button
      aria-label="Toggle theme"
      className={cn(
        'fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex h-12 w-12 items-center justify-center rounded-full sm:right-6 sm:bottom-6 sm:h-11 sm:w-11',
        'border-border bg-background/80 text-foreground border shadow-sm backdrop-blur',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        'transition-[transform,box-shadow,background-color,color] duration-300 motion-reduce:transition-none',
        'active:scale-95 motion-reduce:active:scale-100',
        isAnimating && 'shadow-primary/20 scale-95 shadow-md',
        "after:border-foreground/30 after:absolute after:inset-0 after:rounded-full after:border after:content-['']",
        'after:pointer-events-none after:animate-[pulse-ring_2.6s_ease-out_infinite]',
        'motion-reduce:after:animate-none',
      )}
      type="button"
      onClick={handleToggle}
    >
      <span
        className={cn(
          'relative h-5 w-5 sm:h-4 sm:w-4',
          isAnimating && 'animate-[spin_0.6s_ease-out]',
        )}
      >
        <Sun className="absolute inset-0 h-5 w-5 transition-all duration-500 ease-out sm:h-4 sm:w-4 dark:scale-0 dark:rotate-90" />
        <Moon className="absolute inset-0 h-5 w-5 scale-0 rotate-90 transition-all duration-500 ease-out sm:h-4 sm:w-4 dark:scale-100 dark:rotate-0" />
      </span>
    </button>
  );
}
