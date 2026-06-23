import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Icon } from '@/components/ui/Icon';
import { marketingRegions } from '@/lib/mock/marketing';

export default function RegioDetail({ params }: { params: { slug: string } }) {
  const region = marketingRegions.find((r) => r.slug === params.slug);
  if (!region) notFound();
  const others = marketingRegions.filter((r) => r.slug !== region.slug).slice(0, 3);

  return (
    <MarketingShell activeHref="/regios">
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Link href="/regios" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white">
            ← Alle regio&apos;s
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-400" />
            {region.belongsToSwv ? 'Samenwerkingsverband' : 'BosMti'}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Regio {region.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{region.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card-padded">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-500 text-white">
              <Icon.Briefcase className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold">{region.companyCount}</h3>
            <p className="text-sm text-ink-500 uppercase tracking-wider">Lidbedrijven</p>
          </div>
          <div className="card-padded">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy-600 text-white">
              <Icon.Users className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold">{region.studentCount}</h3>
            <p className="text-sm text-ink-500 uppercase tracking-wider">Actieve studenten</p>
          </div>
          <div className="card-padded">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600 text-white">
              <Icon.Activity className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold">{region.provinces.length}</h3>
            <p className="text-sm text-ink-500 uppercase tracking-wider">Provincies</p>
            <p className="mt-2 text-xs text-ink-500">{region.provinces.join(', ')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="corner-br bg-primary-500 p-8 text-white">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Coördinator
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold">{region.coordinator.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Vast aanspreekpunt voor zowel studenten als lidbedrijven in regio {region.name}.
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Icon.Bell className="h-4 w-4" />
                <a href={`tel:${region.coordinator.phone.replace(/\s/g, '')}`} className="hover:underline">
                  {region.coordinator.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icon.Doc className="h-4 w-4" />
                <a href={`mailto:${region.coordinator.email}`} className="hover:underline">
                  {region.coordinator.email}
                </a>
              </div>
            </dl>
          </div>

          <div className="card-padded">
            <h3 className="font-display text-xl font-bold">Aan de slag in {region.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Wil je solliciteren voor een opleiding in deze regio, of wil je lidbedrijf worden?
              Neem contact op met de coördinator of dien je sollicitatie direct in.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/solliciteren" className="btn-primary">Solliciteren</Link>
              <Link href="/bedrijven" className="btn-outline-primary">Word lidbedrijf</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold">Andere regio&apos;s</h3>
            <Link href="/regios" className="text-sm font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700">
              Alles bekijken →
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
