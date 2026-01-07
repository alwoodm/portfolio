import fs from 'node:fs/promises';
import path from 'node:path';

import type { Metadata } from 'next';

export type SeoContent = Readonly<{
  siteName: string;
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  openGraph: {
    type: 'website';
    locale: string;
  };
  twitter: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
  };
}>;

export type PageSeo = Readonly<{
  title: string;
  description: string;
  path: string;
}>;

const SEO_PATH = path.join(process.cwd(), 'data', 'seo.json');
const FALLBACK_SITE_URL = 'http://localhost:3000';
const OG_IMAGE_PATH = '/og.png';

export const getSiteUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_SITE_URL;

export const getSeoContent = async (): Promise<SeoContent> => {
  const raw = await fs.readFile(SEO_PATH, 'utf8');
  return JSON.parse(raw) as SeoContent;
};

export const getOgImageUrl = (siteUrl: string) => new URL(OG_IMAGE_PATH, siteUrl).toString();

export const stripMarkdown = (value: string) =>
  value.replaceAll(/\*\*(.+?)\*\*/g, '$1').replaceAll(/\*(.+?)\*/g, '$1');

export const buildPageMetadata = (seo: SeoContent, page: PageSeo): Metadata => {
  const siteUrl = getSiteUrl();
  const canonical = new URL(page.path, siteUrl).toString();
  const ogImageUrl = getOgImageUrl(siteUrl);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: seo.openGraph.type,
      locale: seo.openGraph.locale,
      siteName: seo.siteName,
      url: canonical,
      title: page.title,
      description: page.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seo.siteName,
        },
      ],
    },
    twitter: {
      card: seo.twitter.card,
      title: page.title,
      description: page.description,
      images: [ogImageUrl],
    },
  };
};
