import Image from 'next/image';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { newsItems } from '@/lib/mock/marketing';
import { formatDateLong } from '@/lib/utils';

const newsImages = [
  'https://v3b.fal.media/files/b/0a9f9f5c/1NGWQizWFuwrH5K_Uv7uw.jpg',
  'https://v3b.fal.media/files/b/0a9f9f54/bBmKStBLv-jNjV7vxnpKK.jpg',
  'https://v3b.fal.media/files/b/0a9f9f5c/ORTKJ4Wrtj8PC4-TnFxQT.jpg',
  'https://v3b.fal.media/files/b/0a9f9f54/HtvsSU4rgo21P7CYjQhme.jpg',
  'https://v3b.fal.media/files/b/0a9f9f54/jhTUmEYnPPqJU1FWUf8ra.jpg',
  'https://v3b.fal.media/files/b/0a9f9f5c/HBA_Ed-_JwmjcL5mSoXln.jpg',
];

const categoryVariant: Record<string, string> = {
  Nieuws: 'bg-primary-50 text-primary-700 border-primary-100',
  Event: 'bg-navy-50 text-navy-700 border-navy-100',
  Verhaal: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function NieuwsPage() {
  return (
    <MarketingShell activeHref="/nieuws">
      <Hero
        eyebrow="Nieuws & events"
        title="Wat speelt er bij SWV"
        highlight="?"
        description="Nieuws over opleidingen, verhalen van studenten en lidbedrijven, en aankondigingen van events in het hele land."
        image={heroImages.nieuws}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, i) => (
            <article key={item.slug} className="flex flex-col overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative aspect-[16/10]">
                <Image
                  src={newsImages[i % newsImages.length]}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className={`badge border ${categoryVariant[item.category]}`}>{item.category}</span>
                  <time className="text-xs text-ink-500">{formatDateLong(item.date)}</time>
                </div>
                <h2 className="font-display text-lg font-bold leading-snug text-ink-900">{item.title}</h2>
                <p className="text-sm text-ink-600">{item.excerpt}</p>
                <Link
                  href={`/nieuws/${item.slug}`}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700"
                >
                  Lees verder →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
