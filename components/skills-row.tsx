'use client';

import { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LogoLoop } from '@/components/animation/logo-loop';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type SkillsRowProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function SkillsRow({ children, className }: SkillsRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const items = useMemo(() => Children.toArray(children), [children]);
  const showLoop = isOverflowing && !reduceMotion;

  const checkOverflow = useCallback(() => {
    const container = containerRef.current;
    const list = listRef.current;
    if (container && list) {
      const listWidth = list.getBoundingClientRect().width;
      const containerWidth = container.clientWidth;
      setIsOverflowing(listWidth > containerWidth + 1);
    }
  }, []);

  useEffect(() => {
    const windowRef = globalThis.window;
    if (!windowRef) return;

    const mediaReduce = windowRef.matchMedia(REDUCE_MOTION_QUERY);
    const updateMedia = () => {
      setReduceMotion(mediaReduce.matches);
    };

    updateMedia();
    mediaReduce.addEventListener('change', updateMedia);

    return () => {
      mediaReduce.removeEventListener('change', updateMedia);
    };
  }, []);

  useEffect(() => {
    const windowRef = globalThis.window;
    const container = containerRef.current;
    if (windowRef && container) {
      const handleResize = () => {
        checkOverflow();
      };

      let resizeObserver: ResizeObserver | undefined;
      if (globalThis.ResizeObserver) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
      } else {
        windowRef.addEventListener('resize', handleResize);
      }

      const rafId = windowRef.requestAnimationFrame(() => checkOverflow());

      return () => {
        windowRef.cancelAnimationFrame(rafId);
        resizeObserver?.disconnect();
        windowRef.removeEventListener('resize', handleResize);
      };
    }
  }, [checkOverflow, items]);

  useEffect(() => {
    checkOverflow();
  }, [checkOverflow, reduceMotion, items]);

  const renderItems = (prefix: string) =>
    items.map((child, index) => (
      <div key={`${prefix}-${index}`} className="flex">
        {child}
      </div>
    ));

  const logoItems = useMemo(
    () =>
      items.map((child) => ({
        node: child,
      })),
    [items],
  );

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={containerRef}
        className={cn(
          'relative w-full pb-2',
          showLoop ? 'overflow-hidden' : 'overflow-x-auto',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {showLoop ? (
          <LogoLoop
            pauseOnHover
            ariaLabel="Skills list"
            className="w-full"
            gap={12}
            logos={logoItems}
            speed={60}
          />
        ) : (
          <div className="flex w-max shrink-0 gap-3">{renderItems('base')}</div>
        )}
      </div>
      <div className="pointer-events-none invisible absolute inset-0">
        <div ref={listRef} className="flex w-max gap-3">
          {renderItems('measure')}
        </div>
      </div>
      {isOverflowing ? (
        <>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent" />
        </>
      ) : null}
    </div>
  );
}
