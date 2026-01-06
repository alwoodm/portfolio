import fs from 'node:fs/promises';
import path from 'node:path';

import { Heart, User } from 'lucide-react';

import { AboutIconItem } from '@/components/about-icon-item';
import { AboutInfoCard } from '@/components/about-info-card';
import AnimatedContent from '@/components/animation/animated-content';
import { InlineMarkdown } from '@/components/inline-markdown';
import { Badge } from '@/components/ui/badge';
import type { AboutContent } from '@/lib/about';
import { buildPageMetadata, getSeoContent, stripMarkdown } from '@/lib/seo';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

async function getAboutContent(): Promise<AboutContent> {
  const filePath = path.join(process.cwd(), 'data', 'about.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as AboutContent;
}

export async function generateMetadata(): Promise<Metadata> {
  const [content, seo] = await Promise.all([getAboutContent(), getSeoContent()]);

  return buildPageMetadata(seo, {
    title: content.title,
    description: stripMarkdown(content.description),
    path: '/about',
  });
}

export default async function AboutPage() {
  const content = await getAboutContent();
  const badgeLabel = content.badge;
  const hobbies = content.hobbies;
  const languages = content.languages;
  const gender = content.gender;
  const nationality = content.nationality;

  return (
    <main className="w-full px-6 pt-8 pb-16 sm:px-10 lg:pb-20">
      <div className="mx-auto w-full space-y-8 sm:space-y-12 md:w-[70%]">
        <section className="w-full">
          <AnimatedContent animateOpacity className="w-full" distance={40} duration={1.05}>
            <div className="flex flex-col items-start gap-4 text-left">
              <Badge className="gap-1.5" variant="secondary">
                <User className="h-4 w-4" />
                {badgeLabel}
              </Badge>
              <div className="space-y-3">
                <h1 className="text-primary text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
                  {content.title}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                  <InlineMarkdown text={content.description} />
                </p>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="grid w-full items-start gap-6 md:grid-cols-3 md:gap-8">
          <AnimatedContent
            animateOpacity
            reverse
            className="w-full md:justify-self-start"
            direction="horizontal"
            distance={56}
            duration={1.1}
          >
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-primary text-xl font-semibold sm:text-2xl">
                    {hobbies.title}
                  </h2>
                  <p className="text-muted-foreground text-sm">{hobbies.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {hobbies.items.map((hobby) => (
                  <AboutIconItem
                    key={hobby.label}
                    iconClassName="h-5 w-5"
                    iconId={hobby.iconId}
                    label={hobby.label}
                    level={hobby.level}
                  />
                ))}
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent
            animateOpacity
            className="w-full md:w-fit md:justify-self-center"
            delay={0.08}
            direction="vertical"
            distance={56}
            duration={1.1}
          >
            <AboutInfoCard
              className="w-full md:w-fit"
              iconId={languages.iconId}
              items={languages.items}
              label={languages.label}
              value={languages.value}
            />
          </AnimatedContent>

          <AnimatedContent
            animateOpacity
            className="w-full md:w-fit md:justify-self-end"
            delay={0.16}
            direction="horizontal"
            distance={56}
            duration={1.1}
          >
            <div className="flex w-full flex-col gap-6 md:w-fit">
              <AboutInfoCard
                className="w-full md:w-fit"
                iconId={gender.iconId}
                items={gender.items}
                label={gender.label}
                value={gender.value}
              />
              <AboutInfoCard
                className="w-full md:w-fit"
                iconId={nationality.iconId}
                items={nationality.items}
                label={nationality.label}
                value={nationality.value}
              />
            </div>
          </AnimatedContent>
        </section>
      </div>
    </main>
  );
}
