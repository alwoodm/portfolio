import { tokenizeInlineMarkdown } from '@/lib/markdown';

import type { ReactNode } from 'react';

type InlineMarkdownProps = Readonly<{
  text: string;
}>;

function renderInlineMarkdown(text: string): ReactNode[] {
  return tokenizeInlineMarkdown(text).map((token, index) => {
    if (token.type === 'bold') {
      return (
        <strong key={`bold-${index}`} className="text-primary font-bold">
          {token.value}
        </strong>
      );
    }

    if (token.type === 'italic') {
      return (
        <em
          key={`italic-${index}`}
          className="text-primary decoration-primary/40 italic underline decoration-2 underline-offset-4"
        >
          {token.value}
        </em>
      );
    }

    if (token.type === 'link') {
      return (
        <a
          key={`link-${index}`}
          className="text-primary decoration-primary/40 underline decoration-2 underline-offset-4"
          href={token.href}
          rel="noreferrer noopener"
          target="_blank"
        >
          {token.value}
        </a>
      );
    }

    return <span key={`text-${index}`}>{token.value}</span>;
  });
}

export function InlineMarkdown({ text }: InlineMarkdownProps) {
  return <>{renderInlineMarkdown(text)}</>;
}
