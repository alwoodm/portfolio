import fs from 'node:fs/promises';
import path from 'node:path';

type Content = {
  career: {
    title: string;
    description: string;
  };
};

async function getContent(): Promise<Content> {
  const filePath = path.join(process.cwd(), 'data', 'content.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as Content;
}

export default async function CareerPage() {
  const content = await getContent();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-foreground text-3xl font-semibold">{content.career.title}</h1>
      <p className="text-muted-foreground mt-4">{content.career.description}</p>
    </main>
  );
}
