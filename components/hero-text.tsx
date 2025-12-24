'use client';

import TextType from '@/components/animation/text-type';
import { cn } from '@/lib/utils';

type HeroTextProps = Readonly<{
  className?: string;
  intro: string;
  name: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  secondaryRoleDelayMs?: number;
}>;

export function HeroText({
  className,
  intro,
  name,
  primaryRole,
  secondaryRoles,
  secondaryRoleDelayMs,
}: HeroTextProps) {
  const nameParts = name.split(' ').filter(Boolean);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');
  const typedRoles = secondaryRoles?.filter(Boolean) ?? [];

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)} data-hero="text">
      <p
        className="text-muted-foreground text-sm font-medium tracking-[0.28em] uppercase sm:text-base"
        data-hero="intro"
      >
        {intro}
      </p>
      <h1
        className="text-foreground text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl xl:text-8xl"
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
      {primaryRole ? (
        <p
          className="text-muted-foreground text-2xl leading-snug sm:text-3xl lg:text-4xl"
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
                initialDelay={secondaryRoleDelayMs ?? 0}
                pauseDuration={1200}
                text={typedRoles}
                typingSpeed={70}
              />
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
