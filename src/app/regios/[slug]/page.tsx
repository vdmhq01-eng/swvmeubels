import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { Icon } from '@/components/ui/Icon';
import { marketingRegions, newsItems } from '@/lib/mock/marketing';
import { formatDateLong } from '@/lib/utils';

const lidbedrijvenPerRegio: Record<string, { name: string; type: string; city: string }[]> = {
  'regio-noord-nederland': [
    { name: 'De Vries Interieurbouw', type: 'Interieurbouw', city: 'Groningen' },
    { name: 'Hout & Meubel Groep', type: 'Meubelmakerij', city: 'Leeuwarden' },
    { name: 'Design Besloten', type: 'Maatwerk meubels', city: 'Assen' },
    { name: 'Meubelfabriek De Linde', type: 'Seriewerk', city: 'Drachten' },
    { name: 'Houtbewerking Noord', type: 'CNC en machinaal', city: 'Emmen' },
    { name: 'Atelier de Linde', type: 'Maatwerk', city: 'Groningen' },
  ],
  'regio-twente-salland': [
    { name: 'Houtwerk Maatwerk', type: 'Maatwerk meubels', city: 'Enschede' },
    { name: 'Atelier Lindeboom', type: 'Interieurbouw', city: 'Almelo' },
    { name: 'De Twentse Meubelmaker', type: 'Meubelmakerij', city: 'Zwolle' },
  ],
  'regio-noord-holland': [
    { name: 'Amsterdam Interieurs', type: 'Interieurbouw', city: 'Amsterdam' },
    { name: 'Haarlemmer Houtwerk', type: 'Meubelmakerij', city: 'Haarlem' },
    { name: 'Alkmaar Maatwerk', type: 'Maatwerk', city: 'Alkmaar' },
  ],
};

export default function RegioDetail({ params }: { params: { slug: string } }) {
  const region = marketingRegions.find((r) => r.slug === params.slug);
  if (!region) notFound();
  const others = marketingRegions.filter((r) => r.slug !== region.slug).slice(0, 3);
  const bedrijven = lidbedrijvenPerRegio[region.slug] ?? [];
  const regioNews = newsItems.slice(0, 2);

  return (
    <MarketingShell activeHref="/regios">
      <Hero
        eyebrow={region.belongsToSwv ? 'Samenwerkingsverband' : 'BosMti'}
        title={`Regio ${region.name}.`}
        highlight={region.belongsToSwv ? 'Hier werken we.' : 'Via BosMti.'}
        description={region.description}
        image={heroImages.regios}
      >
        <Link href="/solliciteren" className="btn-primary">
          Solliciteren in {region.name}
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/bedrijven/aanmelden"
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition"
        >
          Word lidbedrijf
        </Link>
      </Hero>

      {/* Breadcrumb */}
      <div className="border-b border-bone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-3 text-xs text-ink-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/regios" className="hover:text-primary-600">Regio&apos;s</Link>
          <span className="mx-2">›</span>
          <span className="font-semibold text-ink-900">Regio {region.name}</span>
        </div>
      </div>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatBox icon={<Icon.Briefcase className="h-5 w-5" />} label="Lidbedrijven" value={`${region.companyCount}`} tone="primary" />
          <StatBox icon={<Icon.Users className="h-5 w-5" />} label="Actieve studenten" value={`${region.studentCount}`} tone="navy" />
          <StatBox icon={<Icon.Activity className="h-5 w-5" />} label="Provincies" value={`${region.provinces.length}`} tone="emerald" />
          <StatBox icon={<Icon.BookOpen className="h-5 w-5" />} label="Opleidingen" value="3" tone="amber" />
        </div>
      </section>

      {/* Coördinator + Provincies */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="corner-br bg-primary-500 p-8 text-white lg:col-span-2">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Jouw aanspreekpunt
            </div>
            <h3 className="mt-2 font-display text-3xl font-bold">{region.coordinator.name}</h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90">
              Coördinator regio {region.name}. Eerste aanspreekpunt voor studenten en lidbedrijven —
              bij vragen, problemen of nieuwe ideeën.
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Icon.Bell className="h-4 w-4 shrink-0" />
                <a href={`tel:${region.coordinator.phone.replace(/\s/g, '')}`} className="hover:underline">
                  {region.coordinator.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icon.Doc className="h-4 w-4 shrink-0" />
                <a href={`mailto:${region.coordinator.email}`} className="hover:underline">
                  {region.coordinator.email}
                </a>
              </div>
            </dl>
          </div>

          <div className="card-padded">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              Werkgebied
            </div>
            <h3 className="mt-2 font-display text-lg font-bold">Provincies</h3>
            <ul className="mt-4 space-y-2">
              {region.provinces.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-ink-700">
                  <Icon.Check className="h-4 w-4 text-primary-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lidbedrijven in deze regio */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                Lidbedrijven
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                Bedrijven in {region.name}
              </h2>
              <p className="mt-2 max-w-2xl text-ink-600">
                Hier leiden de lidbedrijven van regio {region.name} jongeren op tot vakman.
              </p>
            </div>
            <Link href="/bedrijven/aanmelden" className="btn-outline-primary">
              Word lidbedrijf
            </Link>
          </div>
          {bedrijven.length === 0 ? (
            <div className="rounded-2xl border border-bone-200 bg-white p-8 text-center text-sm text-ink-500">
              Bedrijfslijst voor deze regio wordt binnenkort getoond.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bedrijven.map((b) => (
                <div key={b.name} className="card-padded">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                    <Icon.Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-ink-900">{b.name}</h3>
                  <p className="mt-1 text-xs text-ink-500">{b.type} · {b.city}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nieuws uit deze regio */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Nieuws</div>
          <h2 className="mt-2 font-display text-3xl font-bold">Recent uit deze regio</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {regioNews.map((n, i) => (
            <article key={n.slug} className="overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${i === 0 ? '1611025437671-ae3acc7e4d34' : '1556910103-1c02745aae4d'}?auto=format&fit=crop&w=1200&q=80`}
                alt={n.title}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="p-6">
                <span className="badge-primary">{n.category}</span>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm text-ink-600 line-clamp-2">{n.excerpt}</p>
                <time className="mt-3 block text-xs text-ink-500">{formatDateLong(n.date)}</time>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Andere regio's */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold">Andere regio&apos;s</h3>
            <Link href="/regios" className="text-sm font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700">
              Alle regio&apos;s →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/regios/${o.slug}`}
                className="card-padded transition hover:-translate-y-0.5 hover:border-primary-200"
              >
                <h4 className="font-display text-base font-bold">Regio {o.name}</h4>
                <p className="mt-2 text-xs text-ink-500">{o.companyCount} lidbedrijven · {o.studentCount} studenten</p>
                <p className="mt-3 text-sm text-ink-600 line-clamp-2">{o.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function StatBox({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: 'primary' | 'navy' | 'emerald' | 'amber' }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
  }[tone];
  return (
    <div className="rounded-2xl border border-bone-200 bg-white p-5 shadow-card">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-3xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
