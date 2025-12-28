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
        'border-border bg-card/60 text-foreground flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border text-center shadow-sm',
        'hover:bg-accent/70 transition-colors duration-200',
        className,
      )}
    >
      {activeIcon ? (
        <Icon
          aria-hidden
          className="text-muted-foreground h-12 w-12"
          height="unset"
          icon={activeIcon}
          width="unset"
        />
      ) : null}
      <span className="text-xs leading-tight font-medium">{name}</span>
    </div>
  );
}
