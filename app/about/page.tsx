import fs from 'node:fs/promises';
import path from 'node:path';

import { Heart, User } from 'lucide-react';

import { AboutIconItem } from '@/components/about-icon-item';
import { AboutInfoCard } from '@/components/about-info-card';
import AnimatedContent from '@/components/animation/animated-content';
import { InlineMarkdown } from '@/components/inline-markdown';
import { Badge } from '@/components/ui/badge';
import type { AboutContent, AboutInfoItem } from '@/lib/about';

async function getAboutContent(): Promise<AboutContent> {
  const filePath = path.join(process.cwd(), 'data', 'about.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as AboutContent;
}

const findInfoItem = (items: AboutInfoItem[], label: string) =>
  items.find((item) => item.label.toLowerCase() === label) ?? null;

export default async function AboutPage() {
  const content = await getAboutContent();
  const badgeLabel = content.badge ?? 'About';
  const personalInfo = content.personalInfo ?? [];
  const hobbies = content.hobbies ?? [];
  const languageItem = findInfoItem(personalInfo, 'languages');
  const rightItems = [
    findInfoItem(personalInfo, 'gender'),
    findInfoItem(personalInfo, 'nationality'),
  ].filter((item): item is AboutInfoItem => item !== null);

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
          {hobbies.length > 0 ? (
            <AnimatedContent
              animateOpacity
              reverse
              className="w-full"
              direction="horizontal"
              distance={56}
              duration={1.1}
            >
              <div className="space-y-4 text-left md:justify-self-start">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-foreground text-xl font-semibold sm:text-2xl">Hobbies</h2>
                    <p className="text-muted-foreground text-sm">
                      A few things I enjoy outside of work.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {hobbies.map((hobby) => (
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
          ) : null}

          {languageItem ? (
            <AnimatedContent
              animateOpacity
              className="w-fit justify-self-center"
              delay={0.08}
              direction="vertical"
              distance={56}
              duration={1.1}
            >
              <AboutInfoCard
                className="w-fit"
                iconId={languageItem.iconId}
                items={languageItem.items}
                label={languageItem.label}
                value={languageItem.value}
              />
            </AnimatedContent>
          ) : null}

          {rightItems.length > 0 ? (
            <AnimatedContent
              animateOpacity
              className="w-fit justify-self-end"
              delay={0.16}
              direction="horizontal"
              distance={56}
              duration={1.1}
            >
              <div className="flex w-fit flex-col gap-6">
                {rightItems.map((item) => (
                  <AboutInfoCard
                    key={item.label}
                    className="w-fit"
                    iconId={item.iconId}
                    items={item.items}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </AnimatedContent>
          ) : null}
        </section>
      </div>
    </main>
  );
}
