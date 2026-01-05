import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

const getHomeContent = async () => {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as { social?: { github?: string } };
};

const isValidUrl = (value: string | undefined) => {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export async function GET() {
  try {
    const content = await getHomeContent();
    const target = content.social?.github;

    if (!target || !isValidUrl(target)) {
      return Response.json({ error: 'Not found.' }, { status: 404 });
    }

    return Response.redirect(target, 307);
  } catch {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }
}
