'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className={cn(
        'fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex h-12 w-12 items-center justify-center rounded-full sm:right-6 sm:bottom-6 sm:h-11 sm:w-11',
        'border-border bg-background/80 text-foreground border shadow-sm backdrop-blur',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        'transition-colors duration-300 motion-reduce:transition-none',
        "after:border-foreground/30 after:absolute after:inset-0 after:rounded-full after:border after:content-['']",
        'after:pointer-events-none after:animate-[pulse-ring_2.6s_ease-out_infinite]',
        'motion-reduce:after:animate-none',
      )}
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <span className="relative h-5 w-5 sm:h-4 sm:w-4">
        <Sun className="absolute inset-0 h-5 w-5 transition-all duration-300 sm:h-4 sm:w-4 dark:scale-0 dark:rotate-90" />
        <Moon className="absolute inset-0 h-5 w-5 scale-0 rotate-90 transition-all duration-300 sm:h-4 sm:w-4 dark:scale-100 dark:rotate-0" />
      </span>
    </button>
  );
}
