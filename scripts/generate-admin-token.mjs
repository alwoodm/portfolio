import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const environmentPath = path.join(process.cwd(), '.env');
const onlyIfMissing = process.argv.includes('--if-missing');

const readEnvironment = async () => {
  try {
    return await fs.readFile(environmentPath, 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return '';
    }
    throw error;
  }
};

const updateEnvironment = (content, tokenValue) => {
  const entry = `ADMIN_TOKEN=${tokenValue}`;
  if (!content) {
    return `${entry}\n`;
  }

  const hasTrailingNewline = /\r?\n$/.test(content);
  let nextContent = hasTrailingNewline ? content : `${content}\n`;

  if (/^ADMIN_TOKEN=.*$/m.test(nextContent)) {
    nextContent = nextContent.replace(/^ADMIN_TOKEN=.*$/m, entry);
  } else {
    nextContent += `${entry}\n`;
  }

  return nextContent;
};

const parseExistingToken = (content) => {
  const match = content.match(/^ADMIN_TOKEN=(.*)$/m);
  return match ? match[1] : undefined;
};

try {
  const current = await readEnvironment();
  const existingToken = parseExistingToken(current);

  if (onlyIfMissing && existingToken) {
    console.warn('ADMIN_TOKEN already set in .env. Skipping.');
  } else {
    const token =
      (onlyIfMissing && process.env.ADMIN_TOKEN) || randomBytes(48).toString('base64url');
    const updated = updateEnvironment(current, token);
    await fs.writeFile(environmentPath, updated, 'utf8');
    console.warn('Updated .env with a new ADMIN_TOKEN.');
  }
} catch (error) {
  console.error('Failed to update ADMIN_TOKEN.', error);
  process.exitCode = 1;
}
