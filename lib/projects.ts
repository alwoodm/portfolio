export type ProjectItem = Readonly<{
  title: string;
  description: string;
  tags: string[];
  link?: string;
  isLive: boolean;
}>;

export type ProjectsContent = Readonly<{
  badge: string;
  title: string;
  description: string;
  items: ProjectItem[];
}>;
