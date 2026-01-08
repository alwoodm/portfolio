import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectItem } from '@/lib/projects';
import { cn } from '@/lib/utils';

type ProjectCardProps = Readonly<{
  project: ProjectItem;
}>;

export function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.isLive && Boolean(project.link);

  return (
    <Card className="border-border/70 bg-card/80 hover:bg-card flex h-full flex-col gap-1.5 border shadow-sm transition duration-200 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_12px_30px_-18px_rgba(16,185,129,0.55)]">
      <CardHeader className="pb-0">
        <CardTitle className="text-primary text-xl font-semibold">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1">
        <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
        <div aria-label={`${project.title} tags`} className="mt-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={`${project.title}-${tag}`} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        {isLive ? (
          <Button asChild className="group gap-0 text-white" size="sm">
            <Link href={project.link ?? '#'} rel="noreferrer" target="_blank">
              Visit project
              <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:max-w-[1rem] group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
        ) : (
          <span
            aria-disabled="true"
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'group border-border/60 bg-muted/60 text-muted-foreground hover:bg-muted/60 relative w-[8.5rem] cursor-not-allowed overflow-hidden shadow-none transition-[width] duration-200 group-hover:w-[9.75rem]',
            )}
          >
            <span className="flex h-full w-full items-center justify-center whitespace-nowrap transition-transform duration-200 group-hover:-translate-y-full">
              Unavailable
            </span>
            <span className="pointer-events-none absolute inset-0 flex translate-y-full items-center justify-center whitespace-nowrap transition-transform duration-200 group-hover:translate-y-0">
              Check back soon
            </span>
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
