export type SkillsItem = Readonly<{
  name: string;
  iconId: string;
}>;

export type SkillCategory = Readonly<{
  title: string;
  items: SkillsItem[];
}>;

export type SkillsContent = Readonly<{
  badge: string;
  title: string;
  description: string;
  categories: SkillCategory[];
}>;
