'use client';

import { Icon, loadIcon, type IconifyIcon } from '@iconify/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ContactDetailItemProps = Readonly<{
  iconId?: string;
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}>;

type IconState = Readonly<{
  id: string;
  data: IconifyIcon | null;
}>;

export function ContactDetailItem({
  iconId,
  label,
  children,
  className,
  labelClassName,
}: ContactDetailItemProps) {
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

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {activeIcon ? (
        <Icon
          aria-hidden
          className="text-muted-foreground h-5 w-5"
          height="unset"
          icon={activeIcon}
          width="unset"
        />
      ) : null}
      <div className="space-y-2 text-left">
        <span
          className={cn(
            'text-muted-foreground text-xs font-semibold tracking-[0.32em] uppercase',
            labelClassName,
          )}
        >
          {label}
        </span>
        <div>{children}</div>
      </div>
    </div>
  );
}
