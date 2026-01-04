import fs from 'node:fs/promises';
import path from 'node:path';

import { Briefcase } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { CareerItem } from '@/components/career-item';
import { Badge } from '@/components/ui/badge';
import type { CareerContent } from '@/lib/career';

export const dynamic = 'force-static';

async function getCareerContent(): Promise<CareerContent> {
  const filePath = path.join(process.cwd(), 'data', 'career.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as CareerContent;
}

export default async function CareerPage() {
  const content = await getCareerContent();
  const timeline = content.timeline;

  return (
    <main className="w-full px-6 pt-8 pb-16 sm:px-10 lg:pb-20">
      <div className="mx-auto w-full space-y-10 sm:space-y-12 md:w-[70%]">
        <section className="w-full">
          <AnimatedContent animateOpacity className="w-full" distance={32} duration={0.9}>
            <div className="flex flex-col items-start gap-4 text-left">
              <Badge className="gap-1.5" variant="secondary">
                <Briefcase className="h-4 w-4" />
                {content.badge}
              </Badge>
              <div className="space-y-3">
                <h1 className="text-primary text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
                  {content.title}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                  {content.description}
                </p>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="flex w-full flex-col">
          {timeline.map((item, index) => (
            <CareerItem
              key={`${item.period}-${item.company}`}
              delay={0.2 + index * 0.08}
              isLast={index === timeline.length - 1}
              item={item}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
