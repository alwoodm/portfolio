import './globals.css';

import fs from 'node:fs/promises';
import path from 'node:path';

import { JetBrains_Mono as FontMono, Outfit as FontSans } from 'next/font/google';

import { GridBackground } from '@/components/grid-background';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import type { HomeContent } from '@/lib/home';
import { getOgImageUrl, getSeoContent, getSiteUrl } from '@/lib/seo';

import type { Metadata } from 'next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const getHomeContent = async (): Promise<HomeContent> => {
  const filePath = path.join(process.cwd(), 'data', 'home.json');
  const fileBuffer = await fs.readFile(filePath);
  return JSON.parse(fileBuffer.toString()) as HomeContent;
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoContent();
  const siteUrl = getSiteUrl();
  const ogImageUrl = getOgImageUrl(siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: seo.openGraph.type,
      locale: seo.openGraph.locale,
      siteName: seo.siteName,
      url: siteUrl,
      title: seo.defaultTitle,
      description: seo.defaultDescription,
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
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [seo, home] = await Promise.all([getSeoContent(), getHomeContent()]);
  const siteUrl = getSiteUrl();
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: home.name,
    url: siteUrl,
    jobTitle: home.role,
    sameAs: [home.social.linkedin, home.social.github],
    description: seo.defaultDescription,
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seo.siteName,
    url: siteUrl,
  };
  const jsonLd = [personJsonLd, websiteJsonLd];

  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          <GridBackground fade={false}>
            <div className="pt-24 sm:pt-28">{children}</div>
            <Navbar />
            <ModeToggle />
            <Toaster />
          </GridBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
