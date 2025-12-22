'use client';

import TextType from '@/components/animation/text-type';
import { cn } from '@/lib/utils';

type HeroTextProps = Readonly<{
  className?: string;
  intro: string;
  name: string;
  primaryRole?: string;
  secondaryRoles?: string[];
}>;

export function HeroText({ className, intro, name, primaryRole, secondaryRoles }: HeroTextProps) {
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
        className="text-foreground text-6xl leading-tight font-semibold text-balance sm:text-7xl lg:text-7xl xl:text-8xl"
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
                as="span"
                className="text-foreground font-semibold"
                deletingSpeed={40}
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
