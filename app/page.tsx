import fs from 'node:fs/promises';
import path from 'node:path';

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
    <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-8 px-6 text-center sm:px-10">
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
          {content.eyebrow}
        </p>
        <h1 className="text-foreground text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          {content.title}
        </h1>
        <p className="text-muted-foreground text-lg">{content.description}</p>
      </div>
    </main>
  );
}
