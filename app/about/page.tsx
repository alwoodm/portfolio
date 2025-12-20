import fs from 'node:fs/promises';
import path from 'node:path';

type AboutContent = {
  title: string;
  description: string;
};

async function getAboutContent(): Promise<AboutContent> {
  const filePath = path.join(process.cwd(), 'data', 'about.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as AboutContent;
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-foreground text-3xl font-semibold">{content.title}</h1>
      <p className="text-muted-foreground mt-4">{content.description}</p>
    </main>
  );
}
