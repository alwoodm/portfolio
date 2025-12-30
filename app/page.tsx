import fs from 'node:fs/promises';
import path from 'node:path';

/* eslint-disable sonarjs/deprecation */
import { Github, Linkedin } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { HeroIcon } from '@/components/hero-icon';
import { HeroSocial } from '@/components/hero-social';
import { HeroText } from '@/components/hero-text';
import type { HomeContent } from '@/lib/home';

import type { ReactNode } from 'react';

type HeroSocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

async function getHomeContent(): Promise<HomeContent> {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as HomeContent;
}

export default async function Home() {
  const content = await getHomeContent();

  const socialLinks: HeroSocialLink[] = [
    {
      label: 'LinkedIn',
      href: content.social.linkedin,
      icon: <Linkedin className="h-6 w-6" />,
    },
    {
      label: 'GitHub',
      href: content.social.github,
      icon: <Github className="h-6 w-6" />,
    },
  ];

  const leftColumnDelay = 0.12;
  const leftColumnDuration = 0.9;
  const socialDelay = leftColumnDelay + leftColumnDuration;
  const socialStagger = 0.12;
  const socialDuration = 0.45;
  const socialSequenceDuration =
    socialLinks.length > 0 ? socialDuration + socialStagger * (socialLinks.length - 1) : 0;
  const typingDelayMs = Math.round((socialDelay + socialSequenceDuration) * 1000);

  return (
    <main className="flex min-h-[calc(100svh-96px)] flex-col items-center justify-center px-6 sm:min-h-[calc(100svh-112px)] sm:px-10 lg:-translate-y-12">
      <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <AnimatedContent
          animateOpacity
          reverse
          className="w-full lg:justify-self-end"
          delay={leftColumnDelay}
          direction="horizontal"
          distance={72}
          duration={leftColumnDuration}
        >
          <div className="flex w-full max-w-xl flex-col items-start text-left">
            <HeroText
              intro={content.intro}
              name={content.name}
              primaryRole={content.role}
              secondaryRoleDelayMs={typingDelayMs}
              secondaryRoles={content.roles}
            />
            <HeroSocial
              animationDelay={socialDelay}
              animationDuration={socialDuration}
              animationStagger={socialStagger}
              links={socialLinks}
            />
          </div>
        </AnimatedContent>
        <AnimatedContent
          animateOpacity
          className="flex w-full items-center justify-center lg:justify-self-start"
          delay={0.18}
          direction="horizontal"
          distance={88}
          duration={1}
        >
          <HeroIcon
            className="h-auto w-full max-w-[432px] sm:max-w-[624px] lg:max-w-[720px]"
            title=""
          />
        </AnimatedContent>
      </div>
    </main>
  );
}
