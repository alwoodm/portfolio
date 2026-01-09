export type InlineToken = Readonly<{
  type: 'text' | 'bold' | 'italic' | 'link';
  value: string;
  href?: string;
}>;

type ParsedToken = Readonly<{
  token: InlineToken;
  nextIndex: number;
}>;

const readEmphasisToken = (text: string, startIndex: number): ParsedToken | null => {
  if (text[startIndex] !== '*') return null;

  const isBold = text[startIndex + 1] === '*';
  const marker = isBold ? '**' : '*';
  const markerLength = isBold ? 2 : 1;
  const contentStart = startIndex + markerLength;
  const contentEnd = text.indexOf(marker, contentStart);

  if (contentEnd === -1) return null;

  const value = text.slice(contentStart, contentEnd);
  return {
    token: { type: isBold ? 'bold' : 'italic', value },
    nextIndex: contentEnd + markerLength,
  };
};

const readLinkToken = (text: string, startIndex: number): ParsedToken | null => {
  if (text[startIndex] !== '[') return null;

  const labelEnd = text.indexOf(']', startIndex + 1);
  if (labelEnd === -1 || text[labelEnd + 1] !== '(') return null;

  const urlEnd = text.indexOf(')', labelEnd + 2);
  if (urlEnd === -1) return null;

  return {
    token: {
      type: 'link',
      value: text.slice(startIndex + 1, labelEnd),
      href: text.slice(labelEnd + 2, urlEnd),
    },
    nextIndex: urlEnd + 1,
  };
};

export const tokenizeInlineMarkdown = (text: string): InlineToken[] => {
  if (!text) return [];

  const tokens: InlineToken[] = [];
  let buffer = '';
  let index = 0;

  const flushBuffer = () => {
    if (!buffer) return;
    tokens.push({ type: 'text', value: buffer });
    buffer = '';
  };

  while (index < text.length) {
    const linkToken = readLinkToken(text, index);
    if (linkToken) {
      flushBuffer();
      tokens.push(linkToken.token);
      index = linkToken.nextIndex;
      continue;
    }

    const emphasisToken = readEmphasisToken(text, index);
    if (emphasisToken) {
      flushBuffer();
      tokens.push(emphasisToken.token);
      index = emphasisToken.nextIndex;
      continue;
    }

    buffer += text[index];
    index += 1;
  }

  flushBuffer();
  return tokens;
};

export const stripInlineMarkdown = (text: string) =>
  tokenizeInlineMarkdown(text)
    .map((token) => token.value)
    .join('');
