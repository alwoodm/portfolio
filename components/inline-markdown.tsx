import type { ReactNode } from 'react';

type InlineMarkdownProps = Readonly<{
  text: string;
}>;

const MARKDOWN_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

function renderInlineMarkdown(text: string): ReactNode[] {
  if (!text) return [];

  return text
    .split(MARKDOWN_PATTERN)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${index}`} className="text-primary font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em
            key={`italic-${index}`}
            className="text-primary decoration-primary/40 italic underline decoration-2 underline-offset-4"
          >
            {part.slice(1, -1)}
          </em>
        );
      }

      return <span key={`text-${index}`}>{part}</span>;
    });
}

export function InlineMarkdown({ text }: InlineMarkdownProps) {
  return <>{renderInlineMarkdown(text)}</>;
}
