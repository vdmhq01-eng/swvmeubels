import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Icon } from '@/components/ui/Icon';
import { marketingRegions } from '@/lib/mock/marketing';

export default function RegiosPage() {
  return (
    <MarketingShell activeHref="/regios">
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-400" /> Regio&apos;s
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Acht regio&apos;s, één Samenwerkingsverband<span className="text-primary-400">.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Elke regio heeft een eigen coördinator als vast aanspreekpunt. Klik op een regio voor
            contactgegevens en lokale informatie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {marketingRegions.map((r) => (
            <Link
              key={r.slug}
              href={`/regios/${r.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
            >
              <div className="relative grid aspect-[5/3] place-items-center bg-gradient-to-br from-primary-100 via-bone-50 to-bone-100">
                <svg viewBox="0 0 200 120" className="h-32 w-auto text-primary-600/40">
                  <path
                    d="M100 18 L160 50 L150 100 L100 110 L50 100 L40 50 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="100" cy="60" r="6" fill="white" stroke="currentColor" strokeWidth="2" />
                </svg>
                {!r.belongsToSwv ? (
                  <span className="badge absolute right-3 top-3 border border-amber-100 bg-amber-50 text-amber-700">
                    BosMti
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg font-bold text-ink-900">Regio {r.name}</h3>
                <p className="text-sm text-ink-600 line-clamp-2">{r.description}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-ink-500">
                  <span>{r.companyCount} lidbedrijven · {r.studentCount} studenten</span>
                  <Icon.ArrowRight className="h-4 w-4 text-primary-500 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
