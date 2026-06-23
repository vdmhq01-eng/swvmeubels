import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { SubNav, bedrijvenNav } from '@/components/marketing/SubNav';
import { Icon } from '@/components/ui/Icon';

const stappen = [
  { stap: '01', title: 'Student vult in', body: 'Student vult elke dag uren in via de SWV-app op zijn telefoon. Reminder elke vrijdagmiddag.' },
  { stap: '02', title: 'Lidbedrijf goedkeurt', body: 'Praktijkopleider krijgt notificatie en keurt goed of af in één tik. Bij afkeur verplichte reden.' },
  { stap: '03', title: 'Cleverdesk sync', body: 'Goedgekeurde uren rollen automatisch in Cleverdesk. Geen handmatig overtikken.' },
  { stap: '04', title: 'Salaris automatisch', body: 'SWV verwerkt salaris. Jij krijgt alleen factuur voor daadwerkelijk gewerkte uren.' },
];

export default function UrenregistratiePage() {
  return (
    <MarketingShell activeHref="/bedrijven">
      <Hero
        eyebrow="Urenregistratie"
        title="Uren bijhouden?"
        highlight="Net zo simpel als spaanders vegen."
        description="Studenten vullen hun uren in via de app. Jij keurt goed of af. Wij synchroniseren naar Cleverdesk. Geen mailtjes meer, geen Excel, geen achter-de-broek-aan-zitten."
        image={heroImages.bedrijven}
      />
      <SubNav active="/bedrijven/urenregistratie" items={bedrijvenNav} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Zo werkt het</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">In 4 stappen van werkplaats naar salaris</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stappen.map((s) => (
            <div key={s.stap} className="card-padded">
              <div className="font-display text-5xl font-bold text-primary-200">{s.stap}</div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Wat verandert er</div>
              <h2 className="mt-2 font-display text-3xl font-bold">Van handwerk naar één tik</h2>
              <ul className="mt-6 space-y-4">
                <Compare oud="Excel of papier" nieuw="Studenten vullen in via mobiel" />
                <Compare oud="Mailen heen en weer" nieuw="Goedkeuren met één tik" />
                <Compare oud="Studenten vergeten uren" nieuw="Push-melding vrijdagmiddag" />
                <Compare oud="Handmatig in Cleverdesk overtikken" nieuw="Auto-sync naar Cleverdesk" />
                <Compare oud="Conflicten in maandelijkse afrekening" nieuw="Realtime overzicht voor jou en student" />
              </ul>
            </div>
            <div className="rounded-3xl bg-ink-900 p-2 shadow-card">
              <div className="rounded-2xl bg-bone-50 p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-600">Weekstaat W22</div>
                <div className="mt-1 text-sm text-ink-600">25 – 31 mei · Jamie van Dijk</div>
                <table className="mt-4 w-full text-sm">
                  <tbody>
                    <Row dag="Ma" type="Praktijk" uren="8,0" />
                    <Row dag="Di" type="Praktijk" uren="8,0" />
                    <Row dag="Wo" type="School" uren="7,0" tone="blue" />
                    <Row dag="Do" type="Praktijk" uren="8,0" />
                    <Row dag="Vr" type="Praktijk" uren="7,0" />
                  </tbody>
                </table>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3">
                  <span className="text-sm text-ink-600">Totaal</span>
                  <span className="font-display text-lg font-bold text-ink-900">38,0 u</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-md bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-700">
                    Afkeuren
                  </button>
                  <button className="flex-1 rounded-md bg-primary-500 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white">
                    <Icon.Check className="mr-1 inline h-3 w-3" /> Goedkeuren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-primary-500 p-10 text-white">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Zelf proberen?</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/90">
            Log in op het lidbedrijf-portaal en zie hoe weekstaten goedkeuren werkt.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/lidbedrijf" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-600 hover:bg-bone-50 transition">
              Open lidbedrijf-portaal
            </Link>
            <Link href="/bedrijven/aanmelden" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-primary-600 transition">
              Aanmelden
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function Compare({ oud, nieuw }: { oud: string; nieuw: string }) {
  return (
    <li className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_1fr] md:items-center">
      <span className="text-sm text-ink-500 line-through">{oud}</span>
      <Icon.ArrowRight className="h-4 w-4 text-primary-500 hidden md:inline" />
      <span className="font-display text-base font-semibold text-ink-900">{nieuw}</span>
    </li>
  );
}

function Row({ dag, type, uren, tone }: { dag: string; type: string; uren: string; tone?: 'blue' }) {
  return (
    <tr className="border-b border-bone-200 last:border-0">
      <td className="py-2 text-xs font-bold uppercase tracking-wider text-ink-500">{dag}</td>
      <td className="py-2">
        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
          tone === 'blue' ? 'bg-sky-50 text-sky-700' : 'bg-primary-50 text-primary-700'
        }`}>{type}</span>
      </td>
      <td className="py-2 text-right font-mono text-sm">{uren}</td>
    </tr>
  );
}
