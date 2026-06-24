import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { SubNav, bedrijvenNav } from '@/components/marketing/SubNav';
import { Icon } from '@/components/ui/Icon';

const voordelen = [
  {
    title: 'Geen werkgeversrol',
    body:
      'Je hoeft niet zelf een 2-jarige arbeidsovereenkomst af te sluiten met een student, dat doet het SWV.',
  },
  {
    title: 'Alleen gewerkte uren betalen',
    body:
      'Je betaalt alleen de daadwerkelijk gewerkte uren binnen je bedrijf. Bij ziekte of vakantie ontvangt de leerling wel salaris, maar deze uren worden niet aan je doorberekend.',
  },
  {
    title: 'Wisselen kan',
    body:
      'Mocht het tussen de student en je bedrijf geen goede match zijn, dan kan er gewisseld worden.',
  },
  {
    title: 'Aanvullende erkenning',
    body:
      'Heb je geen volledige erkenning en dus maar een deel van de opleiding aan te bieden? Ontbrekende onderdelen worden aangeboden via leerwerkplaats of ander leerbedrijf.',
  },
  {
    title: 'Workshops',
    body:
      'Het SWV biedt meerdere workshops aan waardoor de student meer wordt aangeleerd en breder inzetbaar is binnen je bedrijf.',
  },
  {
    title: 'Extra scholing kosteloos',
    body:
      'De student krijgt op gezette tijden extra scholing op de leerwerkplaats, zonder extra kosten voor jou.',
  },
  {
    title: 'Examenvoorbereiding op locatie',
    body:
      'Voorbereiding op de Proeve van Bekwaamheid en/of VakVaardigheidsToets kan plaatsvinden op de werkplaats.',
  },
  {
    title: 'Examengeld inbegrepen',
    body:
      'Het SWV betaalt het examengeld van de student. Dat bespaart je al snel €300 per student.',
  },
  {
    title: 'Gereedschap & kleding',
    body:
      'Het SWV betaalt/vergoedt kosten van gereedschap en kleding. Geen overheadkosten zoals salarisadministratie, verzuimverzekering of arbodienst.',
  },
  {
    title: 'Coördinator als mediator',
    body:
      'De SWV-coördinator ondersteunt en begeleidt de studenten. Loopt iets niet goed op school of in het bedrijf? Dan treedt de coördinator op als mediator.',
  },
];

const extraVoordelen = [
  {
    title: 'Geen WAB-gedoe',
    body:
      'Geen juridisch werkgeverschap betekent geen ketenbepaling, geen verhoogde WW-premie, geen transitievergoedingen en geen 12-jaar re-integratieverplichtingen voor arbeidsongeschikte BBL-studenten.',
  },
  {
    title: 'School & Expertisecentrum',
    body:
      'Ondersteuning vanuit de school en via Expertisecentrum Meubel om studenten in de praktijk goed te begeleiden en met de digitale leeromgeving om te gaan.',
  },
  {
    title: 'Cao naleving geregeld',
    body:
      'Je hoeft niet zelf uit te zoeken hoe je de cao Meubelindustrie correct naleeft — wij doen het. Geen risico op terugvorderingen tot 5 jaar terug.',
  },
];

export default function BedrijvenPage() {
  return (
    <MarketingShell activeHref="/bedrijven">
      <Hero
        eyebrow="Voor bedrijven"
        title="Bijschaven? Dat doe jij."
        highlight="Wij regelen de rest."
        description="Contract, salaris, verzekering, examengeld, gereedschap, kleding — alles wat papier en geld kost, regelt het Samenwerkingsverband. Jij doet waar je goed in bent: een leerling vormen tot vakman die je later kunt behouden."
        image={heroImages.bedrijven}
        side={
          <div className="corner-br w-full bg-primary-500 p-8 text-white">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Geen WAB-gedoe</div>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
              Bespaar €300 examengeld + alle salarisadministratie.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Geen ketenbepaling, geen transitievergoeding, geen verzuimrisico. Wel een
              gemotiveerde student 4 dagen per week in je werkplaats.
            </p>
          </div>
        }
      >
        <Link href="/bedrijven/aanmelden" className="btn-primary">
          Word lidbedrijf
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/regios"
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition"
        >
          Vind je regio
        </Link>
      </Hero>

      <SubNav active="/bedrijven" items={bedrijvenNav} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            De 10 voordelen
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Waarom een SWV-student?
          </h2>
          <p className="mt-3 max-w-3xl text-ink-600">
            Het Samenwerkingsverband (SWV) heeft 10 voordelen die het aantrekkelijk maken om
            jongeren op te leiden. Geen verrassingen, geen administratief gedoe.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {voordelen.map((v, i) => (
            <article key={v.title} className="card-padded">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-500 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-display text-base font-bold text-ink-900">{v.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              Er zijn nog meer voordelen
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Bonusvoordelen die je niet kunt missen
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {extraVoordelen.map((v) => (
              <article key={v.title} className="card-padded">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-navy-600 text-white">
                  <Icon.Check className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-navy-600 p-10 text-white">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Klaar om je aan te melden?</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-white/85">
                Vul het aanmeldformulier in. De coördinator van jouw regio komt graag langs voor
                een kennismakingsgesprek.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/bedrijven/aanmelden" className="btn-primary">Word lidbedrijf</Link>
              <Link href="/bedrijven/urenregistratie" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-navy-700 transition">
                Hoe werkt urenregistratie?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
