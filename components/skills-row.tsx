import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

type SkillsRowProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function SkillsRow({ children, className }: SkillsRowProps) {
  return <div className={cn('flex w-full gap-3 overflow-x-auto pb-2', className)}>{children}</div>;
}
