import fs from 'node:fs/promises';
import path from 'node:path';

type SkillCategory = {
  title: string;
  items: string[];
};

type Skills = {
  title: string;
  description: string;
  categories: SkillCategory[];
};

async function getSkills(): Promise<Skills> {
  const filePath = path.join(process.cwd(), 'data', 'skills.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as Skills;
}

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-foreground text-3xl font-semibold">{skills.title}</h1>
      <p className="text-muted-foreground mt-4">{skills.description}</p>
      <div className="mt-8 space-y-8">
        {skills.categories.map((category) => (
          <section key={category.title} className="border-border rounded-md border p-4">
            <h2 className="text-foreground text-xl font-semibold">{category.title}</h2>
            <ul className="text-muted-foreground mt-3 list-disc pl-5">
              {category.items.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
