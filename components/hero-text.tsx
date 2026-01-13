'use client';

import TextType from '@/components/animation/text-type';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type HeroTextProps = Readonly<{
  className?: string;
  intro: string;
  name: string;
  primaryRole: string;
  secondaryRoles: string[];
  secondaryRoleDelayMs?: number;
}>;

export function HeroText({
  className,
  intro,
  name,
  primaryRole,
  secondaryRoles,
  secondaryRoleDelayMs = 0,
}: HeroTextProps) {
  const isMobile = useIsMobile();
  const nameParts = name.split(' ').filter(Boolean);
  const [firstName, ...restNames] = nameParts as [string, ...string[]];
  const lastName = restNames.join(' ');
  const typedRoles = secondaryRoles;
  const delayMs = isMobile ? Math.max(secondaryRoleDelayMs, 700) : secondaryRoleDelayMs;

  return (
    <div className={cn('flex flex-col gap-3 text-left sm:gap-4', className)} data-hero="text">
      <p
        className="text-muted-foreground text-base font-medium tracking-[0.28em] uppercase sm:text-base"
        data-hero="intro"
      >
        {intro}
      </p>
      <h1
        className="text-foreground text-6xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl xl:text-8xl"
        data-hero="name"
      >
        <span className="optical-fix-lg block" data-letter={firstName[0]}>
          {firstName}
        </span>
        {lastName ? (
          <span className="text-primary optical-fix-lg block" data-letter={lastName[0]}>
            {lastName}
          </span>
        ) : null}
      </h1>
      <p
        className="text-muted-foreground text-3xl leading-snug sm:text-3xl lg:text-4xl"
        data-hero="role"
      >
        <span className="block">
          I am a <span className="text-foreground font-semibold">{primaryRole}</span>
        </span>
        {typedRoles.length > 0 ? (
          <span className="block">
            and{' '}
            <TextType
              startOnVisible
              as="span"
              className="text-primary font-semibold"
              deletingSpeed={40}
              initialDelay={delayMs}
              pauseDuration={1200}
              text={typedRoles}
              typingSpeed={70}
            />
          </span>
        ) : null}
      </p>
    </div>
  );
}
