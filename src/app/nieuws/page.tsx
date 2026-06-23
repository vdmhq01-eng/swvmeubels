import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { newsItems } from '@/lib/mock/marketing';
import { formatDateLong } from '@/lib/utils';

const categoryVariant: Record<string, string> = {
  Nieuws: 'bg-primary-50 text-primary-700 border-primary-100',
  Event: 'bg-navy-50 text-navy-700 border-navy-100',
  Verhaal: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function NieuwsPage() {
  return (
    <MarketingShell activeHref="/nieuws">
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-400" /> Nieuws &amp; events
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Wat speelt er bij SWV<span className="text-primary-400">?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Nieuws over opleidingen, verhalen van studenten en lidbedrijven, en aankondigingen
            van events in het hele land.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article key={item.slug} className="flex flex-col overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="aspect-[16/10] bg-gradient-to-br from-bone-200 to-bone-100" />
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
