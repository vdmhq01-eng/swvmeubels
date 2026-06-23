import type { Metadata, Viewport } from 'next';
import { PT_Sans, Open_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SWV Meubel Portaal',
  description:
    'Onderwijs-, begeleidings- en urenregistratieplatform voor studenten, coördinatoren en lidbedrijven in de meubelbranche.',
  robots: { index: false, follow: false },
  manifest: '/manifest.webmanifest',
  applicationName: 'SWV Meubel',
  appleWebApp: {
    capable: true,
    title: 'SWV Meubel',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#EC6806',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${ptSans.variable} ${openSans.variable}`}>
      <body className="min-h-screen bg-bone-50 text-ink-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
