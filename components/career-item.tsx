import AnimatedContent from '@/components/animation/animated-content';
import { InlineMarkdown } from '@/components/inline-markdown';
import type { CareerTimelineItem } from '@/lib/career';

type CareerItemProps = Readonly<{
  delay: number;
  isLast: boolean;
  item: CareerTimelineItem;
}>;

export function CareerItem({ delay, isLast, item }: CareerItemProps) {
  const contentSpacing = isLast ? 'pb-0' : 'pb-7 sm:pb-11';

  return (
    <div className="grid w-full grid-cols-[16px_minmax(0,1fr)] [--career-dot-offset:1.35rem] sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,3fr)] sm:[--career-dot-offset:2.6rem]">
      <AnimatedContent
        animateOpacity
        reverse
        className="hidden text-left sm:flex sm:items-start sm:pr-2 sm:text-right sm:text-base"
        delay={delay}
        direction="horizontal"
        distance={64}
        duration={0.9}
      >
        <div className="career-period text-foreground text-sm font-semibold sm:text-lg">
          {item.period}
        </div>
      </AnimatedContent>
      <div
        className={`career-rail border-l-border col-start-1 row-start-1 border-l-4 sm:col-start-2 ${contentSpacing}`}
        data-active={item.isActive}
      />
      <AnimatedContent
        animateOpacity
        className={`col-start-2 w-full pl-4 sm:col-start-3 sm:pl-5 ${contentSpacing}`}
        delay={delay}
        direction="horizontal"
        distance={64}
        duration={0.9}
      >
        <div className="space-y-2">
          <div className="text-foreground text-lg leading-snug font-semibold sm:text-2xl">
            {item.role},{' '}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href={item.companyUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              {item.company}
            </a>
          </div>
          <div className="text-foreground text-sm font-semibold sm:hidden">{item.period}</div>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            <InlineMarkdown text={item.description} />
          </p>
        </div>
      </AnimatedContent>
    </div>
  );
}
