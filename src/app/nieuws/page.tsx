import Image from 'next/image';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { newsItems } from '@/lib/mock/marketing';
import { formatDateLong } from '@/lib/utils';

const newsImages = [
  'https://images.unsplash.com/photo-1611025437671-ae3acc7e4d34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568871453524-78fc36476b15?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503387837-b154d5074bd2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1572297870735-1bd7d4926b1a?auto=format&fit=crop&w=1200&q=80',
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
