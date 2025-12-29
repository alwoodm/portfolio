'use client';

import { Icon, loadIcon, type IconifyIcon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

import { AboutIconItem } from '@/components/about-icon-item';
import type { AboutListItem } from '@/lib/about';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

type AboutInfoCardProps = Readonly<{
  label: string;
  value?: string;
  iconId: string;
  items?: AboutListItem[];
  align?: 'left' | 'center' | 'right';
  className?: string;
}>;

type IconState = Readonly<{
  id: string;
  data: IconifyIcon | null;
}>;

const ALIGN_CLASSES = {
  left: {
    container: 'items-start text-left',
    header: 'justify-start',
    item: '',
  },
  center: {
    container: 'items-center text-center',
    header: 'justify-center',
    item: 'w-full items-center justify-center text-center',
  },
  right: {
    container: 'items-end text-right',
    header: 'justify-end',
    item: 'w-full justify-end text-right',
  },
} as const;

export function AboutInfoCard({
  label,
  value,
  iconId,
  items,
  align = 'left',
  className,
}: AboutInfoCardProps) {
  const [iconState, setIconState] = useState<IconState>({ id: '', data: null });
  const resolvedIcon = useMemo(() => iconId ?? '', [iconId]);
  const alignClasses = ALIGN_CLASSES[align];

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
  let content: ReactNode = null;

  if (items && items.length > 0) {
    content = (
      <div className="space-y-2">
        {items.map((item) => (
          <AboutIconItem
            key={`${label}-${item.label}`}
            align={align}
            className={alignClasses.item}
            iconId={item.iconId}
            label={item.label}
            labelClassName="text-base"
            level={item.level}
            levelClassName="text-xs"
          />
        ))}
      </div>
    );
  } else if (value) {
    content = <p className="text-foreground/80 text-lg font-medium">{value}</p>;
  }

  return (
    <div className={cn('flex w-full flex-col gap-3', alignClasses.container, className)}>
      <div className={cn('text-primary flex w-full items-center gap-4', alignClasses.header)}>
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
          {activeIcon ? (
            <Icon aria-hidden className="h-7 w-7" height="unset" icon={activeIcon} width="unset" />
          ) : null}
        </div>
        <h3 className="text-primary text-xl font-semibold">{label}</h3>
      </div>
      {content}
    </div>
  );
}
