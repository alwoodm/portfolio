import fs from 'node:fs/promises';
import path from 'node:path';

import { Heart, User } from 'lucide-react';

import { AboutIconItem, type AboutIconItemData } from '@/components/about-icon-item';
import { AboutInfoCard } from '@/components/about-info-card';
import AnimatedContent from '@/components/animation/animated-content';
import { Badge } from '@/components/ui/badge';

import type { ReactNode } from 'react';

type AboutInfoItem = {
  label: string;
  iconId: string;
  value?: string;
  items?: AboutIconItemData[];
};

type AboutContent = {
  badge?: string;
  title: string;
  description: string;
  personalInfo: AboutInfoItem[];
  hobbies: AboutIconItemData[];
};

const MARKDOWN_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

function renderInlineMarkdown(text: string): ReactNode[] {
  if (!text) return [];

  return text
    .split(MARKDOWN_PATTERN)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${index}`} className="text-primary font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em
            key={`italic-${index}`}
            className="text-primary/80 decoration-primary/40 italic underline decoration-2 underline-offset-4"
          >
            {part.slice(1, -1)}
          </em>
        );
      }

      return <span key={`text-${index}`}>{part}</span>;
    });
}

async function getAboutContent(): Promise<AboutContent> {
  const filePath = path.join(process.cwd(), 'data', 'about.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as AboutContent;
}

export default async function AboutPage() {
  const content = await getAboutContent();
  const badgeLabel = content.badge ?? 'About';
  const personalInfo = content.personalInfo ?? [];
  const languageItem =
    personalInfo.find((item) => item.label.toLowerCase() === 'languages') ?? null;
  const genderItem = personalInfo.find((item) => item.label.toLowerCase() === 'gender') ?? null;
  const nationalityItem =
    personalInfo.find((item) => item.label.toLowerCase() === 'nationality') ?? null;
  const rightItems = [genderItem, nationalityItem].filter(
    (item): item is AboutInfoItem => item !== null,
  );
  const hobbies = content.hobbies ?? [];

  return (
    <main className="w-full px-6 pt-8 pb-16 sm:px-10 lg:pb-20">
      <div className="mx-auto w-full space-y-8 sm:space-y-12 md:w-[70%]">
        <section className="w-full">
          <AnimatedContent animateOpacity className="w-full" distance={32} duration={0.8}>
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
                  {renderInlineMarkdown(content.description)}
                </p>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="grid w-full items-start gap-6 md:grid-cols-3 md:gap-8">
          {hobbies.length > 0 ? (
            <AnimatedContent animateOpacity className="w-full" distance={28} duration={0.8}>
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
                    <AboutIconItem key={hobby.label} iconClassName="h-5 w-5" {...hobby} />
                  ))}
                </div>
              </div>
            </AnimatedContent>
          ) : null}

          {languageItem ? (
            <AnimatedContent
              animateOpacity
              className="w-fit justify-self-center"
              delay={0.12}
              distance={32}
              duration={0.8}
            >
              <AboutInfoCard
                key={languageItem.label}
                className="w-fit"
                iconId={languageItem.iconId}
                items={languageItem.items}
                label={languageItem.label}
                value={languageItem.value}
              />
            </AnimatedContent>
          ) : null}

          <AnimatedContent
            animateOpacity
            className="w-fit justify-self-end"
            delay={0.18}
            distance={32}
            duration={0.8}
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
        </section>
      </div>
    </main>
  );
}
