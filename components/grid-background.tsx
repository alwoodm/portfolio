import { cn } from '@/lib/utils';

import type { CSSProperties, ReactNode } from 'react';

type GridBackgroundProps = Readonly<{
  children: ReactNode;
  className?: string;
  fade?: boolean;
  gridSize?: string;
}>;

export function GridBackground({
  children,
  className,
  fade = false,
  gridSize = 'clamp(44px, 12vw, 56px)',
}: GridBackgroundProps) {
  const style = { '--grid-size': gridSize } as CSSProperties;

  return (
    <div
      className={cn(
        'text-foreground relative min-h-[100svh] w-full overflow-x-hidden bg-white dark:bg-black',
        'transition-colors duration-300 motion-reduce:transition-none',
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          '[background-size:var(--grid-size)_var(--grid-size)]',
          '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
          'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]',
        )}
      />
      {fade ? (
        <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
