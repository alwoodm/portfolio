import fs from 'node:fs/promises';
import path from 'node:path';

import { Layers } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { Badge } from '@/components/ui/badge';
import type { ProjectsContent } from '@/lib/projects';

async function getProjects(): Promise<ProjectsContent> {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as ProjectsContent;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="w-full px-6 pt-8 pb-16 sm:px-10 lg:pb-20">
      <div className="mx-auto w-full space-y-10 sm:space-y-12 md:w-[70%]">
        <section className="w-full">
          <AnimatedContent animateOpacity className="w-full" distance={32} duration={0.9}>
            <div className="flex flex-col items-start gap-4 text-left">
              <Badge className="gap-1.5" variant="secondary">
                <Layers className="h-4 w-4" />
                {projects.badge}
              </Badge>
              <div className="space-y-3">
                <h1 className="text-primary text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
                  {projects.title}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                  {projects.description}
                </p>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="flex w-full flex-col">
          <ul className="space-y-6">
            {projects.items.map((project) => (
              <li key={project.title} className="border-border rounded-md border p-4">
                <h2 className="text-foreground text-xl font-semibold">{project.title}</h2>
                <p className="text-muted-foreground mt-2">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
