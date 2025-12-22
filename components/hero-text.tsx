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
    <div className={cn('flex flex-col gap-4', className)} data-hero="text">
      <p
        className="text-muted-foreground text-xl font-medium tracking-[0.28em] uppercase"
        data-hero="intro"
      >
        {intro}
      </p>
      <h1
        className="text-foreground text-[4rem] leading-[0.99] font-semibold text-balance sm:text-[4.75rem] lg:text-[4.75rem] xl:text-[6.25rem]"
        data-hero="name"
      >
        {firstName}
        {lastName ? (
          <>
            <br />
            {lastName}
          </>
        ) : null}
      </h1>
      {primaryRole ? (
        <p className="text-muted-foreground text-3xl sm:text-4xl" data-hero="role">
          I am a <span className="text-foreground font-semibold">{primaryRole}</span>
          {typedRoles.length > 0 ? (
            <>
              <br />
              and{' '}
              <TextType
                startOnVisible
                as="span"
                className="text-foreground font-semibold"
                deletingSpeed={40}
                initialDelay={secondaryRoleDelayMs ?? 0}
                pauseDuration={1200}
                text={typedRoles}
                typingSpeed={70}
              />
            </>
          ) : null}
          .
        </p>
      ) : null}
    </div>
  );
}
