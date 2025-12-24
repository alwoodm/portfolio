import { SkillsCard } from '@/components/skills-card';
import { SkillsRow } from '@/components/skills-row';

export type SkillsItem = Readonly<{
  name: string;
  iconId: string;
}>;

type SkillsSectionProps = Readonly<{
  title: string;
  items: SkillsItem[];
}>;

export function SkillsSection({ title, items }: SkillsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-lg font-semibold sm:text-xl">{title}</h2>
      <SkillsRow>
        {items.map((item) => (
          <SkillsCard key={item.name} name={item.name} />
        ))}
      </SkillsRow>
    </section>
  );
}
