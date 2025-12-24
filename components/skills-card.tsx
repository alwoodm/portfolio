import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

type SkillsCardProps = Readonly<{
  name: string;
  icon?: ReactNode;
  className?: string;
}>;

export function SkillsCard({ name, icon, className }: SkillsCardProps) {
  const fallback = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className={cn(
        'border-border bg-card/60 text-foreground flex shrink-0 items-center gap-3 rounded-md border px-3 py-2 shadow-sm',
        'hover:bg-accent/70 transition-colors duration-200',
        className,
      )}
    >
      <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold">
        {icon ?? fallback}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
