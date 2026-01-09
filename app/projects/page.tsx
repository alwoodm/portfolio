import fs from 'node:fs/promises';
import path from 'node:path';

import { Layers } from 'lucide-react';

import AnimatedContent from '@/components/animation/animated-content';
import { InlineMarkdown } from '@/components/inline-markdown';
import { ProjectCard } from '@/components/project-card';
import { Badge } from '@/components/ui/badge';
import type { ProjectsContent } from '@/lib/projects';
import { buildPageMetadata, getSeoContent, getSiteUrl, stripMarkdown } from '@/lib/seo';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

async function getProjects(): Promise<ProjectsContent> {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as ProjectsContent;
}

export async function generateMetadata(): Promise<Metadata> {
  const [content, seo] = await Promise.all([getProjects(), getSeoContent()]);

  return buildPageMetadata(seo, {
    title: content.title,
    description: stripMarkdown(content.description),
    path: '/projects',
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const siteUrl = getSiteUrl();
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.items.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: stripMarkdown(project.description),
        url: project.link ?? `${siteUrl}/projects`,
        keywords: project.tags.join(', '),
      },
    })),
  };

  return (
    <main className="w-full px-6 pt-8 pb-16 sm:px-10 lg:pb-20">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
        type="application/ld+json"
      />
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
                  <InlineMarkdown text={projects.description} />
                </p>
              </div>
            </div>
          </AnimatedContent>
        </section>

        <section className="w-full">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.items.map((project, index) => (
              <li key={project.title}>
                <AnimatedContent
                  animateOpacity
                  className="h-full"
                  delay={0.12 + index * 0.08}
                  distance={28}
                  duration={0.7}
                >
                  <ProjectCard project={project} />
                </AnimatedContent>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
