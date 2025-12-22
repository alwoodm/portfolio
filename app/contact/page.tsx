import fs from 'node:fs/promises';
import path from 'node:path';

type ContactContent = {
  title: string;
  description: string;
};

async function getContactContent(): Promise<ContactContent> {
  const filePath = path.join(process.cwd(), 'data', 'contact.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as ContactContent;
}

export default async function ContactPage() {
  const content = await getContactContent();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-foreground text-3xl font-semibold">{content.title}</h1>
      <p className="text-muted-foreground mt-4">{content.description}</p>
    </main>
  );
}
