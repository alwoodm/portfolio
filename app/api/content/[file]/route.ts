import fs from 'node:fs/promises';
import path from 'node:path';

import { revalidatePath } from 'next/cache';

import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const SERVICE_ERROR = 'Sorry, something went wrong. Please try again later.';

const ALLOWED_FILES = new Set(['home', 'about', 'skills', 'career', 'projects', 'contact']);

const REVALIDATE_PATHS: Record<string, string> = {
  home: '/',
  about: '/about',
  skills: '/skills',
  career: '/career',
  projects: '/projects',
  contact: '/contact',
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getFilePath = (file: string) => path.join(process.cwd(), 'data', `${file}.json`);

const getAllowedFile = (file: string | undefined) =>
  file && ALLOWED_FILES.has(file) ? file : null;

export async function GET(_: NextRequest, context: { params: Promise<{ file: string }> }) {
  const { file: rawFile } = await context.params;
  const file = getAllowedFile(rawFile);
  if (!file) {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  try {
    const filePath = getFilePath(file);
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw) as unknown;
    return Response.json(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return Response.json({ error: 'Not found.' }, { status: 404 });
    }
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ file: string }> }) {
  const { file: rawFile } = await context.params;
  const file = getAllowedFile(rawFile);
  if (!file) {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  const expectedToken = process.env.ADMIN_TOKEN ?? '';
  if (!expectedToken) {
    console.error('[content] ADMIN_TOKEN missing.');
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  const providedToken = request.headers.get('x-admin-token');
  if (!providedToken) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (providedToken !== expectedToken) {
    return Response.json({ error: 'Forbidden.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Please provide valid JSON.' }, { status: 400 });
  }

  if (!isPlainObject(payload)) {
    return Response.json({ error: 'Payload must be a JSON object.' }, { status: 400 });
  }

  try {
    const filePath = getFilePath(file);
    const serialized = `${JSON.stringify(payload, null, 2)}\n`;
    await fs.writeFile(filePath, serialized, 'utf8');
  } catch (error) {
    console.error('[content] Failed to write JSON file.', error);
    return Response.json({ error: SERVICE_ERROR }, { status: 500 });
  }

  const revalidateTargets = Object.values(REVALIDATE_PATHS);
  let revalidated = false;
  for (const target of revalidateTargets) {
    try {
      revalidatePath(target);
      revalidated = true;
    } catch (error) {
      console.error(`[content] Failed to revalidate ${target}.`, error);
    }
  }

  console.warn(`[content] Updated ${file}.json; revalidated ${revalidateTargets.length} paths.`);

  return Response.json({ ok: true, revalidated, revalidateTargets });
}
