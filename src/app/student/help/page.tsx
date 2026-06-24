import { MarketingShell as _ } from '@/components/marketing/MarketingShell';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { WhatsAppButton, WhatsAppFloating } from '@/components/portal/WhatsAppButton';
import { getDemoSession } from '@/lib/data/session';
import { getStudentBasic } from '@/lib/data/student-pages';
import { StudentNotLoaded } from '@/components/portal/StudentNotLoaded';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const topics = [
  {
    id: 'werkgever',
    icon: <Icon.Briefcase className="h-5 w-5" />,
    eyebrow: 'Wie betaalt mij?',
    title: 'Wie is mijn werkgever?',
    summary: 'Het Samenwerkingsverband (SWV) is je formele werkgever. Niet je leerbedrijf.',
    sections: [
      {
        heading: 'Wie is mijn werkgever, kort gezegd?',
        body:
          'Je hebt een arbeidsovereenkomst met SWV Meubel. SWV betaalt je salaris en regelt je verzekeringen. Het leerbedrijf waar je werkt is geen werkgever, maar wel waar je dagelijks aan de slag bent.',
      },
      {
        heading: 'Waarom is dat handig?',
        body:
          'Als je wisselt van leerbedrijf, blijft je dienstverband bij SWV gewoon doorlopen. Je houdt je opgebouwde vakantiedagen en je hoeft geen nieuw contract af te sluiten. Je salarisstrook zegt altijd "SWV Meubel".',
      },
      {
        heading: 'Wie regelt wat?',
        body:
          'SWV: contract, salaris, verzekeringen, vakantiedagen, ziekteverlof, opleidingskosten. Leerbedrijf: werkplek, gereedschap, dagelijkse begeleiding, vakinhoudelijke opleiding.',
      },
    ],
  },
  {
    id: 'ziekteverzuim',
    icon: <Icon.Heart className="h-5 w-5" />,
    eyebrow: 'Ziek? Zo werkt het',
    title: 'Hoe werkt ziekteverzuim?',
    summary: 'Meld je ziek vóór 09:00 via het portaal. Je coördinator en leerbedrijf krijgen direct bericht.',
    sections: [
      {
        heading: 'Wat doe ik als ik ziek ben?',
        body:
          'Meld je ziek via het portaal zodra je het weet, het liefst voor 09:00 \'s ochtends. Zo weten je coördinator én je leerbedrijf direct dat je vandaag niet komt. Bellen of mailen is niet meer nodig.',
      },
      {
        heading: 'Krijg ik mijn salaris door?',
        body:
          'Ja. Tijdens ziekte krijg je gewoon doorbetaling van salaris volgens de cao Meubelindustrie. Ook in je eerste ziektejaar. Je leerbedrijf hoeft niet door te betalen — dat regelt SWV.',
      },
      {
        heading: 'Wanneer moet ik me beter melden?',
        body:
          'Zodra je weer aan het werk gaat. Beter melden doe je ook via het portaal, in de Verzuim-sectie. Niet vergeten — anders blijft je ziekmelding open staan en gaat het mis met je urenregistratie.',
      },
      {
        heading: 'Wat als ik langer ziek ben?',
        body:
          'Bij langdurige ziekte (meer dan een week) belt de coördinator je. Bij meer dan 6 weken word je opgeroepen voor de bedrijfsarts. SWV regelt dat traject volledig voor je.',
      },
    ],
  },
  {
    id: 'vakantie',
    icon: <Icon.Palm className="h-5 w-5" />,
    eyebrow: 'Vrij vragen',
    title: 'Hoe werken vakantiedagen?',
    summary: 'Je bouwt 25 dagen per jaar op + vakantiegeld. Aanvragen doe je in het portaal, je coördinator keurt goed.',
    sections: [
      {
        heading: 'Hoeveel vakantie krijg ik?',
        body:
          'Je hebt recht op 25 vakantiedagen per kalenderjaar bij een fulltime dienstverband (38 uur per week). Werk je minder uren, dan is je vakantie naar rato.',
      },
      {
        heading: 'En vakantiegeld?',
        body:
          'Je bouwt 8% vakantiegeld op over je brutosalaris. Dat wordt jaarlijks in mei uitbetaald (tenzij je iets anders afspreekt). Saldo zie je in het Vakantie-overzicht in het portaal.',
      },
      {
        heading: 'Hoe vraag ik vrij?',
        body:
          'Ga naar Vakantiedagen in het portaal, vul de periode in. Je coördinator krijgt een melding en keurt binnen een paar dagen goed. Houd rekening met de planning van je leerbedrijf — overleg het kort vooraf.',
      },
      {
        heading: 'Mag ik tijdens schoolweken vrij?',
        body:
          'Niet zonder overleg. Schoolweken zijn verplicht. Vraag vakantie buiten schoolweken aan, of bespreek het eerst met je coördinator als het echt niet anders kan.',
      },
    ],
  },
  {
    id: 'salaris',
    icon: <Icon.Euro className="h-5 w-5" />,
    eyebrow: 'Je salaris',
    title: 'Hoe werkt mijn salaris?',
    summary: 'Je krijgt maandelijks salaris volgens de cao Meubelindustrie. Hoogte hangt af van leeftijd en leerjaar.',
    sections: [
      {
        heading: 'Wanneer krijg ik mijn salaris?',
        body:
          'Maandelijks rond de 25e van de maand op je rekening. De salarisstrook zie je in het portaal onder Documenten. Salaris is berekend op basis van de uren die je leerbedrijf heeft goedgekeurd.',
      },
      {
        heading: 'Hoe hoog is mijn salaris?',
        body:
          'Volgens cao Meubelindustrie. Indicatief per maand bij 32 uur: 16 jaar ~€615, 18 jaar ~€940, 21+ jaar ~€1.580. Exacte bedragen zie je op je salarisstrook. Bij je verjaardag stijgt het automatisch.',
      },
      {
        heading: 'Waarom is mijn salaris lager dan verwacht?',
        body:
          'Mogelijke redenen: niet alle uren zijn goedgekeurd, je leerbedrijf heeft een week afgekeurd, je was ziek of had verlof zonder doorbetaling. Open de urenregistratie en check de status per week.',
      },
      {
        heading: 'Vragen over je strook?',
        body:
          'Neem contact op met de binnendienst via samenwerkingsverband@cbm.nl of 023 515 88 30. Zij verwerken alle salarisadministratie.',
      },
    ],
  },
  {
    id: 'verlof',
    icon: <Icon.Calendar className="h-5 w-5" />,
    eyebrow: 'Speciale vrije dagen',
    title: 'Hoe vraag ik bijzonder verlof aan?',
    summary: 'Voor trouwen, geboorte, overlijden of doktersbezoek. Aanvragen via portaal, vaak met doorbetaling.',
    sections: [
      {
        heading: 'Wat valt onder bijzonder verlof?',
        body:
          'Bijvoorbeeld: eigen huwelijk (2 dagen), geboorte kind (geboorteverlof), overlijden directe familie (4 dagen), doktersbezoek dat niet buiten werktijd kan, verhuizing (1 dag per jaar). Volgens cao Meubelindustrie.',
      },
      {
        heading: 'Hoe vraag ik het aan?',
        body:
          'Net als gewone vakantie: in het portaal onder Vakantiedagen. Kies type "Bijzonder verlof" en voeg een korte toelichting toe. Je coördinator verwerkt het en spreekt eventueel een vervanger af met het leerbedrijf.',
      },
      {
        heading: 'Krijg ik doorbetaling?',
        body:
          'Bij de meeste vormen wel (huwelijk, geboorte, overlijden). Bij sommige niet (onbetaald verlof, lang doktersbezoek). De coördinator vertelt het je vooraf.',
      },
    ],
  },
  {
    id: 'opleiding',
    icon: <Icon.BookOpen className="h-5 w-5" />,
    eyebrow: 'Je opleiding',
    title: 'Hoe werkt mijn opleiding?',
    summary: 'Vier dagen werk bij je leerbedrijf, één dag school. Aan het eind diploma, BBL niveau 2 of 3.',
    sections: [
      {
        heading: 'Hoe zit een week eruit?',
        body:
          'Maandag, dinsdag, donderdag en vrijdag werk je bij je leerbedrijf. Woensdag (meestal) ga je naar school. Schoollocatie is per regio verschillend; staat in je planning in het portaal.',
      },
      {
        heading: 'Wat is BBL?',
        body:
          'Beroepsbegeleidende Leerweg. Je leert het vak vooral in de praktijk, met theorieblokken op school. Erkend mbo-traject. Niveau 2: 2 jaar. Niveau 3: 3 jaar. Niveau 4: 4 jaar.',
      },
      {
        heading: 'Wat moet ik regelen voor mijn diploma?',
        body:
          'Aan het eind van je opleiding doe je een Proeve van Bekwaamheid (PvB) op je werkplek en theorie-examens op school. Coördinator en leerbedrijf bereiden je daarop voor. Examengeld betaalt SWV.',
      },
      {
        heading: 'Kan ik doorstromen naar een hoger niveau?',
        body:
          'Ja. Na BBL 2 kun je doorstromen naar BBL 3 of 4. Praat erover met je coördinator. Veel meubelmakers groeien zo door naar interieurbouwer of zelfs eigen bedrijf.',
      },
    ],
  },
];

export default async function StudentHelpPage() {
  const ctx = getDemoSession('STUDENT');
  const s = await getStudentBasic(ctx.studentId!);

  if (!s) return <StudentNotLoaded activeHref="/student/kennisbank" />;

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/kennisbank"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Veelgestelde vragen', subtitle: 'De 6 vragen die we het meeste krijgen — direct beantwoord.' }}
    >
      {/* Quick links bovenaan */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {topics.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-bone-200 p-3 text-center transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft"
              >
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-500 text-white">
                  {t.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-700">
                  {t.eyebrow}
                </span>
              </a>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Topics */}
      <div className="space-y-6">
        {topics.map((t) => (
          <article key={t.id} id={t.id} className="overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card">
            <div className="border-b border-bone-200 bg-bone-50/60 p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary-500 text-white">
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">
                    {t.eyebrow}
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink-900 sm:text-2xl">
                    {t.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.summary}</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-6">
              {t.sections.map((sec) => (
                <div key={sec.heading}>
                  <h3 className="font-display text-base font-bold text-ink-900">{sec.heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{sec.body}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Niet gevonden CTA */}
      <Card className="mt-6">
        <CardBody>
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900">Antwoord niet gevonden?</h3>
              <p className="mt-1 text-sm text-ink-600">
                Stuur een berichtje naar je coördinator of bel direct.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <WhatsAppButton label="App coördinator" />
              <Link href="/student/berichten" className="btn-secondary">
                <Icon.Bell className="h-4 w-4" />
                Portal-bericht
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      <WhatsAppFloating />
    </PortalShell>
  );
}
