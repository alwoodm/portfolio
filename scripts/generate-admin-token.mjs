import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const environmentPath = path.join(process.cwd(), '.env');
const token = randomBytes(48).toString('base64url');
const entry = `ADMIN_TOKEN=${token}`;

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

const updateEnvironment = (content) => {
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

try {
  const current = await readEnvironment();
  const updated = updateEnvironment(current);
  await fs.writeFile(environmentPath, updated, 'utf8');
  console.info('Updated .env with a new ADMIN_TOKEN.');
} catch (error) {
  console.error('Failed to update ADMIN_TOKEN.', error);
  process.exitCode = 1;
}
