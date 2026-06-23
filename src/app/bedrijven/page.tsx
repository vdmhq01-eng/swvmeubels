import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Icon } from '@/components/ui/Icon';

const voordelen = [
  { title: 'Eén aanspreekpunt', body: 'De regionale coördinator regelt alles rondom de opleiding.' },
  { title: 'Geen werkgeversrol', body: 'Het SWV is formeel werkgever van de student.' },
  { title: 'Vakkundige instroom', body: 'Investeer in jonge vakmensen voor je eigen toekomst.' },
  { title: 'Salaris & verzekering', body: 'Salarisadministratie en verzekeringen lopen via SWV.' },
  { title: 'Begeleiding op locatie', body: 'Coördinatoren komen langs en begeleiden actief.' },
  { title: 'BBL = 4 dagen werken', body: 'De student is 4 dagen per week productief bij jou.' },
  { title: '1 dag school', body: 'De school zit dichtbij in je eigen regio.' },
  { title: 'Online portaal', body: 'Weekstaten, contracten en planning op één plek.' },
  { title: 'Praktijkbeoordeling', body: 'Heldere structuur voor beoordeling en certificering.' },
  { title: 'Collega-bedrijven', body: 'Onderling contact tussen lidbedrijven in je regio.' },
];

export default function BedrijvenPage() {
  return (
    <MarketingShell activeHref="/bedrijven">
      <section className="bg-ink-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-400" />
              Voor bedrijven
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Leid jonge vakmensen op<span className="text-primary-400">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Een Samenwerkingsverband is een groep bedrijven die 4 dagen per week BBL-studenten
              aan het werk hebben binnen het bedrijf. De regionale coördinatoren en centrale
              personeelsadministratie nemen je veel werk uit handen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/solliciteren" className="btn-primary">Word lidbedrijf</Link>
              <Link href="/regios" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition">
                Vind je regio
              </Link>
            </div>
          </div>
          <div className="hidden items-center lg:flex">
            <div className="corner-br w-full bg-primary-500 p-8 text-white">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">10 voordelen</div>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Werkend leren — productief én leerzaam
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Studenten leveren direct waarde in je bedrijf en groeien onder begeleiding uit tot
                vakmensen die je later kunt behouden als vaste medewerker.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            10 voordelen voor jouw bedrijf
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Waarom een SWV-student?</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {voordelen.map((v, i) => (
            <div key={v.title} className="card-padded">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-500 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-display text-base font-bold text-ink-900">{v.title}</h3>
              </div>
              <p className="mt-3 text-sm text-ink-600">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
          <Stat label="Lidbedrijven" value="335+" hint="Verspreid over 8 regio's" />
          <Stat label="Actieve studenten" value="876" hint="In opleiding via SWV" />
          <Stat label="Coördinatoren" value="9" hint="Eén per regio, jouw aanspreekpunt" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-navy-600 p-10 text-white">
          <h2 className="font-display text-2xl font-bold">Aan de slag</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/85">
            Wil je lidbedrijf worden? Neem contact op met de coördinator in jouw regio of vul het
            formulier in. We komen graag langs voor een kennismakingsgesprek.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/solliciteren" className="btn-primary">Word lidbedrijf</Link>
            <Link href="/regios" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-navy-700 transition">
              Naar regio's
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-bone-200 bg-white p-8 text-center">
      <div className="font-display text-5xl font-bold text-primary-600">{value}</div>
      <div className="mt-2 text-sm font-bold uppercase tracking-wider text-ink-900">{label}</div>
      <div className="mt-1 text-sm text-ink-500">{hint}</div>
    </div>
  );
}
