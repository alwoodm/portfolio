import { cn } from '@/lib/utils';

type HeroTextProps = Readonly<{
  className?: string;
  intro: string;
  name: string;
  primaryRole?: string;
  secondaryRole?: string;
}>;

export function HeroText({ className, intro, name, primaryRole, secondaryRole }: HeroTextProps) {
  const nameParts = name.split(' ').filter(Boolean);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className={cn('flex flex-col gap-4', className)} data-hero="text">
      <p
        className="text-muted-foreground text-lg font-medium tracking-[0.28em] uppercase"
        data-hero="intro"
      >
        {intro}
      </p>
      <h1
        className="text-foreground text-6xl leading-tight font-semibold text-balance sm:text-7xl lg:text-8xl"
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
        <p className="text-muted-foreground text-2xl sm:text-3xl" data-hero="role">
          I am a <span className="text-foreground font-semibold">{primaryRole}</span>
          {secondaryRole ? (
            <>
              <br />
              and <span className="text-foreground font-semibold">{secondaryRole}</span>
            </>
          ) : null}
          .
        </p>
      ) : null}
    </div>
  );
}
