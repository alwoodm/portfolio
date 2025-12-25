'use client';

import { Icon, loadIcon, type IconifyIcon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

type SkillsCardProps = Readonly<{
  name: string;
  iconId?: string;
  className?: string;
}>;

type IconState = Readonly<{
  id: string;
  data: IconifyIcon | null;
}>;

export function SkillsCard({ name, iconId, className }: SkillsCardProps) {
  const [iconState, setIconState] = useState<IconState>({
    id: '',
    data: null,
  });
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
        setIconState({
          id: resolvedIcon,
          data: icon,
        });
      })
      .catch(() => {
        if (!isActive) return;
        setIconState({
          id: resolvedIcon,
          data: null,
        });
      });

    return () => {
      isActive = false;
    };
  }, [resolvedIcon]);

  const activeIcon = iconState.id === resolvedIcon ? iconState.data : null;

  return (
    <div
      className={cn(
        'border-border bg-card/60 text-foreground flex shrink-0 items-center rounded-md border px-3 py-2 shadow-sm',
        'hover:bg-accent/70 transition-colors duration-200',
        activeIcon ? 'gap-3' : 'gap-0',
        className,
      )}
    >
      {activeIcon ? (
        <div
          aria-hidden
          className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold"
        >
          <Icon className="h-4 w-4" height="unset" icon={activeIcon} width="unset" />
        </div>
      ) : null}
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
