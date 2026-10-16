import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { sitePath } from '@/lib/site-path';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Romance Trio | French, Italian & Spanish Side by Side',
    template: '%s | Romance Trio',
  },
  description:
    'Learn French, Italian and Spanish together with English as your reference. Compare vocabulary, grammar, cognates, idioms, and essential phrases.',
  icons: { icon: sitePath('/favicon.png') },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const imageVariables = {
    '--hero-image': `url("${sitePath('/images/hero-city.png')}")`,
    '--travel-image': `url("${sitePath('/images/travel.jpg')}")`,
  } as CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={imageVariables}>
        <ThemeProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
