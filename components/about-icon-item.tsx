'use client';

import { Icon, loadIcon, type IconifyIcon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

import type { AboutListItem } from '@/lib/about';
import { cn } from '@/lib/utils';

type AboutIconItemProps = AboutListItem &
  Readonly<{
    className?: string;
    iconClassName?: string;
    labelClassName?: string;
    levelClassName?: string;
    align?: 'left' | 'center' | 'right';
  }>;

type IconState = Readonly<{
  id: string;
  data: IconifyIcon | null;
}>;

export function AboutIconItem({
  label,
  iconId,
  level,
  className,
  iconClassName,
  labelClassName,
  levelClassName,
  align = 'left',
}: AboutIconItemProps) {
  const [iconState, setIconState] = useState<IconState>({ id: '', data: null });
  const resolvedIcon = useMemo(() => iconId ?? '', [iconId]);

  useEffect(() => {
    let isActive = true;

    if (!resolvedIcon) {
      return () => {
        isActive = false;
      };
    }

    loadIcon(resolvedIcon)
      .then((icon) => {
        if (!isActive) return;
        setIconState({ id: resolvedIcon, data: icon });
      })
      .catch(() => {
        if (!isActive) return;
        setIconState({ id: resolvedIcon, data: null });
      });

    return () => {
      isActive = false;
    };
  }, [resolvedIcon]);

  const activeIcon = iconState.id === resolvedIcon ? iconState.data : null;

  const alignClasses = {
    left: {
      container: 'items-start text-left',
      row: 'justify-start',
    },
    center: {
      container: 'items-center text-center',
      row: 'justify-center',
    },
    right: {
      container: 'items-end text-right',
      row: 'justify-end',
    },
  } as const;

  const alignment = alignClasses[align];

  return (
    <div className={cn('text-foreground/80 flex gap-3', alignment.container, className)}>
      {activeIcon ? (
        <Icon
          aria-hidden
          className={cn('h-5 w-5', iconClassName)}
          height="unset"
          icon={activeIcon}
          width="unset"
        />
      ) : null}
      <div className="space-y-1">
        <div className={cn('flex flex-wrap items-center gap-2', alignment.row)}>
          <span className={cn('text-sm font-medium', labelClassName)}>{label}</span>
          {level ? (
            <span
              className={cn(
                'border-primary/40 text-primary/80 rounded-full border px-2 py-0.5 text-xs font-semibold tracking-[0.08em] uppercase',
                levelClassName,
              )}
            >
              {level}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
