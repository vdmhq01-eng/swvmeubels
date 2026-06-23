import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

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
  themeColor: '#73522C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-bone-50 text-ink-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
