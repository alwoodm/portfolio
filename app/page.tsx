import fs from 'node:fs/promises';
import path from 'node:path';

import { HeroIcon } from '@/components/hero-icon';

type HomeContent = {
  eyebrow: string;
  title: string;
  description: string;
};

async function getHomeContent(): Promise<HomeContent> {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as HomeContent;
}

export default async function Home() {
  const content = await getHomeContent();

  return (
    <main className="flex min-h-[calc(100svh-96px)] flex-col items-center justify-center px-6 sm:min-h-[calc(100svh-112px)] sm:px-10 lg:-translate-y-12">
      <div className="flex w-full max-w-6xl flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex w-full flex-col gap-3 text-left lg:w-[35%]">
          <p className="text-muted-foreground text-base font-medium tracking-[0.25em] uppercase">
            {content.eyebrow}
          </p>
          <h1 className="text-foreground text-5xl leading-tight font-semibold text-balance sm:text-6xl lg:text-7xl">
            {content.title}
          </h1>
          <p className="text-muted-foreground text-xl sm:text-2xl">{content.description}</p>
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
