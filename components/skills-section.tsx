import { SkillsCard } from '@/components/skills-card';
import { SkillsRow } from '@/components/skills-row';
import type { SkillsItem } from '@/lib/skills';

type SkillsSectionProps = Readonly<{
  title: string;
  items: SkillsItem[];
}>;

export function SkillsSection({ title, items }: SkillsSectionProps) {
  return (
    <section className="w-full">
      <div className="space-y-4 text-left">
        <h2 className="text-foreground text-lg font-semibold sm:text-xl">{title}</h2>
        <SkillsRow className="w-full">
          {items.map((item) => (
            <SkillsCard key={item.name} iconId={item.iconId} name={item.name} />
          ))}
        </SkillsRow>
      </div>
    </section>
  );
}
