import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { AnimatedFlow } from '@/components/marketing/AnimatedFlow';
import { AvgSection } from '@/components/marketing/AvgSection';

const roles: Array<{
  role: string;
  title: string;
  name: string;
  age: string;
  region: string;
  company: string;
  href: string;
  color: 'primary' | 'navy' | 'emerald' | 'amber';
  bullets: string[];
}> = [
  {
    role: 'STUDENT',
    title: 'Student',
    name: 'Jamie van Dijk',
    age: '19 jaar · Interieurbouwer BBL 3',
    region: 'Regio Noord-Nederland',
    company: 'De Vries Interieurbouw, Groningen',
    href: '/student',
    color: 'primary',
    bullets: [
      '1-tik uren invoer + "vorige week kopiëren"',
      'Direct contact met coördinator via WhatsApp',
      'Ziekmelding in 10 seconden',
      'Eigen documenten, contracten en planning',
      'Push-melding bij berichten en taken',
    ],
  },
  {
    role: 'COORDINATOR',
    title: 'Coördinator',
    name: 'Sanne Bakker',
    age: 'Regio Noord-Nederland',
    region: '9 lidbedrijven · 7 studenten',
    company: '',
    href: '/coordinator',
    color: 'navy',
    bullets: [
      'Sollicitaties auto-routed op postcode',
      'Goedkeuren van weekstaten en verzuim',
      'Diploma- en uitstroomplanning',
      'Real-time notificaties bij nieuwe acties',
      'Overzicht van eigen regio + lidbedrijven',
    ],
  },
  {
    role: 'COMPANY',
    title: 'Lidbedrijf',
    name: 'Jan de Vries',
    age: 'Praktijkopleider',
    region: 'De Vries Interieurbouw',
    company: 'Groningen · CBM-lid',
    href: '/lidbedrijf',
    color: 'emerald',
    bullets: [
      'Weekstaten goedkeuren in 1 tik',
      'Direct zicht op studenten en uren',
      'Auto-sync naar Cleverdesk (uren)',
      'Geen overtikken meer',
      'Eigen 10 voordelen + Cleverdesk uitleg',
    ],
  },
  {
    role: 'ADMIN',
    title: 'Admin',
    name: 'Eva Hoogeveen',
    age: 'Centraal beheer SWV',
    region: 'Alle regio\'s',
    company: '',
    href: '/admin',
    color: 'amber',
    bullets: [
      'Synergy kaartenbak: sollicitaties → student-ID',
      'Cleverdesk + Exact Synergy sync-status',
      'Audit logs, security logs, GDPR',
      'Gebruikers, rollen en rechten',
      'Volledig regio- en lidbedrijfbeheer',
    ],
  },
];

const features = [
  {
    icon: <Icon.Bell className="h-5 w-5" />,
    title: 'Auto-routing sollicitaties',
    body: 'Sollicitatie via formulier → postcode-match → coördinator krijgt mail + push-melding. Geen overtikken meer.',
  },
  {
    icon: <Icon.Activity className="h-5 w-5" />,
    title: 'Slimme uren-invoer',
    body: 'Studenten vullen uren in via mobiel met 1-tik "vorige week kopiëren". Auto-sync naar Cleverdesk.',
  },
  {
    icon: <Icon.Shield className="h-5 w-5" />,
    title: 'AVG-proof opslag',
    body: 'Documenten versleuteld, bewaartermijnen, audit logs, security logs. Klaar voor DPIA en compliance.',
  },
  {
    icon: <Icon.Link className="h-5 w-5" />,
    title: 'Synergy + Cleverdesk koppeling',
    body: 'Centraal kaartenbak voor admin. ID-matching, sync-status en bulk-acties op één plek.',
  },
  {
    icon: <Icon.Refresh className="h-5 w-5" />,
    title: 'Push notifications + email',
    body: 'Real-time meldingen via Resend (email) en browser push. Werkt ook als app dicht is (PWA).',
  },
  {
    icon: <Icon.User className="h-5 w-5" />,
    title: 'WhatsApp contact ingebakken',
    body: 'Studenten appen hun coördinator en werkbegeleider direct vanaf de portal. Pre-filled bericht.',
  },
];

const flow = [
  {
    step: '01',
    title: 'Sollicitatie binnen',
    body: 'Iemand vult /solliciteren in. Postcode bepaalt regio.',
  },
  {
    step: '02',
    title: 'Auto-routing',
    body: 'Coördinator krijgt mail + push-melding. Sollicitatie zit in /coordinator/sollicitaties.',
  },
  {
    step: '03',
    title: 'Aanmaken in kaartenbak',
    body: 'Admin koppelt Synergy ID + Cleverdesk ID en maakt student aan vanuit /admin/kaartenbak.',
  },
  {
    step: '04',
    title: 'Student in eigen portaal',
    body: 'Vult uren in via dashboard, krijgt rondleiding bij eerste bezoek, kan appen.',
  },
  {
    step: '05',
    title: 'Lidbedrijf keurt goed',
    body: 'Krijgt mail bij ingediende weekstaat, 1-tik goedkeuren of afkeuren met reden.',
  },
  {
    step: '06',
    title: 'Cleverdesk sync',
    body: 'Goedgekeurde uren automatisch in Cleverdesk. Geen handmatig werk meer.',
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bone-50">
      {/* Hero */}
      <header className="border-b border-bone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-ink-600 hover:text-primary-600">
            ← Terug naar site
          </Link>
        </div>
      </header>

      <section className="border-b border-bone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-primary-500 text-white">
              <Icon.Activity className="h-2.5 w-2.5" />
            </span>
            Demo omgeving — voor presentatie aan SWV
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl md:text-5xl">
            Welkom in het{' '}
            <span className="relative inline-block">
              SWV-portaal
              <span className="absolute inset-x-0 -bottom-1 h-1.5 bg-primary-300/70" />
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 md:text-lg">
            Eén plek voor sollicitaties, studenten, lidbedrijven, uren, contracten en
            documenten. Klik hieronder op een rol om direct als demo-gebruiker in te loggen.
          </p>
        </div>
      </section>

      {/* Rol cards */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            Stap 1 van de demo
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Kies een rol om te bekijken
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Elke rol heeft een eigen portaal met aangepaste functies. Klik op een kaart om als
            die persoon ingelogd te raken.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {roles.map((r) => (
            <RoleCard key={r.role} {...r} />
          ))}
        </div>
      </section>

      {/* Wat zit erin */}
      <section className="border-y border-bone-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              Wat zit erin
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Kernfuncties die handmatig werk vervangen
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-2xl border border-bone-200 bg-bone-50 p-5">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-500 text-white">
                  {f.icon}
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* End-to-end flow */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            End-to-end flow
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Van sollicitatie tot uitbetaalde uren
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Eén systeem voor alle stappen. Geen email-naar-Excel-naar-Synergy-naar-Cleverdesk meer.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flow.map((s) => (
            <article key={s.step} className="rounded-2xl border border-bone-200 bg-white p-5 shadow-card">
              <div className="font-display text-5xl font-bold text-primary-200">{s.step}</div>
              <h3 className="mt-3 font-display text-base font-bold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 5 hoofdproblemen — visueel */}
      <section className="border-y border-bone-200 bg-bone-50 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              De vijf hoofdproblemen
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Van versnippering naar één werkplek
            </h2>
            <p className="mt-2 max-w-3xl text-ink-600">
              Het portaal lost vijf concrete pijnpunten op. Per probleem zie je hieronder de
              huidige situatie (links) en de nieuwe werkwijze (rechts).
            </p>
          </div>

          <div className="space-y-5">
            <AnimatedFlow
              number="1"
              problem="Versnipperde informatie"
              oldBoxes={['Synergy', 'Globe', 'Cleverdesk', 'DocuSign', 'Arbodienst', 'Outlook', 'Excel', 'P-schijf']}
              oldPain="Zoeken naar één studentdossier kost 5 minuten over 8 systemen."
              newLabel="Cross-system dashboard"
              newGain="Eén matrix: sync-status Synergy + Cleverdesk + DocuSign + Globe per student."
            />
            <AnimatedFlow
              number="2"
              problem="Veel handmatige overdracht"
              oldBoxes={['Student belt', 'Binnendienst noteert', 'Mail aan coördinator', 'Excel bijwerken']}
              oldPain="Iedere stap kan vergeten worden. Tussenstops kosten dagen."
              newLabel="Direct in juiste dashboard"
              newGain="Student ziekmelding → coördinator + lidbedrijf zien het direct."
              durationMs={5000}
            />
            <AnimatedFlow
              number="3"
              problem="Geen centrale communicatie"
              oldBoxes={['Mail', 'WhatsApp privé', 'Telefoon', 'Cleverdesk berichten', 'DocuSign mails']}
              oldPain="Geen archief, geen overzicht, collega weet niet wat is afgesproken."
              newLabel="Unified inbox per rol"
              newGain="Alle sollicitaties, berichten, signalen op één plek met filters."
              durationMs={4800}
            />
            <AnimatedFlow
              number="4"
              problem="Geen automatische signalering"
              oldBoxes={['Ziekmelding vergeten', 'Herstel niet doorgegeven', 'Uren niet ingevuld', 'Contract verloopt']}
              oldPain="Belangrijke acties blijven liggen tot iemand het toevallig opmerkt."
              newLabel="Signaleringen-engine"
              newGain="Automatisch detecteren en doorzetten naar de juiste persoon."
              durationMs={5200}
            />
            <AnimatedFlow
              number="5"
              problem="Excel als vangnet"
              oldBoxes={['Uitdienstlijsten.xlsx', 'Verloningscontroles.xlsx', 'Facturatie-uitz.xlsx', 'Actielijsten.xlsx']}
              oldPain="Foutgevoelig, één persoon kent de regels, geen backup."
              newLabel="Workflow pagina's in portaal"
              newGain="Mutaties, eindafrekening en facturatie als geleide flow met checks."
              durationMs={4600}
            />
          </div>

          <div className="mt-10 rounded-3xl border border-primary-200 bg-white p-6 text-center">
            <p className="font-display text-lg font-bold text-ink-900">
              Het doel is niet digitalisering. Het doel is minder handmatig werk, minder fouten, en groeien zonder evenredig meer personeel.
            </p>
          </div>
        </div>
      </section>

      <AvgSection />

      {/* Demo tips */}
      <section className="bg-bone-100 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-primary-200 bg-white p-8 shadow-card">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary-500 text-white">
                <Icon.BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink-900">Tips voor de demo</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-700">
                  <li><strong>Begin als Student</strong> — laat de tutorial zien die automatisch start.</li>
                  <li>Vul een paar uren in en klik <em>Indienen</em>. Een mail én notification gaat uit.</li>
                  <li>Switch naar <strong>Lidbedrijf</strong>: weekstaat staat klaar in &lsquo;Weekstaten goedkeuren&rsquo;.</li>
                  <li>Open <strong>Coördinator</strong> → klik op de bell rechtsboven. Live notificaties.</li>
                  <li>Toon <strong>/solliciteren</strong>: vul iets in met postcode 9711. Switch direct naar Admin → kaartenbak.</li>
                  <li>Sluit af met <strong>Admin → Synergy kaartenbak</strong>: laat ID-koppeling en sync-status zien.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login form (klein, voor 'echte' login mockup) */}
      <section className="border-t border-bone-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-md px-6">
          <div className="text-center">
            <h2 className="font-display text-xl font-bold text-ink-900">Inloggen met SWV-account</h2>
            <p className="mt-1 text-sm text-ink-500">In productie: SSO + 2FA voor admins.</p>
          </div>
          <form className="mt-6 space-y-4">
            <div>
              <label className="label mb-1.5 block">E-mailadres</label>
              <input type="email" className="input" placeholder="jij@swvmeubel.nl" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="label">Wachtwoord</label>
                <Link href="/wachtwoord-vergeten" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  Vergeten?
                </Link>
              </div>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Icon.Lock className="h-4 w-4" />
              Inloggen
            </button>
            <p className="text-center text-xs text-ink-500">
              Door in te loggen ga je akkoord met onze{' '}
              <Link href="/privacy" className="font-semibold text-primary-600">privacyverklaring</Link>.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-bone-200 bg-bone-50 py-6">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-ink-500">
          SWV Meubel · Westerhoutpark 10, 2012 JM Haarlem · 023 515 88 30
        </div>
      </footer>
    </div>
  );
}

function RoleCard({
  title,
  name,
  age,
  region,
  company,
  href,
  color,
  bullets,
}: {
  title: string;
  name: string;
  age: string;
  region: string;
  company: string;
  href: string;
  color: 'primary' | 'navy' | 'emerald' | 'amber';
  bullets: string[];
}) {
  const headerBg = {
    primary: 'bg-primary-500',
    navy: 'bg-navy-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
  }[color];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`${headerBg} px-6 py-5 text-white`}>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">{title}</div>
        <h3 className="mt-1 font-display text-2xl font-bold">{name}</h3>
        <p className="mt-1 text-sm text-white/90">{age}</p>
        <p className="text-xs text-white/75">{region}{company ? ` · ${company}` : ''}</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <ul className="mb-5 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ink-700">
              <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-ink-900 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary-500 transition"
        >
          Open {title.toLowerCase()} portaal
          <Icon.ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
