import fs from 'node:fs/promises';
import path from 'node:path';

import { Sparkles } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { SkillsSection, type SkillsItem } from '@/components/skills-section';
import { Badge } from '@/components/ui/badge';

type SkillCategory = {
  title: string;
  items: SkillsItem[];
};

type Skills = {
  badge?: string;
  title: string;
  description: string;
  categories: SkillCategory[];
};

async function getSkills(): Promise<Skills> {
  const filePath = path.join(process.cwd(), 'data', 'skills.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as Skills;
}

export default async function SkillsPage() {
  const skills = await getSkills();
  const badgeLabel = skills.badge ?? 'Skills';
  let maxItems = 1;
  for (const category of skills.categories) {
    maxItems = Math.max(maxItems, category.items.length);
  }
  const cardSize = 112;
  const cardGap = 12;
  // Keep in sync with SkillsCard size (w-28) and row gap (gap-3).
  const maxRowWidth = maxItems * cardSize + (maxItems - 1) * cardGap;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-8 pb-12 sm:px-10 lg:pb-16">
      <div className="mx-auto w-full space-y-10" style={{ maxWidth: maxRowWidth }}>
        <AnimatedContent animateOpacity className="w-full" distance={32} duration={0.8}>
          <div className="flex flex-col items-start space-y-4 text-left">
            <Badge className="gap-1.5" variant="secondary">
              <Sparkles className="h-4 w-4" />
              {badgeLabel}
            </Badge>
            <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">{skills.title}</h1>
            <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
              {skills.description}
            </p>
          </div>
        </AnimatedContent>
        <div className="space-y-8 sm:space-y-10">
          {skills.categories.map((category, index) => (
            <AnimatedContent
              key={category.title}
              animateOpacity
              delay={0.1 + index * 0.08}
              distance={28}
              duration={0.7}
            >
              <SkillsSection items={category.items} title={category.title} />
            </AnimatedContent>
          ))}
        </div>
      </div>
    </main>
  );
}
