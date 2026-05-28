import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SWV Meubel Portal',
  description:
    'Onderwijs-, begeleidings- en urenregistratieplatform voor studenten, coördinatoren en lidbedrijven in de meubelbranche.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-bone-50 text-ink-900 antialiased">{children}</body>
    </html>
  );
}
