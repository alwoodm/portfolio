import fs from 'node:fs/promises';
import path from 'node:path';

type Project = {
  title: string;
  description: string;
};

type Projects = {
  title: string;
  description: string;
  items: Project[];
};

async function getProjects(): Promise<Projects> {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as Projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-foreground text-3xl font-semibold">{projects.title}</h1>
      <p className="text-muted-foreground mt-4">{projects.description}</p>
      <ul className="mt-8 space-y-6">
        {projects.items.map((project) => (
          <li key={project.title} className="border-border rounded-md border p-4">
            <h2 className="text-foreground text-xl font-semibold">{project.title}</h2>
            <p className="text-muted-foreground mt-2">{project.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
