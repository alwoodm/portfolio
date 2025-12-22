import fs from 'node:fs/promises';
import path from 'node:path';

type CareerContent = {
  title: string;
  description: string;
};

async function getCareerContent(): Promise<CareerContent> {
  const filePath = path.join(process.cwd(), 'data', 'career.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as CareerContent;
}

export default async function CareerPage() {
  const content = await getCareerContent();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-foreground text-3xl font-semibold">{content.title}</h1>
      <p className="text-muted-foreground mt-4">{content.description}</p>
    </main>
  );
}
