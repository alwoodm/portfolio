import fs from 'node:fs/promises';
import path from 'node:path';

/* eslint-disable sonarjs/deprecation */
import { Github, Linkedin } from 'lucide-react';

import { HeroIcon } from '@/components/hero-icon';
import { HeroSocial } from '@/components/hero-social';
import { HeroText } from '@/components/hero-text';

import type { ReactNode } from 'react';

type HeroSocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

type HomeContent = {
  intro: string;
  name: string;
  role: string;
  roles: string[];
  social: {
    linkedin?: string;
    github?: string;
  };
};

async function getHomeContent(): Promise<HomeContent> {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as HomeContent;
}

export default async function Home() {
  const content = await getHomeContent();

  const primaryRole = content.role;
  const secondaryRole = content.roles[0] ?? '';
  const socialLinks: HeroSocialLink[] = [];
  const linkedinUrl = content.social.linkedin;
  const githubUrl = content.social.github;

  if (linkedinUrl) {
    socialLinks.push({
      label: 'LinkedIn',
      href: linkedinUrl,
      icon: <Linkedin className="h-6 w-6" />,
    });
  }

  if (githubUrl) {
    socialLinks.push({
      label: 'GitHub',
      href: githubUrl,
      icon: <Github className="h-6 w-6" />,
    });
  }

  return (
    <main className="flex min-h-[calc(100svh-96px)] flex-col items-center justify-center px-6 sm:min-h-[calc(100svh-112px)] sm:px-10 lg:-translate-y-12">
      <div className="flex w-full max-w-6xl flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex w-full flex-col text-left lg:w-[40%]">
          <HeroText
            intro={content.intro}
            name={content.name}
            primaryRole={primaryRole}
            secondaryRole={secondaryRole}
          />
          <HeroSocial links={socialLinks} />
        </div>
        <div className="flex w-full items-center justify-center lg:w-[40%]">
          <HeroIcon
            className="h-auto w-full max-w-[360px] sm:max-w-[520px] lg:max-w-[640px]"
            title=""
          />
        </div>
      </div>
    </main>
  );
}
