import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Icon } from '@/components/ui/Icon';

const opleidingen = [
  {
    title: 'Meubelmaker / (Scheeps-)Interieurbouwer',
    niveau: 'BBL 2 / 3',
    duur: '24 – 36 maanden',
    beschrijving:
      'Leer maatwerk meubelen en interieurs maken voor woningen, kantoren of zelfs schepen. Van ontwerp tot afwerking.',
  },
  {
    title: 'Machinaal houtbewerker',
    niveau: 'BBL 2',
    duur: '24 maanden',
    beschrijving:
      'Werken met machines voor seriematige productie. Veiligheid, precisie en kwaliteit staan centraal.',
  },
];

const week = [
  { day: 'Ma', label: 'Werk', tone: 'work' },
  { day: 'Di', label: 'Werk', tone: 'work' },
  { day: 'Wo', label: 'School', tone: 'school' },
  { day: 'Do', label: 'Werk', tone: 'work' },
  { day: 'Vr', label: 'Werk', tone: 'work' },
];

export default function StudentenPage() {
  return (
    <MarketingShell activeHref="/studenten">
      <section className="bg-ink-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-400" />
              Voor studenten
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Werken én leren in het meubelvak<span className="text-primary-400">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Vier dagen per week bij een lidbedrijf, één dag naar school in je eigen regio. Een
              werkbegeleider in het bedrijf, en voor iedere student begeleiding door een
              regionale coördinator.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/solliciteren" className="btn-primary">Solliciteren</Link>
              <Link
                href="/regios"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition"
              >
                Vind een bedrijf in jouw regio
              </Link>
            </div>
          </div>
          <div className="hidden items-center lg:flex">
            <div className="corner-br w-full bg-primary-500 p-8 text-white">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Verdien direct</div>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Eigen salaris, eigen vakantiedagen, eigen contract
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Je staat in dienst van het Samenwerkingsverband. Salaris, verzekeringen en
                vakantiedagen worden centraal geregeld. Geen gedoe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Opleidingen</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Kies een richting die bij jou past
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {opleidingen.map((o) => (
            <div key={o.title} className="card-padded">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-500 text-white">
                  <Icon.BookOpen className="h-5 w-5" />
                </div>
                <span className="badge-primary">{o.niveau}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{o.title}</h3>
              <p className="mt-1 text-xs text-ink-500 uppercase tracking-wider">{o.duur}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{o.beschrijving}</p>
              <Link href="/solliciteren" className="btn-outline-primary mt-5 inline-flex">
                Solliciteer
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Hoe werkt het</div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Een week als BBL-student
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {week.map((d) => (
              <div
                key={d.day}
                className={`rounded-2xl border p-6 text-center ${
                  d.tone === 'school'
                    ? 'border-navy-200 bg-navy-50 text-navy-700'
                    : 'border-primary-200 bg-primary-50 text-primary-700'
                }`}
              >
                <div className="font-display text-2xl font-bold">{d.day}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider">
                  {d.label}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-ink-600">
            Een dag per week ga je naar school in je eigen regio. De andere vier dagen werk je
            bij je leerbedrijf en bouw je echte ervaring op. Vakantiedagen krijg je gewoon
            volgens de cao.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-navy-600 p-10 text-white">
          <h2 className="font-display text-2xl font-bold">Direct beginnen?</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/85">
            Solliciteer rechtstreeks bij het Samenwerkingsverband. We kijken samen welk
            leerbedrijf in jouw regio bij je past.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/solliciteren" className="btn-primary">Solliciteren</Link>
            <a href="https://meubelmakerworden.nl/werken-en-leren/" target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-navy-700 transition">
              Meubelmakerworden.nl
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
