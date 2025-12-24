import './globals.css';

import { JetBrains_Mono as FontMono, Outfit as FontSans } from 'next/font/google';

import { GridBackground } from '@/components/grid-background';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-toggle';

import type { Metadata } from 'next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal site',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
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
          </GridBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
