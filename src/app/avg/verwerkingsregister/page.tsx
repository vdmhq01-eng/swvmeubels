import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

const verwerkingen = [
  {
    naam: 'Personeelsadministratie BBL-studenten',
    doel: 'Uitvoering arbeidsovereenkomst, salarisbetaling, ziektewet, cao-naleving',
    grondslag: 'Art. 6(1)(b) AVG: noodzakelijk voor uitvoering overeenkomst',
    categorieen: 'NAW, e-mail, telefoon, BSN (alleen in Synergy), bankrekening, geboortedatum, opleidingsniveau',
    ontvangers: 'Coördinator (eigen regio), lidbedrijf (eigen studenten), binnendienst, Belastingdienst, UWV',
    bewaartermijn: '7 jaar na uitdienst (fiscaal)',
    beveiliging: 'TLS 1.3, encryption at rest, RBAC, audit log',
  },
  {
    naam: 'Urenregistratie + salarisverwerking',
    doel: 'Loonadministratie, factureren aan lidbedrijven, naleving cao',
    grondslag: 'Art. 6(1)(b) + 6(1)(c) (wettelijke verplichting)',
    categorieen: 'Gewerkte uren, schooluren, ziekte/verlof uren, uurloon',
    ontvangers: 'Coördinator, lidbedrijf, Exact Globe (verloning), Cleverdesk (urenregistratie)',
    bewaartermijn: '7 jaar (fiscaal)',
    beveiliging: 'TLS, audit log per wijziging, 2FA voor admin',
  },
  {
    naam: 'Ziekteverzuim',
    doel: 'Wet verbetering poortwachter, doorbetaling salaris, re-integratie',
    grondslag: 'Art. 6(1)(c) wettelijke verplichting + art. 9(2)(h) (medische via bedrijfsarts)',
    categorieen: 'Datum ziek/beter, frequentie (NIET diagnose, NIET symptomen)',
    ontvangers: 'Coördinator, lidbedrijf (alleen aanwezig/afwezig), bedrijfsarts (medische via separate flow)',
    bewaartermijn: '2 jaar na laatste melding',
    beveiliging: 'Medische data NIET in dit portaal — alleen flag, datum, status',
  },
  {
    naam: 'Sollicitaties',
    doel: 'Werving en plaatsing van nieuwe BBL-studenten',
    grondslag: 'Art. 6(1)(a) toestemming sollicitant + art. 6(1)(b) precontractueel',
    categorieen: 'NAW, e-mail, telefoon, postcode, motivatie, interesse',
    ontvangers: 'Toegewezen coördinator (op basis van postcode), binnendienst',
    bewaartermijn: '4 weken na afwijzing, 1 jaar met toestemming',
    beveiliging: 'TLS, geen tracking-cookies, e-mail bevestiging',
  },
  {
    naam: 'Lidbedrijf relatiebeheer',
    doel: 'Contractbeheer leerbedrijven, facturatie, cao-naleving check',
    grondslag: 'Art. 6(1)(b) overeenkomst + 6(1)(f) gerechtvaardigd belang',
    categorieen: 'Bedrijfsnaam, KvK, contactpersoon naam, e-mail, telefoon',
    ontvangers: 'Coördinator, binnendienst',
    bewaartermijn: '7 jaar na beëindiging lidmaatschap',
    beveiliging: 'TLS, RBAC',
  },
];

export default function VerwerkingsregisterPage() {
  return (
    <div className="min-h-screen bg-bone-50">
      <header className="border-b border-bone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="btn-ghost"><Icon.ArrowRight className="h-4 w-4 rotate-180" /> Terug</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">AVG art. 30</div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">Verwerkingsregister</h1>
          <p className="mt-3 max-w-3xl text-ink-700">
            Verplicht register volgens art. 30 AVG voor alle organisaties die persoonsgegevens
            verwerken. Hieronder vind je de verwerkingen die SWV Meubel uitvoert via dit portaal.
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Verwerkingsverantwoordelijke: <strong>SWV Meubel</strong> · Westerhoutpark 10, 2012 JM Haarlem · samenwerkingsverband@cbm.nl
          </p>
        </div>

        <div className="space-y-5">
          {verwerkingen.map((v, i) => (
            <article key={v.naam} className="rounded-2xl border border-bone-200 bg-white p-6 shadow-card">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-500 font-display text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h2 className="font-display text-xl font-bold text-ink-900">{v.naam}</h2>
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Row label="Doel" value={v.doel} />
                <Row label="Grondslag (AVG)" value={v.grondslag} />
                <Row label="Categorieën gegevens" value={v.categorieen} />
                <Row label="Ontvangers" value={v.ontvangers} />
                <Row label="Bewaartermijn" value={v.bewaartermijn} />
                <Row label="Beveiliging" value={v.beveiliging} />
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary-200 bg-primary-50 p-6">
          <h3 className="font-display text-base font-bold text-ink-900">Rechten betrokkenen</h3>
          <p className="mt-2 text-sm text-ink-700">
            Iedereen wiens gegevens we verwerken heeft recht op inzage, correctie, beperking,
            vergetelheid, dataportabiliteit en bezwaar. Vraag aan via{' '}
            <a href="mailto:samenwerkingsverband@cbm.nl" className="font-semibold text-primary-600">
              samenwerkingsverband@cbm.nl
            </a>{' '}
            of via je portaal-profiel (Mijn gegevens → Vraag dataexport).
          </p>
          <p className="mt-2 text-xs text-ink-500">
            Klacht over verwerking? Neem contact op met onze functionaris gegevensbescherming
            of dien direct een klacht in bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).
          </p>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-800">{value}</dd>
    </div>
  );
}
